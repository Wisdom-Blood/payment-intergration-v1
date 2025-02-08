import { useState } from "react"
import { CreditCard, Apple, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PaymentMethod = "card" | "apple-pay" | "google-pay"

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
  cardName: string
  cardNumber: string
  expiryDate: string
  cvc: string
  errors: {
    cardName?: string
    cardNumber?: string
    expiryDate?: string
    cvc?: string
  }
  onCardNameChange: (value: string) => void
  onCardNumberChange: (value: string) => void
  onExpiryDateChange: (value: string) => void
  onCVCChange: (value: string) => void
}

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  cardName,
  cardNumber,
  expiryDate,
  cvc,
  errors,
  onCardNameChange,
  onCardNumberChange,
  onExpiryDateChange,
  onCVCChange
}: PaymentMethodSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="space-y-3 border rounded-lg p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-0.5 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full" />
          <span className="text-base font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 text-transparent bg-clip-text">
            Payment Method
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-4 pt-3">
          <div className="grid grid-cols-2 gap-4">
            <label
              className={cn(
                "relative flex flex-col items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition-all duration-200",
                "hover:border-indigo-200 hover:bg-indigo-50/50",
                selectedMethod === "card"
                  ? "border-indigo-600 bg-indigo-50 shadow-sm"
                  : "border-gray-200"
              )}
            >
              <input
                type="radio"
                className="hidden"
                checked={selectedMethod === "card"}
                onChange={() => onMethodChange("card")}
              />
              <CreditCard className="h-8 w-8 mb-2 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-950">Card</span>
            </label>

            <label
              className={cn(
                "relative flex flex-col items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition-all duration-200",
                "hover:border-indigo-200 hover:bg-indigo-50/50",
                selectedMethod === "apple-pay"
                  ? "border-indigo-600 bg-indigo-50 shadow-sm"
                  : "border-gray-200"
              )}
            >
              <input
                type="radio"
                className="hidden"
                checked={selectedMethod === "apple-pay"}
                onChange={() => onMethodChange("apple-pay")}
              />
              <Apple className="h-8 w-8 mb-2 text-indigo-950" />
              <span className="text-sm font-medium text-indigo-950">Apple Pay</span>
            </label>
          </div>

          {selectedMethod === "card" && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input
                  id="card-name"
                  value={cardName}
                  onChange={(e) => onCardNameChange(e.target.value)}
                  placeholder="Enter name on card"
                  className={cn("h-12", errors.cardName && "border-red-500")}
                />
                {errors.cardName && (
                  <span className="text-sm text-red-500">{errors.cardName}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  value={cardNumber}
                  onChange={(e) => onCardNumberChange(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className={cn("h-12", errors.cardNumber && "border-red-500")}
                />
                {errors.cardNumber && (
                  <span className="text-sm text-red-500">{errors.cardNumber}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    value={expiryDate}
                    onChange={(e) => onExpiryDateChange(e.target.value)}
                    placeholder="MM/YY"
                    className={cn("h-12", errors.expiryDate && "border-red-500")}
                  />
                  {errors.expiryDate && (
                    <span className="text-sm text-red-500">{errors.expiryDate}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    value={cvc}
                    onChange={(e) => onCVCChange(e.target.value)}
                    placeholder="123"
                    className={cn("h-12", errors.cvc && "border-red-500")}
                  />
                  {errors.cvc && (
                    <span className="text-sm text-red-500">{errors.cvc}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedMethod === "apple-pay" && (
            <div className="flex justify-center p-6 border-2 border-dashed rounded-lg">
              <span className="text-gray-500">Apple Pay integration coming soon...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 