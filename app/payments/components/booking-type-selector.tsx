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
      className="flex justify-between gap-2 w-full"
    >
      <Label
        htmlFor="airbnb"
        className={cn(
          "flex-1 flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
          "hover:border-indigo-200 hover:bg-indigo-50/50",
          value === "airbnb" 
            ? "border-indigo-600 bg-indigo-50 shadow-sm" 
            : "border-border"
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
          "p-2 rounded-lg transition-all duration-200 mb-2",
          value === "airbnb" 
            ? "bg-indigo-600 text-white" 
            : "bg-indigo-100 text-indigo-600"
        )}>
          <Home className="h-5 w-5" />
        </div>
        <div className="text-center">
          <div className="font-medium text-sm text-indigo-950">Airbnb</div>
        </div>
      </Label>

      <Label
        htmlFor="ota"
        className={cn(
          "flex-1 flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
          "hover:border-indigo-200 hover:bg-indigo-50/50",
          value === "ota" 
            ? "border-indigo-600 bg-indigo-50 shadow-sm" 
            : "border-border"
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
          "p-2 rounded-lg transition-all duration-200 mb-2",
          value === "ota" 
            ? "bg-indigo-600 text-white" 
            : "bg-indigo-100 text-indigo-600"
        )}>
          <Globe className="h-5 w-5" />
        </div>
        <div className="text-center">
          <div className="font-medium text-sm text-indigo-950">OTA Booking</div>
        </div>
      </Label>

      <Label
        htmlFor="direct"
        className={cn(
          "flex-1 flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
          "hover:border-indigo-200 hover:bg-indigo-50/50",
          value === "direct" 
            ? "border-indigo-600 bg-indigo-50 shadow-sm" 
            : "border-border"
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
          "p-2 rounded-lg transition-all duration-200 mb-2",
          value === "direct" 
            ? "bg-indigo-600 text-white" 
            : "bg-indigo-100 text-indigo-600"
        )}>
          <Building2 className="h-5 w-5" />
        </div>
        <div className="text-center">
          <div className="font-medium text-sm text-indigo-950">Direct Booking</div>
        </div>
      </Label>
    </RadioGroup>
  )
} 