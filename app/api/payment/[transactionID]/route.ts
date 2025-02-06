import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import fetch from 'node-fetch'
import { parseStringPromise } from 'xml2js'

const MW_API_ENDPOINT = "https://base.merchantwarrior.com/token/"
const MW_MERCHANT_UUID = process.env.MW_MERCHANT_UUID || ''
const MW_API_KEY = process.env.MW_API_KEY || ''

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase URL or Service Role Key is not set')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function getCardDetails(cardID: string) {
  try {
    // First verify the card exists in your database
    const { data: cardData, error: dbError } = await supabase
      .from('payments')
      .select('card_token, status')
      .eq('card_token', cardID)
      .single()

    if (dbError || !cardData) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Card token not found in database'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // If card is already marked as expired in your database
    if (cardData.status === 'expired') {
      return new Response(JSON.stringify({
        success: false,
        message: 'Card token is already expired'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const response = await fetch(MW_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        method: "cardInfo",
        merchantUUID: MW_MERCHANT_UUID,
        apiKey: MW_API_KEY,
        cardID: cardID
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to fetch card details from Merchant Warrior:', errorText)
      throw new Error('Failed to fetch card details from Merchant Warrior')
    }

    const text = await response.text()
    const data = await parseStringPromise(text, { explicitArray: false })
    return data
  } catch (error) {
    console.error('Error fetching card details:', error)
    throw error
  }
}

export async function GET(
  request: Request,
  { params }: { params: { transactionID: string } }
) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', params.transactionID)
      .single()

    if (error) throw error
      
    const cardDetails = await getCardDetails(data.card_token)
    return NextResponse.json({ ...data, ...cardDetails.mwResponse })
  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment details' },
      { status: 500 }
    )
  }
}
