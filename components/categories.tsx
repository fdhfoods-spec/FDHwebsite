'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useStore } from '@/lib/store'

export function Categories() {
  const { setActiveFilter } = useStore()

  const handleCategoryClick = (categoryId: string) => {
    // Set the global filter so FeaturedProducts reacts immediately
    setActiveFilter(categoryId)
    // Smooth scroll to the products section
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
      description: 'Antibiotic-free, clean-room cut cuts & breasts',
      image: '/cat-chicken.png',
      href: '#bestsellers',
    },
    {
      id: 'fish',
      name: 'Fish & Seafood',
      description: 'Daily fresh-water & coastal catches',
      image: '/cat-fish.png',
      href: '#bestsellers',
    },
    {
      id: 'mutton',
      name: 'Mutton',
      description: 'Pasture-raised, tender pasture-fed cuts',
      image: '/cat-mutton.png',
      href: '#bestsellers',
    },
    {
      id: 'marinated',
      name: 'Marinated',
      description: 'Gourmet recipes ready for the pan',
      image: '/cat-seafood.png', // Using seafood as a beautiful premium placeholder for gourmet marinated products
      href: '#bestsellers',
    },
    {
      id: 'ready-to-cook',
      name: 'Ready To Cook',
      description: 'Prepped burger patties, kebabs & snacks',
      image: '/cat-ready-cook.png',
      href: '#bestsellers',
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <section id="categories" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <span className="font-sans font-semibold text-xs tracking-widest uppercase text-secondary mb-2 block">
              Curated Collections
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-primary tracking-tight">
              Explore Our Premium Cuts
            </h2>
            <p className="mt-4 text-foreground/70 text-base">
              Every cut is prepared under strict quality guidelines, vacuum packed, and delivered chilled.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <a
              href="#bestsellers"
              onClick={(e) => {
                e.preventDefault()
                setActiveFilter('bestseller')
                const el = document.getElementById('bestsellers')
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className="group inline-flex items-center gap-2 text-secondary font-semibold text-sm hover:text-primary transition-colors cursor-pointer"
            >
              View All Best Sellers
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="block text-left w-full"
            >
              <motion.div
                variants={cardVariants}
                className="group flex flex-col cursor-pointer"
              >
              {/* Image Container with Zoom effect */}
              <div className="relative aspect-[4/5] w-full bg-muted rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Premium Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                
                {/* Arrow Icon Indicator */}
                <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Text Info */}
              <h3 className="font-sans font-bold text-lg text-primary mt-4 group-hover:text-secondary transition-colors duration-200">
                {category.name}
              </h3>
              <p className="text-foreground/60 text-xs mt-1.5 leading-relaxed pr-2">
                {category.description}
              </p>
              </motion.div>
            </button>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
