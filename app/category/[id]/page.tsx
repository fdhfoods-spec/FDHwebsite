'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Star, ShoppingCart, Check, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const categoryId = resolvedParams.id
  const { products, addItem, items } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (categoryId === 'fresh-cuts') {
      router.replace('/products')
    }
  }, [categoryId, router])

  // Format category display name
  const categoryName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' ')
  
  // Filter products by category, handle "fresh-cuts" as all/any cuts
  const categoryProducts = categoryId === 'fresh-cuts' 
    ? products 
    : products.filter(p => {
        const cat = p.category.toLowerCase()
        const target = categoryId.toLowerCase()
        if (target === 'fish' || target === 'seafood' || target === 'fish-seafood' || target === 'prawns') {
          return cat === 'fish' || cat === 'seafood' || cat === 'fish & seafood' || cat === 'prawns'
        }
        return cat === target
      })

  // Debugging logs as requested by requirements
  console.log(`[Category Details Audit] Selected Category ID: "${categoryId}"`)
  console.log(`[Category Details Audit] Total products loaded from cache/API: ${products.length}`)
  console.log(`[Category Details Audit] Count of products matching "${categoryId}": ${categoryProducts.length}`)
  if (categoryId.toLowerCase() === 'fish') {
    const rawFishCount = products.filter(p => p.category.toLowerCase().includes('fish') || p.category.toLowerCase().includes('seafood')).length
    console.log(`[Category Details Audit] Checked for similar terms (fish/seafood) raw count: ${rawFishCount}`)
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      weight: '500g',
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge,
      image: product.image,
      vendorId: product.vendorId,
      vendorName: product.vendorName
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      <div>
        <Suspense fallback={<div className="h-20 bg-slate-950 animate-pulse w-full" />}>
          <Header />
        </Suspense>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold">
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </Link>
            <span className="text-[10px] uppercase font-black text-secondary tracking-widest bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
              {categoryProducts.length} Premium Cuts Available
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase">
              Premium {categoryName} Collection
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Fresh, antibiotic-free {categoryName} cuts prepared under strict hygiene standards and delivered chilled.
            </p>
          </div>

          {categoryProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl">
              <p className="text-slate-400 text-sm font-bold">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryProducts.map((product) => {
                const isInCart = items.some(item => item.id === product.id)
                return (
                  <div key={product.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-secondary transition-all group flex flex-col justify-between">
                    <Link href={`/product/${product.id}`} className="space-y-3 block">
                      <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-slate-950">
                        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        {product.badge && (
                          <span className="absolute top-3 left-3 bg-secondary/90 backdrop-blur-sm text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-secondary transition-colors truncate">{product.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">{product.weight}</p>
                      </div>
                    </Link>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-850">
                      <span className="text-sm font-black text-secondary">₹{product.price}</span>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className={`px-3 py-1.5 h-auto text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                          isInCart 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-primary hover:bg-primary/95 text-white'
                        }`}
                      >
                        {isInCart ? <><Check className="w-3 h-3 mr-1" /> Added</> : <><ShoppingCart className="w-3 h-3 mr-1" /> Add</>}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
