export const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, '')
  const groups = digits.match(/.{1,4}/g) || []
  return groups.join(' ').substr(0, 19) // 16 digits + 3 spaces
}

export const formatExpiryDate = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length >= 2) {
    const month = digits.substr(0, 2)
    const year = digits.substr(2, 2)
    return `${month}${year ? `/${year}` : ''}`
  }
  return digits
}

export const validateCardNumber = (number: string) => {
  const digits = number.replace(/\D/g, '')
  
  // Check if the length is valid (13-19 digits)
  if (digits.length < 13 || digits.length > 19) return false
  
  // Luhn algorithm
  let sum = 0
  let isEven = false
  
  // Loop through values starting from the rightmost one
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i))

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

export const validateExpiryDate = (value: string) => {
  const [month, year] = value.split('/')
  if (!month || !year || month.length !== 2 || year.length !== 2) return false

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1

  const expMonth = parseInt(month)
  const expYear = parseInt(year)

  if (expMonth < 1 || expMonth > 12) return false
  if (expYear < currentYear) return false
  if (expYear === currentYear && expMonth < currentMonth) return false

  return true
}

export const getCardType = (number: string) => {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    unionpay: /^62/,
    jcb: /^35/
  }

  const digits = number.replace(/\D/g, '')
  
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(digits)) return type
  }
  
  return null
}

export const formatCVC = (value: string) => {
  return value.replace(/\D/g, '').substr(0, 4)
}

export const validateCVC = (cvc: string, cardType: string | null) => {
  const digits = cvc.replace(/\D/g, '')
  
  // American Express requires 4 digits, others require 3
  const requiredLength = cardType === 'amex' ? 4 : 3
  
  if (digits.length !== requiredLength) {
    return false
  }
  
  // Check if input contains only numbers
  return /^\d+$/.test(digits)
}

export const getCVCLength = (cardType: string | null) => {
  return cardType === 'amex' ? 4 : 3
}

export const getCVCPlaceholder = (cardType: string | null) => {
  return cardType === 'amex' ? '1234' : '123'
} 