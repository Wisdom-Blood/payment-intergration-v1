
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

export const processPayment = async (params: ProcessPaymentParams) => {
  try {
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Payment processing failed')
    }

    return data

  } catch (error) {
    console.error('Payment processing error:', error)
    throw error
  }
} 