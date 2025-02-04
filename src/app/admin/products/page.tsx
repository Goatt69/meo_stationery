'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Sample data - in a real app, this would come from your API
const products = [
  { 
    id: 1, 
    name: 'Ballpoint Pen', 
    price: 1.99, 
    stock: 100, 
    category: 'Writing Instruments',
    status: 'In Stock',
    sku: 'PEN-001',
  },
  { 
    id: 2, 
    name: 'Fountain Pen', 
    price: 24.99, 
    stock: 50, 
    category: 'Writing Instruments',
    status: 'Low Stock',
    sku: 'PEN-002',
  },
  { 
    id: 3, 
    name: 'Spiral Notebook', 
    price: 4.99, 
    stock: 200, 
    category: 'Paper Products',
    status: 'In Stock',
    sku: 'NB-001',
  },
  { 
    id: 4, 
    name: 'Hardcover Journal', 
    price: 12.99, 
    stock: 5, 
    category: 'Paper Products',
    status: 'Critical Stock',
    sku: 'NB-002',
  },
]

export default function ProductsPage() {
  const [search, setSearch] = useState('')

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase())
  )

  const getStockStatus = (stock: number): "destructive" | "default" | "outline" | "secondary" => {
    if (stock <= 5) return "destructive"
    if (stock <= 20) return "secondary"
    return "default"
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Link href="/admin/products/add">
          <Button>Add Product</Button>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
          <CardDescription>
            A list of all products and their current stock levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant={getStockStatus(product.stock)}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

