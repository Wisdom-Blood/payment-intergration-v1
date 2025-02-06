'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  HomeIcon, 
  CreditCardIcon, 
  SettingsIcon 
} from 'lucide-react'

const routes = [
  {
    label: 'Dashboard',
    icon: HomeIcon,
    href: '/dashboard',
  },
  {
    label: 'Payments',
    icon: CreditCardIcon,
    href: '/payments',
  },
  {
    label: 'Settings',
    icon: SettingsIcon,
    href: '/settings',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-100">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">
          Navigation
        </h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn(
                  "h-5 w-5 mr-3",
                  pathname === route.href ? "text-primary" : "text-muted-foreground",
                )} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 