import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface AccommodationFeeSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function AccommodationFeeSelector({ value, onChange }: AccommodationFeeSelectorProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <h3 className="font-semibold text-lg text-indigo-950">Accommodation Fee</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-indigo-400 hover:text-indigo-500 transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="bg-indigo-950 text-white">
                <p className="max-w-xs">Total accommodation payment for the stay</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 font-medium">
            $
          </div>
          <Input
            type="number"
            min="0"
            placeholder="Enter accommodation fee"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "h-12 pl-8 text-indigo-950 placeholder:text-indigo-300",
              "border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500/20",
              "transition-all duration-200",
              "rounded-lg",
              value && "border-indigo-500 ring-2 ring-indigo-500/20"
            )}
          />
        </div>

        {value && (
          <div className="mt-2 flex justify-end text-sm text-indigo-600 font-medium">
            Total: ${Number(value).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  )
} 