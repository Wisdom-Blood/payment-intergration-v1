import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  placeholder?: string
  type?: string
  className?: string
  icon?: React.ReactNode
  maxLength?: number
}

export function FormField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  className,
  icon,
  maxLength
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-indigo-950 block">
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={cn(
            "h-12",
            icon && "pl-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
} 