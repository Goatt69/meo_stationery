'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { formatToVND } from "@/lib/utils"
import { ProductDialog } from "@/components/products/product-dialog"

type Product = {
  id: string
  name: string
  price: number
  quantity: number
  description: string | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [dialogContent, setDialogContent] = useState<'add' | 'edit' | null>(null)
  const isDialogOpen = Boolean(dialogContent)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
  })
  
  const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
  )
  
  const openAddDialog = () => {
    resetForm()
    setDialogContent('add')
  }

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        // Handle both formats - array or object with products property
        const productArray = Array.isArray(data) ? data : data.products || [];
        setProducts(productArray);
      })
  }
  
  useEffect(() => {
    fetchProducts()
  }, [])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddProduct = async () => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      fetchProducts()
      setDialogContent(null)
      resetForm()
    }
  }

  const handleEditProduct = async () => {
    if (!editingProduct) return

    const response = await fetch(`/api/products?id=${editingProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      fetchProducts()
      setDialogContent(null)
      resetForm()
    }
  }

  const handleDeleteProduct = async (id: string) => {
    const response = await fetch(`/api/products?id=${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      fetchProducts()
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      description: product.description || '',
    })
    setDialogContent('edit')
  }
  
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      quantity: "",
      description: "",
    })
    setEditingProduct(null)
  }

  return (
    <div className="w-full space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>Add Product</Button>
          </DialogTrigger>
          {isDialogOpen && (
              <ProductDialog
                  isEdit={dialogContent === 'edit'}
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSubmit={dialogContent === 'edit' ? handleEditProduct : handleAddProduct}
              />
          )}
        </Dialog>
      </div>
  
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
  
      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
          <CardDescription>A list of all products and their current stock levels.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{formatToVND(product.price)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <Badge variant={
                      product.quantity === 0 ? 'destructive' :
                          product.quantity <= 5 ? 'secondary' :
                              'default'
                    }>
                      {product.quantity === 0 ? 'Out of Stock' :
                          product.quantity <= 5 ? 'Running Low' :
                              'In Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                            Edit
                          </Button>
                        </DialogTrigger>
                        {isDialogOpen && dialogContent === 'edit' && (
                            <ProductDialog
                                isEdit={true}
                                formData={formData}
                                onInputChange={handleInputChange}
                                onSubmit={handleEditProduct}
                            />
                        )}
                      </Dialog>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                        Delete
                      </Button>
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
