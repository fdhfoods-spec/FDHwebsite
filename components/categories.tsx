'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useStore } from '@/lib/store'

export function Categories() {
  const { setActiveFilter } = useStore()

  const handleCategoryClick = (categoryId: string) => {
    setActiveFilter(categoryId)
    const el = document.getElementById('bestsellers')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#categories') {
      const el = document.getElementById('categories')
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      }
    }
  }, [])
  
  const categories = [
    {
      id: 'chicken',
      name: 'Chicken',
      count: '120+ Products',
      emoji: '🍗',
    },
    {
      id: 'fish',
      name: 'Fish & Seafood',
      count: '85+ Products',
      emoji: '🐟',
    },
    {
      id: 'mutton',
      name: 'Mutton',
      count: '60+ Products',
      emoji: '🥩',
    },
    {
      id: 'marinated',
      name: 'Marinated',
      count: '45+ Products',
      emoji: '🍳',
    },
    {
      id: 'ready-to-cook',
      name: 'Ready To Cook',
      count: '30+ Products',
      emoji: '🍔',
    },
    {
      id: 'combos',
      name: 'Combos & Extras',
      count: '25+ Products',
      emoji: '🍱',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <section id="categories" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <span className="font-sans font-semibold text-xs tracking-widest uppercase text-secondary mb-2 block">
            Curated Collections
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-primary tracking-tight">
            Explore Premium Fresh Cuts
          </h2>
          <p className="mt-4 text-foreground/70 text-base max-w-xl">
            Sourced daily, vacuum-sealed, and delivered at 0-4°C to lock in authentic quality.
          </p>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id === 'combos' ? 'all' : category.id)}
              className="block text-center w-full focus:outline-none"
            >
              <motion.div
                variants={cardVariants}
                className="group flex flex-col items-center justify-center p-6 bg-muted/40 border border-gray-100 rounded-[20px] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.emoji}
                </div>
                <h3 className="font-sans font-bold text-base text-primary group-hover:text-secondary transition-colors duration-200">
                  {category.name}
                </h3>
                <p className="text-foreground/50 text-xs mt-1 font-semibold">
                  {category.count}
                </p>
              </motion.div>
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
