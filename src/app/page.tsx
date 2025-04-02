import { prisma } from '@/lib/prisma'
import ProductGrid from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 8 // Limit to 8 products for the main page
  });
  
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl overflow-hidden">
          <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Meo Stationery
              </h1>
              <p className="text-blue-100 text-lg mb-8">
                Khám phá bộ sưu tập văn phòng phẩm chất lượng cao với thiết kế độc đáo, 
                giúp không gian làm việc của bạn trở nên sáng tạo và hiệu quả hơn.
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Khám phá ngay
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('/stationery-pattern.png')] opacity-10 mix-blend-overlay"></div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Danh mục nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Bút & Viết", image: "/categories/pens.jpg", fallback: "/placeholder.svg" },
            { name: "Sổ & Giấy", image: "/categories/notebooks.jpg", fallback: "/placeholder.svg" },
            { name: "Dụng cụ văn phòng", image: "/categories/office.jpg", fallback: "/placeholder.svg" },
            { name: "Phụ kiện học tập", image: "/categories/accessories.jpg", fallback: "/placeholder.svg" }
          ].map((category, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden group h-40 shadow-md">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <Image 
                src={category.image} 
                alt={category.name}
                width={300}
                height={200}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                style={{ objectFit: 'cover' }}
                // Using Next.js Image component with proper fallback
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAJJXIDTjgAAAABJRU5ErkJggg=="
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-white font-medium">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sản phẩm mới</h2>
          <Link href="/products">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <ProductGrid products={products}/>
      </section>
    </div>
  )
}
