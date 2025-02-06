import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Info, Clock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface CheckInOutSelectorProps {
  earlyCheckIn: string
  lateCheckOut: string
  onEarlyCheckInChange: (value: string) => void
  onLateCheckOutChange: (value: string) => void
}

export function CheckInOutSelector({
  earlyCheckIn,
  lateCheckOut,
  onEarlyCheckInChange,
  onLateCheckOutChange,
}: CheckInOutSelectorProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-4 md:p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-base md:text-lg text-indigo-950">Check-in/out Options</h3>
        
        <div className="grid gap-4 md:gap-6">
          {/* Early Check-in Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              <Label htmlFor="early-check-in" className="font-medium text-indigo-950">
                Early Check-in
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-indigo-400 hover:text-indigo-500 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-indigo-950 text-white">
                    <p className="max-w-xs">$60 per hour before standard check-in time</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Input
                id="early-check-in"
                type="number"
                min="0"
                max="24"
                placeholder="Number of hours (60$/hr)"
                value={earlyCheckIn}
                onChange={(e) => onEarlyCheckInChange(e.target.value)}
                className="h-14 md:h-12 text-base"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-indigo-400">
                Hours
              </div>
            </div>
            {earlyCheckIn && (
              <div className="flex items-center justify-end space-x-1 text-sm">
                <span className="text-indigo-600 font-medium">
                  Cost: ${Number(earlyCheckIn) * 60}
                </span>
                <span className="text-indigo-400">
                  ({earlyCheckIn} {Number(earlyCheckIn) === 1 ? 'hour' : 'hours'})
                </span>
              </div>
            )}
          </div>

          {/* Late Check-out Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              <Label htmlFor="late-check-out" className="font-medium text-indigo-950">
                Late Check-out
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-indigo-400 hover:text-indigo-500 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-indigo-950 text-white">
                    <p className="max-w-xs">$60 per hour after standard check-out time</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Input
                id="late-check-out"
                type="number"
                min="0"
                max="24"
                placeholder="Number of hours (60$/hr)"
                value={lateCheckOut}
                onChange={(e) => onLateCheckOutChange(e.target.value)}
                className="h-14 md:h-12 text-base"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-indigo-400">
                Hours
              </div>
            </div>
            {lateCheckOut && (
              <div className="flex items-center justify-end space-x-1 text-sm">
                <span className="text-indigo-600 font-medium">
                  Cost: ${Number(lateCheckOut) * 60}
                </span>
                <span className="text-indigo-400">
                  ({lateCheckOut} {Number(lateCheckOut) === 1 ? 'hour' : 'hours'})
                </span>
              </div>
            )}
          </div>
        </div>

        {(earlyCheckIn || lateCheckOut) && (
          <div className="mt-6 pt-4 border-t border-indigo-100">
            <div className="flex justify-between items-center">
              <span className="text-indigo-950 font-medium">Total Additional Hours Cost</span>
              <span className="text-lg font-semibold text-indigo-600">
                ${(Number(earlyCheckIn) + Number(lateCheckOut)) * 60}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 