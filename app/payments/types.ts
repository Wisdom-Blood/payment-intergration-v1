export type BookingType = "airbnb" | "ota" | "direct"

export type Addon = {
  name: string
  price: number
}

export type PaymentFormData = {
  bookingType: BookingType
  securityDeposit: string
  accommodationFee: string
  selectedAddons: string[]
  earlyCheckIn: string
  lateCheckOut: string
  guestName: string
  bookingId: string
} 