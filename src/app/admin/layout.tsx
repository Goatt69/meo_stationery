'use client'

import '../globals.css'
import { Inter } from 'next/font/google'
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

  return (
    <div className={inter.className}>
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar>
            <SidebarHeader>
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Package className="h-6 w-6" />
                <span>StationeryShop</span>
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
                          <Link href={item.href} className="flex items-center gap-2">
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
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
