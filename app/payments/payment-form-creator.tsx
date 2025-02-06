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
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function PaymentFormCreator() {
  const router = useRouter()

  const [bookingType, setBookingType] = useState<BookingType>("airbnb")
  const [securityDeposit, setSecurityDeposit] = useState("600")
  const [securityDepositOption, setSecurityDepositOption] = useState<"600" | "800" | "1000" | "other">("600")
  const [customSecurityDeposit, setCustomSecurityDeposit] = useState("")
  const [guestName, setGuestName] = useState("")
  const [bookingId, setBookingId] = useState("")
  
  // Additional fees state
  const [accommodationFee, setAccommodationFee] = useState("")
  const [earlyCheckIn, setEarlyCheckIn] = useState("")
  const [lateCheckOut, setLateCheckOut] = useState("")
  
  // Addons state
  const [addons, setAddons] = useState<Addon[]>([
    { name: "Cot", price: 99 },
    { name: "Sofabed", price: 99 },
    { name: "High chair", price: 60 },
    { name: "Pet fee", price: 130 },
  ])
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [newAddonName, setNewAddonName] = useState("")
  const [newAddonPrice, setNewAddonPrice] = useState("")

  // Dialog state
  const [showDialog, setShowDialog] = useState(false)
  const [dialogStep, setDialogStep] = useState<"review" | "payment">("review")

  // New states for card validation
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cardType, setCardType] = useState<string | null>(null)
  const [cvc, setCVC] = useState("")
  const [errors, setErrors] = useState({
    amount: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: ""
  })

  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

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
    setSelectedAddons((prev) => 
      prev.includes(addonName) 
        ? prev.filter((a) => a !== addonName) 
        : [...prev, addonName]
    )
  }

  const handleAddNewAddon = () => {
    if (newAddonName && newAddonPrice) {
      setAddons([...addons, { name: newAddonName, price: Number(newAddonPrice) }])
      setNewAddonName("")
      setNewAddonPrice("")
    }
  }

  const handleRemoveAddon = (addonName: string) => {
    setAddons(addons.filter((addon) => addon.name !== addonName))
    setSelectedAddons(selectedAddons.filter((name) => name !== addonName))
  }

  const calculateTotal = () => {
    let total = 0

    // Add security deposit for OTA and direct bookings
    if (bookingType !== "airbnb") {
      total += Number(securityDeposit) || 0
    }

    // Add accommodation fee
    if (accommodationFee) {
      total += Number(accommodationFee) || 0
    }

    // Add selected addons
    selectedAddons.forEach((addonName) => {
      const addon = addons.find((a) => a.name === addonName)
      if (addon) total += addon.price
    })

    // Add early check-in fee
    if (earlyCheckIn) {
      total += Number(earlyCheckIn) * 60
    }

    // Add late check-out fee
    if (lateCheckOut) {
      total += Number(lateCheckOut) * 60
    }

    return total
  }

  const handleGeneratePaymentLink = () => {
    setShowDialog(true)
    setDialogStep("review")
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
    
    // Clear error when typing
    setErrors(prev => ({ ...prev, cardNumber: "" }))
    
    // Detect card type
    const type = getCardType(formatted)
    setCardType(type)
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setExpiryDate(formatted)
    
    // Clear error when typing
    setErrors(prev => ({ ...prev, expiryDate: "" }))
  }

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCVC(e.target.value)
    setCVC(formatted)
    
    // Clear error when typing
    setErrors(prev => ({ ...prev, cvc: "" }))
  }

  const validateAmount = (amount: string) => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) {
      return { isValid: false, message: "Please enter a valid amount" }
    }
    if (numAmount <= 0) {
      return { isValid: false, message: "Amount must be greater than $0" }
    }
    if (numAmount > 99999.99) {
      return { isValid: false, message: "Amount cannot exceed $99,999.99" }
    }
    return { isValid: true, message: "" }
  }

  const validateCardName = (name: string) => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name)
  }

  const validatePaymentForm = () => {
    const newErrors = {
      amount: "",
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: ""
    }

    // Amount validation
    const total = calculateTotal()
    const amountValidation = validateAmount(total.toString())
    if (!amountValidation.isValid) {
      newErrors.amount = amountValidation.message
      toast({
        title: "Invalid Amount",
        description: amountValidation.message,
        variant: "destructive"
      })
      return false
    }

    // Card name validation
    if (!validateCardName(guestName)) {
      newErrors.cardName = "Please enter a valid name (letters and spaces only)"
    }

    // Card number validation
    if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = "Invalid card number"
    }

    // Card type validation
    if (!cardType) {
      newErrors.cardNumber = "Unsupported card type"
    }

    // Expiry date validation
    if (!validateExpiryDate(expiryDate)) {
      newErrors.expiryDate = "Invalid expiry date"
    } else {
      // Additional expiry validation
      const [month, year] = expiryDate.split('/')
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
      const today = new Date()
      
      if (expiry < today) {
        newErrors.expiryDate = "Card has expired"
      }
    }

    // CVC validation
    if (!validateCVC(cvc, cardType)) {
      newErrors.cvc = `Invalid CVC (${getCVCLength(cardType)} digits required)`
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== "")
  }

  const handlePayment = async () => {
    const total = calculateTotal()
    if (total <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Payment amount must be greater than $0",
        variant: "destructive"
      })
      return
    }

    if (!validatePaymentForm()) {
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
        router.push(`/payments/success/${response.data.transactionID}`);
      } else {
        toast({
          title: "Payment Failed",
          description: response.error || "Payment processing failed",
          variant: "destructive"
        })
      }
      
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An error occurred processing payment",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="p-4 md:p-8 w-full flex justify-center min-h-screen">
      <Card className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-[320px,1fr] overflow-hidden">
        {/* Left Side - Booking Type */}
        <div className="bg-gradient-to-b from-indigo-50/50 to-white border-b md:border-b-0 md:border-r border-border p-6 md:p-8">
          <div className="flex flex-col items-center h-full space-y-6">
            <div className="text-center">
              <h3 className="font-semibold text-xl text-indigo-950">Booking Type</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Select the type of booking you want to create
              </p>
            </div>
            <BookingTypeSelector value={bookingType} onChange={setBookingType} />
          </div>
        </div>

        {/* Right Side - Form Fields */}
        <div className="p-6 md:p-8">
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-indigo-950">
                {bookingType === "airbnb" ? "Airbnb" : 
                 bookingType === "ota" ? "OTA Booking" : "Direct Booking"} Details
              </h2>
              <p className="text-muted-foreground">
                Fill in the required information to generate a payment link
              </p>
            </div>

            <div className="space-y-8">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="guest-name" className="text-indigo-950 block text-center">
                    Guest Name
                  </Label>
                  <Input
                    id="guest-name"
                    placeholder="Enter guest's full name"
                    value={guestName}
                    onChange={(e) => {
                      setGuestName(e.target.value)
                      setErrors(prev => ({ ...prev, cardName: "" }))
                    }}
                    className="h-12"
                  />
                  {errors.cardName && (
                    <p className="text-sm text-red-500 mt-1">{errors.cardName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-id" className="text-indigo-950 block text-center">
                    Booking ID
                  </Label>
                  <Input
                    id="booking-id"
                    placeholder="Enter booking ID"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
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
                    onAddNewAddon={(name, price) => {
                      setAddons([...addons, { name, price: Number(price) }])
                    }}
                    onRemoveAddon={handleRemoveAddon}
                    showAccommodationFee={bookingType === "direct"}
                    accommodationFee={accommodationFee}
                    onAccommodationFeeChange={setAccommodationFee}
                  />

                  <CheckInOutSelector
                    earlyCheckIn={earlyCheckIn}
                    lateCheckOut={lateCheckOut}
                    onEarlyCheckInChange={setEarlyCheckIn}
                    onLateCheckOutChange={setLateCheckOut}
                  />
                </div>
              )}

              <div className="flex justify-center pt-4">
                <Button
                  className="h-12 text-lg px-8 bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleGeneratePaymentLink}
                  disabled={!guestName || !bookingId || (bookingType !== "airbnb" && !securityDeposit) || (bookingType === "direct" && !accommodationFee)}
                >
                  Generate Payment Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="p-0 w-full md:max-w-2xl rounded-none md:rounded-lg">
          {/* Header with animation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader className="px-4 py-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {dialogStep === "payment" && (
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -10, opacity: 0 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDialogStep("review")}
                        className="h-8 w-8 -ml-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <DialogTitle className="text-lg font-semibold">
                      {dialogStep === "review" ? "Review Booking" : "Payment"}
                    </DialogTitle>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDialog(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </DialogHeader>
          </motion.div>

          {/* Steps indicator with animation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="px-4 py-3 border-b bg-white"
          >
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div 
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-sm transition-colors duration-300",
                    dialogStep === "review" 
                      ? "bg-indigo-600 text-white" 
                      : "bg-indigo-100 text-indigo-600"
                  )}
                >
                  1
                </div>
                <span className="text-sm">Review</span>
              </motion.div>
              <motion.div 
                className="flex-1 h-[2px] bg-indigo-100 mx-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              />
              <motion.div 
                className="flex items-center gap-3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div 
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-sm transition-colors duration-300",
                    dialogStep === "payment" 
                      ? "bg-indigo-600 text-white" 
                      : "bg-indigo-100 text-indigo-600"
                  )}
                >
                  2
                </div>
                <span className="text-sm">Payment</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Content with staggered animations */}
          <motion.div 
            key={dialogStep}
            initial={{ opacity: 0, x: dialogStep === "payment" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dialogStep === "payment" ? -20 : 20 }}
            transition={{ duration: 0.3 }}
            className="p-4"
          >
            {dialogStep === "review" ? (
              <motion.div 
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                <motion.div 
                  className="bg-white rounded-lg border border-gray-200"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Booking Summary</h3>
                      <Badge variant="secondary" className="capitalize">
                        {bookingType}
                      </Badge>
                    </div>

                    <div className="mt-4 space-y-3">
                      {/* Booking details */}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Booking ID</span>
                        <span>{bookingId}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Guest</span>
                        <span>{guestName}</span>
                      </div>

                      {/* Security Deposit */}
                      {bookingType !== "airbnb" && securityDeposit && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Security Deposit</span>
                          <span>${securityDeposit}</span>
                        </div>
                      )}

                      {/* Accommodation Fee */}
                      {accommodationFee && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Accommodation Fee</span>
                          <span>${accommodationFee}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="p-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Amount</span>
                      <span className="text-lg font-semibold text-indigo-600">
                        ${calculateTotal()}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.button
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="w-full"
                >
                  <Button 
                    className="w-full h-14 text-base font-medium bg-indigo-600 mt-4"
                    onClick={() => setDialogStep("payment")}
                  >
                    Proceed to Payment
                  </Button>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                <motion.div 
                  className="space-y-4"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="card-name" className="text-indigo-950">Name on Card</Label>
                    <Input 
                      id="card-name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Enter name as shown on card"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-number" className="text-indigo-950">Card Number</Label>
                    <div className="relative">
                      <Input 
                        id="card-number"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        className="h-12 pl-12"
                      />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-indigo-950">Expiry Date</Label>
                      <Input 
                        id="expiry"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        placeholder="MM/YY"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc" className="text-indigo-950">CVC</Label>
                      <Input 
                        id="cvc"
                        value={cvc}
                        onChange={handleCVCChange}
                        placeholder="123"
                        type="password"
                        className="h-12"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.button
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="w-full"
                >
                  <Button 
                    className="w-full h-14 text-base font-medium bg-indigo-600"
                    onClick={handlePayment}
                    disabled={isProcessing || calculateTotal() <= 0}
                  >
                    {isProcessing ? "Processing..." : `Pay $${calculateTotal()}`}
                  </Button>
                </motion.button>

                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                  }}
                  className="flex items-center justify-center space-x-2 text-sm text-indigo-600"
                >
                  <CreditCard className="h-4 w-4" />
                  <p>Your payment information is encrypted and secure</p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 