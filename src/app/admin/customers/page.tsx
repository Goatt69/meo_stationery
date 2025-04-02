"use client"

import { useEffect, useState } from "react"
import { formatToVND } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

type Customer = {
    id: number
    name: string
    email: string
    totalOrders: number
    totalSpent: number
    lastOrderDate: string
    orders: {
        id: string
        date: string
        total: number
        status: string
    }[]
}
export default function CustomersPage() {
    const [customers, setCustomers] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return "bg-green-500"
            case "PROCESSING":
                return "bg-blue-500"
            case "SHIPPED":
                return "bg-yellow-500"
            case "PENDING":
                return "bg-orange-500"
            case "CANCELLED":
                return "bg-red-500"
            default:
                return "bg-gray-500"
        }
    }
    
    useEffect(() => {
        async function fetchCustomers() {
            try {
                const response = await fetch('/api/customers')
                const data = await response.json()
                setCustomers(data)
            } catch (error) {
                console.error('Failed to fetch customers:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCustomers()
    }, [])

    const filteredCustomers = customers.filter(
        (customer : Customer) =>
            customer.name.toLowerCase().includes(search.toLowerCase()) ||
            customer.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
    
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Search customers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
    
                <Card>
                    <CardHeader>
                        <CardTitle>Customer List</CardTitle>
                        <CardDescription>View and manage all customer information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Total Orders</TableHead>
                                    <TableHead>Total Spent</TableHead>
                                    <TableHead>Last Order</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers.map((customer : Customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">{customer.name}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.totalOrders}</TableCell>
                                        <TableCell>{formatToVND(customer.totalSpent)}</TableCell>
                                        <TableCell>{new Date(customer.lastOrderDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(customer)}>
                                                        View Orders
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[625px]">
                                                    <DialogHeader>
                                                        <DialogTitle>{customer.name}'s Orders</DialogTitle>
                                                        <DialogDescription>Order history for {customer.email}</DialogDescription>
                                                    </DialogHeader>
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Order ID</TableHead>
                                                                <TableHead>Date</TableHead>
                                                                <TableHead>Total</TableHead>
                                                                <TableHead>Status</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {customer.orders
                                                                .filter(order => order.status !== 'CANCELLED')
                                                                .map((order) => (
                                                                <TableRow key={order.id}>
                                                                    <TableCell>{order.id}</TableCell>
                                                                    <TableCell>{order.date}</TableCell>
                                                                    <TableCell>{formatToVND(order.total)}</TableCell>
                                                                    <TableCell>
                                                                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                                                                            {order.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
