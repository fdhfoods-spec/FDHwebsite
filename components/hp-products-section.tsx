'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HpProductCard } from './hp-product-card'
import { useStore } from '@/lib/store'

export function HpProductsSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = [
    { id: 'chicken', label: 'Chicken', icon: '🍗' },
    { id: 'mutton', label: 'Mutton', icon: '🥩' },
    { id: 'fish-and-sea-foods', label: 'Fish & Sea Foods', icon: '🐟' },
    { id: 'eggs', label: 'Eggs', icon: '🥚' },
  ]

  const { products, fetchProducts } = useStore()
  
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Get products to display (limit to a reasonable number if needed, but for dynamic sync we show all)
  const bestSellers = products && products.length > 0 ? products : []

  const filteredProducts = activeCategory
    ? bestSellers.filter((p) => {
        const pCat = p.category.toLowerCase();
        if (activeCategory === 'chicken') return pCat === 'chicken';
        if (activeCategory === 'mutton') return pCat === 'mutton';
        if (activeCategory === 'fish-and-sea-foods') return pCat === 'fish' || pCat === 'seafood';
        if (activeCategory === 'eggs') return pCat === 'eggs';
        return false;
      })
    : bestSellers;

  return (
    <section id="products" className="py-16 bg-background">
      <div id="our-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Products</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Browse our carefully curated selection of premium meat and seafood.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              data-category={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`px-6 py-2 rounded border-2 border-primary font-medium transition-colors text-sm ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <HpProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => setActiveCategory(null)}
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  )
}

