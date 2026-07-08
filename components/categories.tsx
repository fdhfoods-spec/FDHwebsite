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
      id: 'protein-essentials',
      name: 'Protein Essentials',
      count: 'Perfect for meal prep',
      emoji: '🥩',
    },
    {
      id: 'family-chicken',
      name: 'Family Chicken',
      count: 'Weekly staples',
      emoji: '🍗',
    },
    {
      id: 'fresh-catch',
      name: 'Fresh Catch',
      count: 'Coastal favorites',
      emoji: '🐟',
    },
    {
      id: 'weekend-bbq',
      name: 'Weekend BBQ',
      count: 'Grill ready',
      emoji: '🔥',
    },
    {
      id: 'ready-15',
      name: 'Ready in 15 Mins',
      count: 'Quick & easy',
      emoji: '⏱️',
    },
    {
      id: 'healthy-prep',
      name: 'Healthy Meal Prep',
      count: 'Lean cuts',
      emoji: '🥗',
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
                className="group flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-primary/20 cursor-pointer h-full"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted/40 shadow-sm flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-primary/5 transition-all duration-500">
                  {category.emoji}
                </div>
                <h3 className="font-sans font-bold text-[15px] leading-tight text-primary group-hover:text-secondary transition-colors duration-200">
                  {category.name}
                </h3>
                <p className="text-foreground/50 text-[11px] mt-1.5 font-semibold uppercase tracking-wider">
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
