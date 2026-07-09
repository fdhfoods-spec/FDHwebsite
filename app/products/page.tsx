'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useStore, type Product } from '@/lib/store'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Star, ShoppingCart, Check, ArrowLeft, Eye, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AllProductsPage() {
  const { products, addItem, items, fetchProducts } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
      .then(() => setIsLoading(false))
      .catch((err) => {
        setError('Failed to load products from database: ' + (err.message || err))
        setIsLoading(false)
      })
  }, [fetchProducts])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      weight: product.weight || '500g',
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
          {/* Breadcrumb / Top Bar */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold">
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </Link>
            <span className="text-[10px] uppercase font-black text-secondary tracking-widest bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3 h-3 text-secondary" />
              {products.length} Premium Cuts Online
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase">
              Our Whole Collection
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Explore our complete range of premium meats, fresh seafood, marinated specialties, and ready-to-cook delicacies. All hand-cut, lab-tested, and chilled.
            </p>
          </div>

          {/* Error Handling State */}
          {error && !isLoading && (
            <div className="text-center py-16 bg-red-950/20 border border-red-900/30 rounded-3xl p-8 max-w-lg mx-auto space-y-4">
              <span className="text-red-500 font-bold block">Database Error</span>
              <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Loading Skeleton State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl space-y-4 animate-pulse">
                  <div className="aspect-[4/3] bg-slate-800 rounded-xl" />
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-4 bg-slate-800 rounded w-1/4" />
                    <div className="h-8 bg-slate-800 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Main Product Grid */}
          {!isLoading && !error && (
            products.length === 0 ? (
              <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl">
                <p className="text-slate-400 text-sm font-bold">No products currently available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                  const isInCart = items.some(item => item.id === product.id)
                  return (
                    <div key={product.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-secondary transition-all duration-300 group flex flex-col justify-between">
                      <div className="space-y-3">
                        {/* Image section */}
                        <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-slate-950">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.badge && (
                            <span className="absolute top-3 left-3 bg-secondary/90 backdrop-blur-sm text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow">
                              {product.badge}
                            </span>
                          )}
                        </div>

                        {/* Title, rating, weight & description */}
                        <div className="space-y-2">
                          <span className="text-[8px] uppercase tracking-widest font-black text-secondary block">
                            {product.category}
                          </span>
                          <h4 className="text-sm font-bold text-white group-hover:text-secondary transition-colors duration-200 line-clamp-1">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-bold">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{product.rating.toFixed(1)}</span>
                            <span className="text-slate-500 font-semibold">({product.reviews} reviews)</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold">Portion: {product.weight}</p>
                          {product.description && (
                            <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed pt-1 border-t border-slate-850/50">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* CTA Actions */}
                      <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-slate-850">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-base font-black text-secondary">₹{product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-slate-500 line-through font-semibold">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link href={`/product/${product.id}`} className="w-full">
                            <Button
                              variant="outline"
                              className="w-full border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 h-auto bg-slate-900 hover:bg-slate-800"
                            >
                              <Eye className="w-3.5 h-3.5" /> Details
                            </Button>
                          </Link>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className={`w-full text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all h-auto ${
                              isInCart
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-primary hover:bg-primary/95 text-white'
                            }`}
                          >
                            {isInCart ? (
                              <><Check className="w-3.5 h-3.5 mr-1" /> Added</>
                            ) : (
                              <><ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add</>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
