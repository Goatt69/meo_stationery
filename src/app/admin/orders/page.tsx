"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { formatToVND } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast"
import { OrderDetailsDialog } from "@/components/OrderDetailsDialog"

interface OrderItem {
    orderId: number
    productId: number
    quantity: number
    product: {
        name: string
        price: number
    }
}

interface Order {
  id: number
  userId: number
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  createdAt: string
  user: {
    fullName: string
    email: string
    address: {
      id: number
      street: string
      ward: string | null
      district: string | null
      city: string | null
      country: string | null
      apartment: string | null
    }
  }
  payment: {
    amount: number
  }[]
  items: OrderItem[]
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [isLoading, setIsLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [statusUpdateId, setStatusUpdateId] = useState<number | null>(null)
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders')
                const data = await response.json()
                console.log('Orders data:', data)
                
                // Make sure we're getting the orders with the correct structure
                if (data.success && Array.isArray(data.orders)) {
                    setOrders(data.orders)
                } else {
                    console.error('Unexpected API response format:', data)
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrders()
    }, [])

    const handleUpdateStatus = async (orderId: number, newStatus: string) => {
        if (!orderId || !newStatus) return
        
        setUpdatingStatus(true)
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            })
            
            if (response.ok) {
                // Update local state
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderId 
                            ? { ...order, status: newStatus as 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' } 
                            : order
                    )
                )
                
                // If we're cancelling and updating the selected order, update that too
                if (selectedOrder && selectedOrder.id === orderId) {
                    setSelectedOrder(prev => prev ? {...prev, status: newStatus as 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'} : null)
                }
                
                // Show success toast
                toast({
                    title: "Status Updated",
                    description: `Order #${orderId} status updated to ${newStatus}`,
                    variant: "default",
                })

                // If cancelled, show special message about returned inventory
                if (newStatus === 'CANCELLED') {
                    toast({
                        title: "Inventory Updated",
                        description: "Product quantities have been returned to inventory",
                        variant: "default",
                    })
                }
            } else {
                const errorData = await response.json()
                toast({
                    title: "Error",
                    description: errorData.message || 'Failed to update order status',
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error('Error updating order status:', error)
            toast({
                title: "Error",
                description: 'An error occurred while updating the order status',
                variant: "destructive",
            })
        } finally {
            setUpdatingStatus(false)
            setStatusUpdateId(null)
        }
    }

    const filteredOrders = orders.filter(
        (order) =>
            (order.id.toString().includes(search.toLowerCase()) ||
                order.user.fullName.toLowerCase().includes(search.toLowerCase())) &&
            (statusFilter === "All" || order.status === statusFilter)
    )

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

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
    
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <Input
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PROCESSING">Processing</SelectItem>
                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
    
                <Card>
                    <CardHeader>
                        <CardTitle>Order List</CardTitle>
                        <CardDescription>Manage and review all customer orders.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead className="hidden md:table-cell">Email</TableHead>
                                        <TableHead className="hidden md:table-cell">Date</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center">Loading orders...</TableCell>
                                        </TableRow>
                                    ) : filteredOrders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center">No orders found</TableCell>
                                        </TableRow>
                                    ) : filteredOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.id}</TableCell>
                                            <TableCell>{order.user.fullName}</TableCell>
                                            <TableCell className="hidden md:table-cell">{order.user.email}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell>{formatToVND(order.payment[0]?.amount || 0)}</TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusColor(order.status)} text-white`}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => setSelectedOrder(order)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
                
                <OrderDetailsDialog
                    order={selectedOrder}
                    open={!!selectedOrder}
                    onOpenChange={(open) => !open && setSelectedOrder(null)}
                    onStatusUpdate={handleUpdateStatus}
                    updatingStatus={updatingStatus}
                />
            </div>
        </div>
    )
}
