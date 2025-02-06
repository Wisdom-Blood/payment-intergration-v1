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
  customValue,
}: SecurityDepositSelectorProps) {
  return (
    <div className="space-y-4">
      <Label className="text-indigo-950 block text-center">Security Deposit</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-auto p-4 border-2 w-full",
            option === "600" && "border-indigo-600 bg-indigo-50"
          )}
          onClick={() => onOptionChange("600")}
        >
          <div className="text-center">
            <div className="font-semibold text-lg">1 Bedroom</div>
            <div className="text-indigo-600 font-medium">$600</div>
          </div>
        </Button>

        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-auto p-4 border-2 w-full",
            option === "800" && "border-indigo-600 bg-indigo-50"
          )}
          onClick={() => onOptionChange("800")}
        >
          <div className="text-center">
            <div className="font-semibold text-lg">2 Bedrooms</div>
            <div className="text-indigo-600 font-medium">$800</div>
          </div>
        </Button>

        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-auto p-4 border-2 w-full",
            option === "1000" && "border-indigo-600 bg-indigo-50"
          )}
          onClick={() => onOptionChange("1000")}
        >
          <div className="text-center">
            <div className="font-semibold text-lg">3 Bedrooms</div>
            <div className="text-indigo-600 font-medium">$1000</div>
          </div>
        </Button>

        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-auto p-4 border-2 w-full",
            option === "other" && "border-indigo-600 bg-indigo-50"
          )}
          onClick={() => onOptionChange("other")}
        >
          <div className="text-center w-full">
            <div className="font-semibold text-lg">Custom</div>
            <div className="text-indigo-600 font-medium">Other amount</div>
          </div>
        </Button>
      </div>

      {option === "other" && (
        <div className="pt-4">
          <Input
            type="number"
            placeholder="Enter custom amount"
            value={customValue}
            onChange={(e) => onCustomChange(e.target.value)}
            className="h-14 md:h-12 text-base"
          />
        </div>
      )}
    </div>
  )
} 