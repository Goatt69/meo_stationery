import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AdminRouteDetector } from '@/components/AdminRouteDetector'
import React from "react";
import {Toaster} from "sonner";
import {Metadata} from "next";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Meo Stationery',
  description: 'Your one-stop shop for all stationery needs',
  keywords: ['stationery', 'văn phòng phẩm', 'dụng cụ học tập'],
  openGraph: {
    title: 'Meo Stationery',
    description: 'Quality stationery products for everyone',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AdminRouteDetector>
          <Navbar />
        </AdminRouteDetector>
        <main className="container mx-auto px-4 py-8 flex-grow">
          {children}
        </main>
        <Toaster richColors position="bottom-right" />
        <AdminRouteDetector>
          <Footer />
        </AdminRouteDetector>
      </body>
    </html>
  )
}
