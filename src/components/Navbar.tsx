'use client'

import {useState, useEffect, useRef} from 'react'
import Link from 'next/link'
import { ShoppingCart, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {useRouter} from "next/navigation";
import {formatToVND} from "@/lib/utils";

type Category = {
  id: number
  catName: string
  children: {
    id: number
    catName: string
  }[]
}

type SearchProduct = {
  id: number
  name: string
  price: number
  stock: 'IN_STOCK' | 'OUT_OF_STOCK' | 'RUNNING_LOW'
}

export default function Navbar() {
  const [cartItemCount, setCartItemCount] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  
  const updateCartCount = () => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      const cartItems = JSON.parse(storedCart)
      setCartItemCount(cartItems.length)
    } else {
      setCartItemCount(0)
    }
  }
  
  const handleSearch = async (value: string) => {
    setSearchQuery(value)
    if (value.trim() === "") {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`)
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    }
  }

  const handleSelectProduct = (productId: number) => {
    setSearchQuery("")
    setSearchResults([])
    router.push(`/product/${productId}`)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  useEffect(() => {
    updateCartCount() // Initial count
    
    // Listen for both storage and custom cartUpdated events
    window.addEventListener('cartUpdated', updateCartCount)
    window.addEventListener('storage', updateCartCount)
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount)
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    }
    fetchCategories()
  }, [])

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50 ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              StationeryShop
            </Link>
            <NavigationMenu className="ml-4">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {categories.map((category) => (
                        <li key={category.id} className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href={`/category/${category.catName.toLowerCase()}`}
                            >
                              <div className="mb-2 mt-4 text-lg font-medium">
                                {category.catName}
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                {category.children.map(sub => sub.catName).join(', ')}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center">
            <div className="relative mr-4" ref={searchRef}>
              <div className="relative">
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 rounded-full w-[300px]"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {searchResults.map((product) => (
                          <li
                              key={product.id}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSelectProduct(product.id)}
                          >
                            <div className="flex items-center space-x-4">
                              <img
                                  src={"/placeholder.svg"}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-md"
                              />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">{formatToVND(product.price)}</p>
                              </div>
                            </div>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}
            </div>
            <Link href="/cart">
              <Button variant="ghost" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse ">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
