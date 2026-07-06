'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingCart, Check, Info, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'


// Products loaded dynamically from Zustand store

/** Returns true only if the string is a fully-qualified, parseable URL, a valid relative path, or a base64 data URI. */
const isValidImageUrl = (src?: string | null): boolean => {
  if (!src || src.trim() === '') return false
  if (src.startsWith('data:image/')) return true
  try {
    const url = new URL(src)
    return url.hostname.length > 0
  } catch {
    return src.startsWith('/')
  }
}

export function FeaturedProducts() {
  const { addItem, items, products, activeFilter: globalFilter, setActiveFilter: setGlobalFilter } = useStore()
  // Local UI filter — synced FROM the global store when a banner drives it
  const [activeFilter, setLocalFilter] = useState('all')

  // Sync: if the global filter changes (driven by banner click), update local UI
  useEffect(() => {
    if (globalFilter && globalFilter !== activeFilter) {
      setLocalFilter(globalFilter)
    }
  }, [globalFilter])

  const setActiveFilter = (val: string) => {
    setLocalFilter(val)
    setGlobalFilter(val)
  }

  const filters = [
    { label: 'All Fresh Today', value: 'all' },
    { label: 'Chicken', value: 'chicken' },
    { label: 'Mutton', value: 'mutton' },
    { label: 'Fish & Seafood', value: 'fish' },
    { label: 'Ready-to-Cook', value: 'ready-to-cook' },
    { label: 'Marinated', value: 'marinated' },
  ]

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter(p => p.category === activeFilter)

  return (
    <section id="bestsellers" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-sans font-semibold text-xs tracking-widest uppercase text-secondary mb-2 block">
            Fresh Today
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-primary tracking-tight">
            Our Bestselling Cuts
          </h2>
          <p className="mt-4 text-foreground/75 text-base">
            Hand-selected, double-sanitized and double-checked by our experts before delivery.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                activeFilter === filter.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-foreground/70 border border-gray-100 hover:border-gray-300 hover:text-primary'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => {
            const inCart = items.some((i) => i.id === product.id)
            const discount = Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) * 100
            )

            return (
              <div
                key={product.id}
                className="group bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full relative"
              >
                {/* Image wrapper */}
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  {isValidImageUrl(product.image) ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  
                  {/* Floating Badges */}
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur text-primary text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-md shadow-sm">
                      {product.badge}
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                      {discount}% OFF
                    </div>
                  )}

                  {/* Heart / Favorite Indicator */}
                  <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-foreground/40 hover:text-red-500 hover:bg-white transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Info Card */}
                <div className="p-5 flex flex-col flex-grow">
                  
                  {/* Rating & Vendor */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-foreground/40 font-semibold uppercase tracking-wider">
                      FDH Verified Vendor
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-sans font-bold text-base text-primary mb-1 group-hover:text-secondary transition-colors duration-200 leading-tight">
                    {product.name}
                  </h3>
                  
                  {/* Weight & Packaging details */}
                  <div className="flex items-center gap-1.5 mb-5 text-foreground/60 text-[11px] font-medium mt-1">
                    <span>{product.weight}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-0.5 text-secondary">
                      <Info className="w-3 h-3" /> Vacuum Sealed
                    </span>
                  </div>

                  {/* Price and Cart Action */}
                  <div className="mt-auto flex items-center justify-between gap-2">
                    
                    {/* Price column */}
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-extrabold text-primary">
                          ₹{product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-[11px] text-foreground/40 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cart CTA */}
                    <Button
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          weight: product.weight,
                          price: product.price,
                          image: product.image,
                        })
                      }
                      className={`font-semibold text-xs tracking-wider uppercase px-4 py-2 h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                        inCart
                          ? 'bg-secondary hover:bg-secondary text-white'
                          : 'bg-primary hover:bg-primary/95 text-white hover:scale-105'
                      }`}
                    >
                      {inCart ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span>Add</span>
                      )}
                    </Button>
                  </div>

                </div>
              </div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
