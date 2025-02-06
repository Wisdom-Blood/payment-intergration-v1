import { RadioGroup } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Home, Building2, Globe } from "lucide-react"
import type { BookingType } from "../types"
import { cn } from "@/lib/utils"

interface BookingTypeSelectorProps {
  value: BookingType
  onChange: (value: BookingType) => void
}

export function BookingTypeSelector({ value, onChange }: BookingTypeSelectorProps) {
  return (
    <RadioGroup 
      value={value} 
      onValueChange={(value) => onChange(value as BookingType)}
      className="flex flex-col items-center"
    >
      <div className="space-y-4 w-full max-w-[280px]">
        <Label
          htmlFor="airbnb"
          className={cn(
            "flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200",
            "hover:border-indigo-200 hover:bg-indigo-50/50 hover:scale-[1.02]",
            "active:scale-[0.98]",
            value === "airbnb" 
              ? "border-indigo-600 bg-indigo-50 shadow-md" 
              : "border-border shadow-sm"
          )}
        >
          <input
            type="radio"
            id="airbnb"
            value="airbnb"
            className="hidden"
            checked={value === "airbnb"}
            onChange={(e) => onChange(e.target.value as BookingType)}
          />
          <div className={cn(
            "p-4 rounded-xl transition-all duration-200 mb-4",
            value === "airbnb" 
              ? "bg-indigo-600 text-white shadow-indigo-200/50" 
              : "bg-indigo-100 text-indigo-600"
          )}>
            <Home className="h-8 w-8" />
          </div>
          <div className="text-center space-y-1">
            <div className="font-semibold text-lg text-indigo-950">Airbnb</div>
            <div className="text-sm text-muted-foreground">For Airbnb bookings</div>
          </div>
        </Label>

        <Label
          htmlFor="ota"
          className={cn(
            "flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200",
            "hover:border-indigo-200 hover:bg-indigo-50/50 hover:scale-[1.02]",
            "active:scale-[0.98]",
            value === "ota" 
              ? "border-indigo-600 bg-indigo-50 shadow-md" 
              : "border-border shadow-sm"
          )}
        >
          <input
            type="radio"
            id="ota"
            value="ota"
            className="hidden"
            checked={value === "ota"}
            onChange={(e) => onChange(e.target.value as BookingType)}
          />
          <div className={cn(
            "p-4 rounded-xl transition-all duration-200 mb-4",
            value === "ota" 
              ? "bg-indigo-600 text-white shadow-indigo-200/50" 
              : "bg-indigo-100 text-indigo-600"
          )}>
            <Globe className="h-8 w-8" />
          </div>
          <div className="text-center space-y-1">
            <div className="font-semibold text-lg text-indigo-950">OTA Booking</div>
            <div className="text-sm text-muted-foreground">Booking.com / Expedia / Marriott</div>
          </div>
        </Label>

        <Label
          htmlFor="direct"
          className={cn(
            "flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200",
            "hover:border-indigo-200 hover:bg-indigo-50/50 hover:scale-[1.02]",
            "active:scale-[0.98]",
            value === "direct" 
              ? "border-indigo-600 bg-indigo-50 shadow-md" 
              : "border-border shadow-sm"
          )}
        >
          <input
            type="radio"
            id="direct"
            value="direct"
            className="hidden"
            checked={value === "direct"}
            onChange={(e) => onChange(e.target.value as BookingType)}
          />
          <div className={cn(
            "p-4 rounded-xl transition-all duration-200 mb-4",
            value === "direct" 
              ? "bg-indigo-600 text-white shadow-indigo-200/50" 
              : "bg-indigo-100 text-indigo-600"
          )}>
            <Building2 className="h-8 w-8" />
          </div>
          <div className="text-center space-y-1">
            <div className="font-semibold text-lg text-indigo-950">Direct Booking</div>
            <div className="text-sm text-muted-foreground">Direct reservations</div>
          </div>
        </Label>
      </div>
    </RadioGroup>
  )
} 