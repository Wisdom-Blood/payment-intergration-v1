import { useState } from 'react'
import { validateCardNumber, validateExpiryDate, validateCVC, getCardType } from '../utils'

interface ValidationErrors {
  amount: string
  cardName: string
  cardNumber: string
  expiryDate: string
  cvc: string
}

interface UseFormValidationReturn {
  errors: ValidationErrors
  validateField: (field: keyof ValidationErrors, value: string) => boolean
  validateForm: (formData: Record<string, string>) => boolean
  clearError: (field: keyof ValidationErrors) => void
  setError: (field: keyof ValidationErrors, message: string) => void
}

export function useFormValidation(): UseFormValidationReturn {
  const [errors, setErrors] = useState<ValidationErrors>({
    amount: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  })

  const validateField = (field: keyof ValidationErrors, value: string): boolean => {
    let isValid = true
    let errorMessage = ''

    switch (field) {
      case 'amount':
        const numAmount = parseFloat(value)
        if (isNaN(numAmount) || numAmount <= 0) {
          isValid = false
          errorMessage = 'Amount must be greater than $0'
        }
        break

      case 'cardName':
        if (!value.trim() || !/^[a-zA-Z\s]+$/.test(value)) {
          isValid = false
          errorMessage = 'Please enter a valid name'
        }
        break

      case 'cardNumber':
        if (!validateCardNumber(value)) {
          isValid = false
          errorMessage = 'Invalid card number'
        }
        break

      case 'expiryDate':
        if (!validateExpiryDate(value)) {
          isValid = false
          errorMessage = 'Invalid expiry date'
        }
        break

      case 'cvc':
        const cardType = getCardType(value)
        if (!validateCVC(value, cardType)) {
          isValid = false
          errorMessage = 'Invalid CVC'
        }
        break
    }

    setErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }))

    return isValid
  }

  const validateForm = (formData: Record<string, string>): boolean => {
    let isValid = true

    Object.entries(formData).forEach(([field, value]) => {
      if (!validateField(field as keyof ValidationErrors, value)) {
        isValid = false
      }
    })

    return isValid
  }

  const clearError = (field: keyof ValidationErrors) => {
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }))
  }

  const setError = (field: keyof ValidationErrors, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }))
  }

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    setError
  }
} 