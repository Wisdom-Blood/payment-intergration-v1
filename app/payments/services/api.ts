interface PaymentResponse {
  success: boolean
  data?: {
    transactionID: string
    responseCode: string
    responseMessage: string
    authCode: string
  }
  error?: string
}

interface ProcessPaymentParams {
  amount: string
  cardNumber: string
  cardName: string
  expiryDate: string
  cvc: string
  customerDetails: {
    name: string
    email?: string
    address?: string
    city?: string
    state?: string
    postCode?: string
    country?: string
  }
}

export async function processPayment(params: ProcessPaymentParams): Promise<PaymentResponse> {
  const response = await fetch('/api/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Payment processing failed')
  }

  return response.json()
} 