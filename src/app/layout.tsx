import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AdminRouteDetector } from './components/AdminRouteDetector'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Stationery E-commerce',
  description: 'Your one-stop shop for all stationery needs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminRouteDetector>
          <Navbar />
        </AdminRouteDetector>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <AdminRouteDetector>
          <Footer />
        </AdminRouteDetector>
      </body>
    </html>
  )
}
