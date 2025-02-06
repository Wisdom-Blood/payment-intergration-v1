import { NextResponse } from "next/server"
import crypto from "crypto"
import { parseStringPromise } from 'xml2js'
import pino from 'pino'
import { createClient } from '@supabase/supabase-js'

const logger = pino({ level: 'info' });

const MW_API_ENDPOINT = process.env.MW_API_ENDPOINT || 'https://base.merchantwarrior.com/post/'
const MW_MERCHANT_UUID = process.env.MW_MERCHANT_UUID || ''
const MW_API_KEY = process.env.MW_API_KEY || ''
const MW_API_PASSPHRASE = process.env.MW_API_PASSPHRASE || ''

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase URL or Service Role Key is not set in the environment variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Generate MD5 hash for transaction verification
const generateHash = (params: Record<string, string>) => {
  // Step 1: First generate MD5 of API passphrase
  const passphraseMD5 = crypto
    .createHash('md5')
    .update(MW_API_PASSPHRASE)  // Remove trim() as it's not in docs
    .digest('hex')
    .toLowerCase()

  // Step 2: Concatenate in exact order: md5(apiPassphrase) + merchantUUID + apiKey + transactionAmount + transactionCurrency
  const hashString = passphraseMD5 + 
                    params.merchantUUID + 
                    params.transactionAmount + 
                    params.transactionCurrency

  // Step 3: Convert to lowercase
  const lowercaseString = hashString.toLowerCase()

  // Step 4: Generate final MD5
  const finalHash = crypto
    .createHash('md5')
    .update(lowercaseString)
    .digest('hex')
    .toLowerCase()

  
  return finalHash
}

// Parse XML response
const parseResponse = async (response: Response) => {
  const text = await response.text()
  
  try {
    const result = await parseStringPromise(text, { 
      explicitArray: false,
      explicitRoot: true,
      mergeAttrs: true
    })
    
    // Check different possible response structures
    if (result.mwResponse) {
      return result.mwResponse
    } else if (result.Response) {
      return result.Response
    } else {
      throw new Error('Unexpected response format')
    }
  } catch (error) {
    console.error('XML parsing error:', error)
    throw new Error('Failed to parse response')
  }
}

// Example storage function (replace with actual database logic)
async function storePaymentDetails(transactionID: string, cardToken: string, amount: string, customerName: string, customerEmail: string) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([
        { 
          customer_name: customerName,
          transaction_id: transactionID, 
          card_token: cardToken, 
          amount: amount,
          created_at: new Date().toISOString() // Add timestamp
        }
      ])
      .select(); // Add select() to return the inserted data

    if (error) {
      logger.error('Error storing payment details:', { 
        error: error.message, 
        code: error.code,
        details: error.details 
      });
      throw new Error(`Failed to store payment details: ${error.message}`);
    }

    logger.info('Payment details stored successfully:', { transactionID, cardToken });
    return data;
  } catch (error) {
    logger.error('Unexpected error storing payment details:', { error });
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      amount,
      cardNumber,
      cardName,
      expiryDate,
      cvc,
      customerDetails
    } = body

    // Format amount to have exactly 2 decimal places as required by Merchant Warrior
    const formattedAmount = parseFloat(amount).toFixed(2)

    // First get access token
    const tokenResponse = await fetch(MW_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        method: 'getAccessToken',
        merchantUUID: MW_MERCHANT_UUID,
        apiKey: MW_API_KEY,
      })
    })

    const tokenData = await parseResponse(tokenResponse)
    
    if (!tokenData || !tokenData.responseCode) {
      throw new Error('Invalid token response')
    }
    
    if (tokenData.responseCode !== '0') {
      return NextResponse.json(
        { error: tokenData.responseMessage || 'Token request failed' },
        { status: 400 }
      )
    }

    // Process the payment
    const [expiryMonth, expiryYear] = expiryDate.split('/')
    
    const paymentParams = {
      method: 'processCard',
      merchantUUID: MW_MERCHANT_UUID.trim(),
      apiKey: MW_API_KEY.trim(),
      transactionAmount: formattedAmount,
      transactionCurrency: 'AUD',
      transactionProduct: 'Accommodation Payment',
      customerName: customerDetails.name,
      customerCountry: customerDetails.country || 'AU',
      customerState: customerDetails.state || 'QLD',
      customerCity: customerDetails.city || 'Camberwell',
      customerAddress: customerDetails.address || '3/689 Burke Rd Camberwell',
      customerPostCode: customerDetails.postCode || '4000',
      customerEmail: customerDetails.email || 'jasondaviswb@gmail.com',
      paymentCardNumber: cardNumber.replace(/\s/g, ''),
      paymentCardName: cardName,
      paymentCardExpiry: `${expiryMonth}${expiryYear}`,
      paymentCardCSC: cvc,
    }

    // Add validation before creating payment params
    if (!customerDetails.state) {
      console.warn('Customer state not provided, defaulting to QLD')
    }

    // Generate hash using the exact same values that will be sent
    const hash = generateHash({
      merchantUUID: MW_MERCHANT_UUID,
      transactionAmount: formattedAmount,
      transactionCurrency: 'AUD'
    })

    // Add hash to payment params
    const finalPaymentParams = {
      ...paymentParams,
      hash
    }

    const paymentResponse = await fetch(MW_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(finalPaymentParams)
    })

    const paymentData = await parseResponse(paymentResponse)

    if (!paymentData || !paymentData.responseCode) {
      throw new Error('Invalid payment response')
    }

    if (paymentData.responseCode === '0') {

      // Payment successful, now tokenize the card
      const tokenizationResponse = await fetch(MW_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          method: 'addCard',
          merchantUUID: MW_MERCHANT_UUID.trim(),
          apiKey: MW_API_KEY.trim(),
          cardName: cardName,
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardExpiryMonth: expiryMonth,
          cardExpiryYear: expiryYear.slice(-2),
          paymentCardCSC: cvc,
          verifyCard: '1'
        })
      });

      const tokenizationData = await parseResponse(tokenizationResponse);

      if (!tokenizationData || tokenizationData.responseCode !== '0') {
        throw new Error(tokenizationData.responseMessage || 'Card tokenization failed');
      }

      // Store the tokenized card ID and transaction ID
      await storePaymentDetails(paymentData.transactionID, tokenizationData.cardID, formattedAmount, customerDetails.name, customerDetails.email);

      // Return success response
      return NextResponse.json({
        success: true,
        data: {
          transactionID: paymentData.transactionID,
          responseCode: paymentData.responseCode,
          responseMessage: paymentData.responseMessage,
          authCode: paymentData.authCode,
          authMessage: paymentData.authMessage,
          authResponseCode: paymentData.authResponseCode,
          authSettledDate: paymentData.authSettledDate,
          paymentCardNumber: paymentData.paymentCardNumber,
          cardToken: tokenizationData.cardID
        }
      });
    }

    logger.warn('Payment failed', { responseMessage: paymentData.responseMessage });
    return NextResponse.json(
      { 
        success: false,
        error: paymentData.responseMessage || 'Payment processing failed' 
      },
      { status: 400 }
    )

  } catch (error) {
    if (error instanceof Error) {
      logger.error('Payment processing error', { error: error.message });
      return NextResponse.json(
        { 
          error: error.message,
          details: error.stack
        },
        { status: 500 }
      );
    } else {
      logger.error('Payment processing error', { error: 'Unknown error' });
      return NextResponse.json(
        { 
          error: 'An unknown error occurred while processing the payment'
        },
        { status: 500 }
      );
    }
  }
} 