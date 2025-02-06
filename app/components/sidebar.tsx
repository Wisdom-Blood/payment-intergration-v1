import { Home, CreditCard, Settings, Users, HelpCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: Users, label: "Guests", href: "/guests" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
]

export function Sidebar() {
  return (
    <div className="fixed left-0 h-full w-64 bg-sidebar-background border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <span className="text-xl font-semibold text-sidebar-foreground">
            Payment Portal
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-x-3 px-3 py-2 rounded-lg text-sm",
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "transition-colors duration-200",
                  item.href === "/payments" && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-x-3 px-3 py-2 rounded-lg">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sm font-medium text-sidebar-accent-foreground">JD</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">John Doe</span>
              <span className="text-xs text-sidebar-foreground/60">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 