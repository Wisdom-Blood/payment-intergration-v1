export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 px-4 md:px-8 py-4 md:py-8 w-full">
        {children}
      </main>
    </div>
  )
} 