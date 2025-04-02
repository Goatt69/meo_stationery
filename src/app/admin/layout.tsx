'use client'

import '../globals.css'
import { Inter } from 'next/font/google'
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {useState} from "react";
import {LoginForm} from "@/components/LoginForm";

const inter = Inter({ subsets: ['latin'] })

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    title: 'Products',
    icon: Package,
    href: '/admin/products',
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    href: '/admin/orders',
  },
  {
    title: 'Customers',
    icon: Users,
    href: '/admin/customers',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/admin/settings',
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  if (!isLoggedIn) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <LoginForm onLogin={handleLogin} />
        </div>
    )
  }
  
  return (
    <div className={inter.className}>
      <SidebarProvider>
        <div className="flex flex-col md:flex-row h-screen w-full">
          <Sidebar className="w-full md:w-64 md:shrink-0 h-auto md:h-full">
            <SidebarHeader>
              <Link href="/" className="flex items-center gap-2 font-semibold p-4">
                <Package className="h-6 w-6" />
                <span>StationeryShop Admin</span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton 
                          asChild
                          isActive={pathname === item.href}
                        >
                          <Link href={item.href} className="flex items-center gap-2 px-4 py-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
