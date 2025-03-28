'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { formatToVND } from "@/lib/utils"
import { ProductDialog } from "@/components/products/product-dialog"

type Product = {
  id: number
  name: string
  price: number
  status: string | null
  categoryId: number | null
  stock: string
  quantity: number
  description: string | null
  category: {
    catName: string
  } | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<{ id: number; catName: string }[]>([])
  const [search, setSearch] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [dialogContent, setDialogContent] = useState<'add' | 'edit' | null>(null)
  const isDialogOpen = Boolean(dialogContent)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    categoryId: "",
    description: "",
  })
  
  const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category?.catName.toLowerCase().includes(search.toLowerCase()) ||
      product.stock.toLowerCase().includes(search.toLowerCase())
  )
  
  const openAddDialog = () => {
    resetForm()
    setDialogContent('add')
  }

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
  }

  const fetchCategories = () => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
  }
  
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, categoryId: value })
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

  const handleDeleteProduct = async (id: number) => {
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
      stock: product.quantity.toString(),
      categoryId: product.categoryId?.toString() || '',
      description: product.description || '',
    })
    setDialogContent('edit')
  }
  
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      stock: "",
      categoryId: "",
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
                  categories={categories}
                  onInputChange={handleInputChange}
                  onSelectChange={handleSelectChange}
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
                <TableHead>Category</TableHead>
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
                  <TableCell>{product.category?.catName || 'Uncategorized'}</TableCell>
                  <TableCell>{formatToVND(product.price)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock === 'OUT_OF_STOCK' ? 'destructive' : 
                                   product.stock === 'RUNNING_LOW' ? 'secondary' : 'default'}>
                      {product.stock}
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
                                categories={categories}
                                onInputChange={handleInputChange}
                                onSelectChange={handleSelectChange}
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
