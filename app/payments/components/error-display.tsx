interface ErrorDisplayProps {
  title: string
  message: string
}

export function ErrorDisplay({ title, message }: ErrorDisplayProps) {
  return (
    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
      <h4 className="text-sm font-semibold text-red-800">{title}</h4>
      <p className="text-sm text-red-600">{message}</p>
    </div>
  )
} 