import { useState } from "react"
import { Info, ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { BookingType, Addon } from "../types"

interface BookingDetailsSummaryProps {
  guestName: string
  bookingId: string
  accommodationFee?: string
  securityDeposit: string
  selectedAddons: Addon[]
  earlyCheckIn: string
  lateCheckOut: string
  bookingType: BookingType
  className?: string
}

export function BookingDetailsSummary({
  guestName,
  bookingId,
  accommodationFee,
  securityDeposit,
  selectedAddons,
  earlyCheckIn,
  lateCheckOut,
  bookingType,
  className
}: BookingDetailsSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const calculateTotal = () => {
    let total = 0
    if (accommodationFee) total += Number(accommodationFee)
    total += Number(securityDeposit)
    selectedAddons.forEach(addon => total += addon.price)
    if (earlyCheckIn) total += Number(earlyCheckIn) * 60 // $60 per hour
    if (lateCheckOut) total += Number(lateCheckOut) * 60 // $60 per hour
    return total
  }

  return (
    <Card className={cn("p-4", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-0.5 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full" />
          <h3 className="text-base font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 text-transparent bg-clip-text">
            Booking Details
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Guest Name:</span>
            <span className="font-medium">{guestName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Booking ID:</span>
            <span className="font-medium">{bookingId}</span>
          </div>

          <div className="border-t border-gray-100 my-2" />

          {accommodationFee && (
            <div className="flex justify-between">
              <span className="text-gray-600">Accommodation:</span>
              <span className="font-medium">${accommodationFee}</span>
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Security Deposit</span>
              <Info className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <span className="font-medium">${securityDeposit}</span>
          </div>

          {selectedAddons.length > 0 && (
            <>
              <div className="border-t border-gray-100 my-2" />
              <div className="space-y-2">
                <span className="text-gray-600">Additional Charges:</span>
                {selectedAddons.map((addon, index) => (
                  <div key={index} className="flex justify-between pl-2">
                    <span className="text-gray-600">{addon.name}:</span>
                    <span className="font-medium">${addon.price}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {(earlyCheckIn || lateCheckOut) && (
            <>
              <div className="border-t border-gray-100 my-2" />
              {earlyCheckIn && Number(earlyCheckIn) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Early Check-in ({earlyCheckIn}hr):</span>
                  <span className="font-medium">${Number(earlyCheckIn) * 60}</span>
                </div>
              )}
              {lateCheckOut && Number(lateCheckOut) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Late Check-out ({lateCheckOut}hr):</span>
                  <span className="font-medium">${Number(lateCheckOut) * 60}</span>
                </div>
              )}
            </>
          )}

          <div className="border-t border-gray-100 my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total Payment:</span>
            <span className="text-indigo-600">${calculateTotal()}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Refundable Amount:</span>
            <span>${securityDeposit}</span>
          </div>
        </div>
      )}
    </Card>
  )
} 