'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ProductForm() {
  const router = useRouter()
  const params = useParams() as { action?: string; id?: string } // Ensure correct type
  const isEditing = params.action === 'edit'

  const [categories, setCategories] = useState<{ id: number; catName: string }[]>([])
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    categoryId: '',
    description: '',
  })

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    }
    fetchCategories()

    if (isEditing && params.id) {  // Ensure params.id exists before fetching
      const fetchProduct = async () => {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()
        setFormData({
          name: data.name,
          price: data.price.toString(),
          stock: data.quantity.toString(),
          categoryId: data.categoryId?.toString() || '',
          description: data.status || '',
        })
      }
      fetchProduct()
    }
  }, [isEditing, params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, categoryId: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    if (response.ok) {
      router.push('/admin')
    }
  }

  return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-5">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Select name="categoryId" value={formData.categoryId} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>{category.catName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <Button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</Button>
        </form>
      </div>
  )
}
