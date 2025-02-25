'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Download, DollarSign, Users, ShoppingCart, Activity } from 'lucide-react'
import {useEffect, useState} from "react";
import {
  formatToVND,
  calculateTotalRevenue,
  getActiveUsers,
  generateChartData,
  getRecentSales, calculatePercentageChange, getMonthlyComparisons
} from "@/lib/utils"
import {DateRange} from "react-day-picker";

interface Order {
  id: number
  userId: number
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  createdAt: string
  user: {
    fullName: string
    email: string
  }
  payment: {
    amount: number
  }[]
}

export default function DashboardPage() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  })
  
  const filteredOrders = orders.filter((order: Order) => {
    const orderDate = new Date(order.createdAt)
    return (!dateRange?.from || orderDate >= dateRange.from) &&
        (!dateRange?.to || orderDate <= dateRange.to)
  })
  
  const totalOrders = filteredOrders.length
  const totalCustomers = customers.length
  const totalRevenue = calculateTotalRevenue(orders)
  const monthlyData = generateChartData(orders)
  const recentSales = getRecentSales(orders)
  

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, customersRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/customers')
        ])

        const ordersData = await ordersRes.json()
        const customersData = await customersRes.json()

        setOrders(ordersData.orders || [])
        setCustomers(customersData || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])
  
  const comparisons = getMonthlyComparisons(orders)
  
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Row 1 - Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatToVND(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentageChange(comparisons.revenue.current, comparisons.revenue.previous)}% from last month
            </p>
          </CardContent>

        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">{calculatePercentageChange(comparisons.customers.current, comparisons.customers.previous)}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalOrders}</div>
            <p className="text-xs text-muted-foreground">{calculatePercentageChange(comparisons.orders.current, comparisons.orders.previous)}% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 - Chart and Recent Sales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 w-full">
        <Card className="col-span-4 h-full">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Monthly sales overview</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${formatToVND(value)}`}
                />
                <Bar
                  dataKey="total"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made {totalOrders} sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentSales.map((sale) => (
                  <div key={sale.email} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder.svg" alt={sale.name} />
                      <AvatarFallback>
                        {sale.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{sale.name}</p>
                      <p className="text-sm text-muted-foreground">{sale.email}</p>
                    </div>
                    <div className="ml-auto font-medium">{sale.amount}</div>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

