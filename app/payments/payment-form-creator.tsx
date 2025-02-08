"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookingTypeSelector } from "./components/booking-type-selector"
import { SecurityDepositSelector } from "./components/security-deposit-selector"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, ArrowLeft, Info, X } from "lucide-react"
import type { BookingType, Addon } from "./types"
import { AddonSelector } from "./components/addon-selector"
import { CheckInOutSelector } from "./components/check-in-out-selector"
import { cn } from "@/lib/utils"
import { formatCardNumber, formatExpiryDate, validateCardNumber, validateExpiryDate, getCardType, formatCVC, validateCVC, getCVCLength, getCVCPlaceholder } from "./utils"
import { processPayment } from "./services/merchant-warrior"
import { motion } from "framer-motion"
import { BookingDetailsSummary } from "./components/booking-details-summary"
import { PaymentMethodSelector } from "./components/payment-method-selector"
import { ErrorDisplay } from "./components/error-display"

// Add new type for steps
type Step = "booking-details" | "payment" | "confirmation"

export default function PaymentFormCreator() {
  const router = useRouter()

  // Booking Details State
  const [currentStep, setCurrentStep] = useState<Step>("booking-details")
  const [bookingType, setBookingType] = useState<BookingType>("airbnb")
  const [securityDeposit, setSecurityDeposit] = useState("600")
  const [securityDepositOption, setSecurityDepositOption] = useState<"600" | "800" | "1000" | "other">("600")
  const [customSecurityDeposit, setCustomSecurityDeposit] = useState("")
  const [guestName, setGuestName] = useState("")
  const [bookingId, setBookingId] = useState("")
  const [accommodationFee, setAccommodationFee] = useState("")
  const [earlyCheckIn, setEarlyCheckIn] = useState("")
  const [lateCheckOut, setLateCheckOut] = useState("")
  const [addons, setAddons] = useState<Addon[]>([
    { name: "Cot", price: 99 },
    { name: "Sofabed", price: 99 },
    { name: "High chair", price: 60 },
    { name: "Pet fee", price: 130 },
  ])
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple-pay" | "google-pay">("card")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cardType, setCardType] = useState<string | null>(null)
  const [cvc, setCVC] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState({
    amount: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: ""
  })
  const [paymentError, setPaymentError] = useState<{title: string, message: string} | null>(null)

  const handleSecurityDepositOptionChange = (value: "600" | "800" | "1000" | "other") => {
    setSecurityDepositOption(value)
    if (value !== "other") {
      setSecurityDeposit(value)
    } else {
      setSecurityDeposit("")
    }
  }

  const handleCustomSecurityDepositChange = (value: string) => {
    setCustomSecurityDeposit(value)
    setSecurityDeposit(value)
  }

  const handleAddonChange = (addonName: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonName) 
        ? prev.filter(a => a !== addonName) 
        : [...prev, addonName]
    )
  }

  const handleAddNewAddon = (name: string, price: string) => {
    setAddons([...addons, { name, price: Number(price) }])
  }

  const handleRemoveAddon = (name: string) => {
    setAddons(addons.filter(addon => addon.name !== name))
    setSelectedAddons(selectedAddons.filter(selected => selected !== name))
  }

  const calculateTotal = () => {
    if (bookingType === "airbnb") return 0;
    
    let total = 0;
    total += Number(securityDeposit) || 0;
    if (accommodationFee) total += Number(accommodationFee) || 0;
    selectedAddons.forEach(addonName => {
      const addon = addons.find(a => a.name === addonName)
      if (addon) total += addon.price
    });
    if (earlyCheckIn) total += Number(earlyCheckIn) * 60;
    if (lateCheckOut) total += Number(lateCheckOut) * 60;
    return total;
  }

  const validateCardDetails = () => {
    const newErrors = {
      amount: "",
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: ""
    }

    let hasErrors = false

    if (!guestName.trim()) {
      newErrors.cardName = "Name on card is required"
      hasErrors = true
    }

    if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = "Invalid card number"
      hasErrors = true
    }

    if (!validateExpiryDate(expiryDate)) {
      newErrors.expiryDate = "Invalid expiry date"
      hasErrors = true
    }

    if (!validateCVC(cvc, cardType || 'unknown')) {
      newErrors.cvc = "Invalid CVC"
      hasErrors = true
    }

    setErrors(newErrors)
    return !hasErrors
  }

  const handlePayment = async () => {
    setPaymentError(null)
    const total = calculateTotal()
    
    if (total <= 0) {
      setPaymentError({
        title: "Invalid Amount",
        message: "Payment amount must be greater than $0"
      })
      return
    }

    if (paymentMethod === "card" && !validateCardDetails()) {
      setPaymentError({
        title: "Validation Error",
        message: "Please check your card details"
      })
      return
    }

    setIsProcessing(true)
    try {
      const response = await processPayment({
        amount: total.toString(),
        cardNumber,
        cardName: guestName,
        expiryDate,
        cvc,
        customerDetails: {
          name: guestName,
        }
      })
      
      if (response.success) {
        router.push(`/payments/success/${response.data.transactionID}`)
      } else {
        setPaymentError({
          title: "Payment Failed",
          message: response.error || "Payment processing failed"
        })
      }
    } catch (error) {
      setPaymentError({
        title: "Payment Failed",
        message: error instanceof Error ? error.message : "An error occurred processing payment"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="p-4 md:p-8 w-full flex justify-center min-h-screen">
      <Card className="w-full max-w-[1000px]">
        <div className="border-b p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">Complete Your Payment</h2>
          <div className="flex items-center justify-center gap-4">
            <StepIndicator 
              number={1} 
              title="Booking Details" 
              active={currentStep === "booking-details"}
              completed={currentStep === "payment" || currentStep === "confirmation"}
            />
            <div className="h-[2px] w-16 bg-gray-200" />
            <StepIndicator 
              number={2} 
              title="Payment" 
              active={currentStep === "payment"}
              completed={currentStep === "confirmation"}
            />
            <div className="h-[2px] w-16 bg-gray-200" />
            <StepIndicator 
              number={3} 
              title="Confirmation" 
              active={currentStep === "confirmation"}
            />
          </div>
        </div>

        <div className="p-6">
          {currentStep === "booking-details" && (
            <div className="space-y-6">
              <div className="mb-6">
                <BookingTypeSelector value={bookingType} onChange={setBookingType} />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guest-name">Guest Name</Label>
                  <Input
                    id="guest-name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter guest name"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="booking-id">Booking ID</Label>
                  <Input
                    id="booking-id"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    placeholder="Enter booking ID"
                    className="h-12"
                  />
                </div>
              </div>

              {bookingType !== "airbnb" && (
                <div className="space-y-8">
                  <SecurityDepositSelector
                    value={securityDeposit}
                    option={securityDepositOption}
                    onOptionChange={handleSecurityDepositOptionChange}
                    onCustomChange={handleCustomSecurityDepositChange}
                    customValue={customSecurityDeposit}
                  />

                  <AddonSelector
                    addons={addons}
                    selectedAddons={selectedAddons}
                    onAddonChange={handleAddonChange}
                    showAccommodationFee={bookingType === "direct"}
                    accommodationFee={accommodationFee}
                    onAccommodationFeeChange={setAccommodationFee}
                    onAddNewAddon={handleAddNewAddon}
                    onRemoveAddon={handleRemoveAddon}
                  />

                  <CheckInOutSelector
                    earlyCheckIn={earlyCheckIn}
                    lateCheckOut={lateCheckOut}
                    onEarlyCheckInChange={setEarlyCheckIn}
                    onLateCheckOutChange={setLateCheckOut}
                  />
                </div>
              )}

              <Button
                className="w-full h-12"
                onClick={() => setCurrentStep("payment")}
                disabled={!guestName || !bookingId || (bookingType === "direct" && !accommodationFee)}
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {currentStep === "payment" && (
            <div className="space-y-6">
              {paymentError && (
                <ErrorDisplay 
                  title={paymentError.title}
                  message={paymentError.message}
                />
              )}

              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
                cardName={guestName}
                cardNumber={cardNumber}
                expiryDate={expiryDate}
                cvc={cvc}
                errors={errors}
                onCardNameChange={setGuestName}
                onCardNumberChange={(value) => setCardNumber(formatCardNumber(value))}
                onExpiryDateChange={(value) => setExpiryDate(formatExpiryDate(value))}
                onCVCChange={(value) => setCVC(formatCVC(value))}
              />

              {bookingType === "airbnb" && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-center">
                    Note: No payment will be processed - Booking will be handled through Airbnb
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => setCurrentStep("booking-details")}
                >
                  Back
                </Button>
                <Button
                  className="flex-1 h-12"
                  onClick={() => {
                    if (paymentMethod === "apple-pay") {
                      setCurrentStep("confirmation")
                    } else if (validateCardDetails()) {
                      setCurrentStep("confirmation")
                    }
                  }}
                >
                  Continue to Confirmation
                </Button>
              </div>
            </div>
          )}

          {currentStep === "confirmation" && (
            <div className="space-y-6">
              {paymentError && (
                <ErrorDisplay 
                  title={paymentError.title}
                  message={paymentError.message}
                />
              )}

              <BookingDetailsSummary 
                guestName={guestName}
                bookingId={bookingId}
                accommodationFee={bookingType === "direct" ? accommodationFee : undefined}
                securityDeposit={bookingType === "airbnb" ? "0" : securityDeposit}
                selectedAddons={addons.filter(addon => selectedAddons.includes(addon.name))}
                earlyCheckIn={earlyCheckIn}
                lateCheckOut={lateCheckOut}
                bookingType={bookingType}
              />

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-0.5 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full" />
                  <span className="text-base font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 text-transparent bg-clip-text">
                    Payment Method
                  </span>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Card Number</span>
                      <span>
                        {cardNumber.slice(0, 4)}-XXXX-XXXX-{cardNumber.slice(-4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name on Card</span>
                      <span>{guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiry Date</span>
                      <span>{expiryDate}</span>
                    </div>
                  </div>
                )}
                {paymentMethod === "apple-pay" && (
                  <div className="text-center">Apple Pay</div>
                )}
                {bookingType === "airbnb" && (
                  <div className="mt-2 text-center text-gray-600">
                    Payment will be processed through Airbnb
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => setCurrentStep("payment")}
                >
                  Back
                </Button>
                {bookingType === "airbnb" ? (
                  <Button
                    className="flex-1 h-12"
                    onClick={() => router.push('/payments/success')}
                  >
                    Confirm Booking
                  </Button>
                ) : (
                  <Button
                    className="flex-1 h-12"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Pay $${calculateTotal()}`}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

// Step indicator component
function StepIndicator({ 
  number, 
  title, 
  active, 
  completed 
}: { 
  number: number
  title: string
  active: boolean
  completed?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors",
          active && "bg-indigo-600 text-white",
          completed && "bg-green-500 text-white",
          !active && !completed && "bg-gray-100 text-gray-500"
        )}
      >
        {completed ? "✓" : number}
      </div>
      <span className={cn(
        "text-sm",
        active && "text-indigo-600 font-medium",
        completed && "text-green-500",
        !active && !completed && "text-gray-500"
      )}>
        {title}
      </span>
    </div>
  )
} 