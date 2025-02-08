import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type DepositOption = "600" | "800" | "1000" | "other"

interface SecurityDepositSelectorProps {
  value: string
  option: "600" | "800" | "1000" | "other"
  onOptionChange: (value: "600" | "800" | "1000" | "other") => void
  onCustomChange: (value: string) => void
  customValue: string
}

export function SecurityDepositSelector({
  value,
  option,
  onOptionChange,
  onCustomChange,
  customValue
}: SecurityDepositSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-6 w-0.5 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full" />
        <Label className="text-base font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 text-transparent bg-clip-text">
          Security Deposit
        </Label>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <Label
          className={cn(
            "relative flex flex-col items-center p-2 rounded-lg border-2 cursor-pointer transition-all duration-200",
            "hover:border-indigo-200 hover:bg-indigo-50/50",
            option === "600" 
              ? "border-indigo-600 bg-indigo-50 shadow-sm" 
              : "border-gray-200"
          )}
          onClick={() => onOptionChange("600")}
        >
          <span className="text-lg font-bold text-indigo-600">$600</span>
          <span className="text-[10px] text-gray-500">Basic</span>
        </Label>

        <Label
          className={cn(
            "relative flex flex-col items-center p-2 rounded-lg border-2 cursor-pointer transition-all duration-200",
            "hover:border-indigo-200 hover:bg-indigo-50/50",
            option === "800" 
              ? "border-indigo-600 bg-indigo-50 shadow-sm" 
              : "border-gray-200"
          )}
          onClick={() => onOptionChange("800")}
        >
          <span className="text-lg font-bold text-indigo-600">$800</span>
          <span className="text-[10px] text-gray-500">Standard</span>
        </Label>

        <Label
          className={cn(
            "relative flex flex-col items-center p-2 rounded-lg border-2 cursor-pointer transition-all duration-200",
            "hover:border-indigo-200 hover:bg-indigo-50/50",
            option === "1000" 
              ? "border-indigo-600 bg-indigo-50 shadow-sm" 
              : "border-gray-200"
          )}
          onClick={() => onOptionChange("1000")}
        >
          <span className="text-lg font-bold text-indigo-600">$1000</span>
          <span className="text-[10px] text-gray-500">Premium</span>
        </Label>

        <Label
          className={cn(
            "relative flex flex-col items-center p-2 rounded-lg border-2 cursor-pointer transition-all duration-200",
            "hover:border-indigo-200 hover:bg-indigo-50/50",
            option === "other" 
              ? "border-indigo-600 bg-indigo-50 shadow-sm" 
              : "border-gray-200"
          )}
          onClick={() => onOptionChange("other")}
        >
          <span className="text-lg font-bold text-indigo-600">Other</span>
          <span className="text-[10px] text-gray-500">Custom</span>
        </Label>
      </div>
      
      {option === "other" && (
        <div className="relative mt-2">
          <Input
            type="number"
            value={customValue}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="Enter custom amount"
            className="h-10 pl-6 text-sm rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            $
          </span>
        </div>
      )}
    </div>
  )
} 