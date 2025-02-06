import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, X, DollarSign, Package, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Addon } from "../types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

interface AddonSelectorProps {
  addons: Addon[]
  selectedAddons: string[]
  onAddonChange: (addonName: string) => void
  onAddNewAddon: (name: string, price: string) => void
  onRemoveAddon: (name: string) => void
  showAccommodationFee?: boolean
  accommodationFee: string
  onAccommodationFeeChange: (value: string) => void
}

export function AddonSelector({
  addons,
  selectedAddons,
  onAddonChange,
  onAddNewAddon,
  onRemoveAddon,
  showAccommodationFee = false,
  accommodationFee,
  onAccommodationFeeChange,
}: AddonSelectorProps) {
  const [newAddonName, setNewAddonName] = useState("")
  const [newAddonPrice, setNewAddonPrice] = useState("")
  const [showAddNew, setShowAddNew] = useState(false)

  const handleAddNewAddon = () => {
    if (newAddonName && newAddonPrice) {
      onAddNewAddon(newAddonName, newAddonPrice)
      setNewAddonName("")
      setNewAddonPrice("")
      setShowAddNew(false)
    }
  }

  const calculateTotal = () => {
    let total = selectedAddons.reduce((sum, addonName) => {
      const addon = addons.find((a) => a.name === addonName)
      return sum + (addon?.price || 0)
    }, 0)

    if (showAccommodationFee && accommodationFee) {
      total += Number(accommodationFee)
    }

    return total
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-4 md:p-6 shadow-sm">
        {showAccommodationFee && (
          <>
            <div className="flex items-center space-x-2 mb-6">
              <DollarSign className="h-5 w-5 text-indigo-500" />
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

            <div className="mb-8 space-y-4 rounded-lg border border-indigo-100 bg-white/50 p-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 font-medium">
                  $
                </div>
                <Input
                  type="number"
                  min="0"
                  placeholder="Enter accommodation fee"
                  value={accommodationFee}
                  onChange={(e) => onAccommodationFeeChange(e.target.value)}
                  className={cn(
                    "h-12 pl-8 text-indigo-950 placeholder:text-indigo-300",
                    "border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500/20",
                    "transition-all duration-200",
                    "rounded-lg",
                    accommodationFee && "border-indigo-500 ring-2 ring-indigo-500/20"
                  )}
                />
              </div>
              {accommodationFee && (
                <div className="flex justify-end text-sm text-indigo-600 font-medium">
                  Total: ${Number(accommodationFee).toLocaleString()}
                </div>
              )}
            </div>

            <Separator className="mb-6" />
          </>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-indigo-500" />
            <h3 className="font-semibold text-lg text-indigo-950">Add-ons</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddNew(!showAddNew)}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>

        {showAddNew && (
          <div className="mb-6 space-y-4 rounded-lg border border-indigo-100 bg-white/50 p-4">
            <h4 className="font-medium text-sm text-indigo-950">New Add-on</h4>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-addon-name" className="text-sm text-indigo-900">Name</Label>
                <Input
                  id="new-addon-name"
                  placeholder="Add-on name"
                  value={newAddonName}
                  onChange={(e) => setNewAddonName(e.target.value)}
                  className={cn(
                    "h-10 text-indigo-950 placeholder:text-indigo-300",
                    "border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500/20"
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-addon-price" className="text-sm text-indigo-900">Price</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <Input
                    id="new-addon-price"
                    type="number"
                    min="0"
                    placeholder="Price"
                    value={newAddonPrice}
                    onChange={(e) => setNewAddonPrice(e.target.value)}
                    className={cn(
                      "h-10 pl-8 text-indigo-950 placeholder:text-indigo-300",
                      "border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500/20"
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddNew(false)}
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddNewAddon}
                disabled={!newAddonName || !newAddonPrice}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Add Add-on
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {addons.map((addon) => (
            <div
              key={addon.name}
              className={cn(
                "flex items-center justify-between rounded-lg border p-3 md:p-4 transition-colors",
                "border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50/50",
                selectedAddons.includes(addon.name) && "border-indigo-500 bg-indigo-50/80"
              )}
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={addon.name}
                  checked={selectedAddons.includes(addon.name)}
                  onCheckedChange={() => onAddonChange(addon.name)}
                  className="border-indigo-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
                <div>
                  <Label
                    htmlFor={addon.name}
                    className="text-sm font-medium text-indigo-950 cursor-pointer"
                  >
                    {addon.name}
                  </Label>
                  <p className="text-xs text-indigo-500">${addon.price}</p>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveAddon(addon.name)}
                      className="h-8 w-8 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove add-on</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>

        {(selectedAddons.length > 0 || (showAccommodationFee && accommodationFee)) && (
          <div className="mt-4 pt-4 border-t border-indigo-100">
            <div className="space-y-2">
              {showAccommodationFee && accommodationFee && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-indigo-600">Accommodation Fee</span>
                  <span className="font-medium text-indigo-950">
                    ${Number(accommodationFee).toLocaleString()}
                  </span>
                </div>
              )}
              {selectedAddons.length > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-indigo-600">Add-ons Total</span>
                  <span className="font-medium text-indigo-950">
                    ${selectedAddons.reduce((total, addonName) => {
                      const addon = addons.find((a) => a.name === addonName)
                      return total + (addon?.price || 0)
                    }, 0).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 text-base">
                <span className="font-medium text-indigo-950">Total Amount</span>
                <span className="font-semibold text-indigo-600">
                  ${calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 