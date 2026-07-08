'use client'

import { motion } from 'framer-motion'
import { CalendarSync, ShieldCheck, Truck, Star } from 'lucide-react'

export function TrustSection() {
  const cards = [
    {
      icon: Star,
      title: '4.9 Customer Rating',
      description: 'Join thousands of families who trust us for their weekly fresh food needs. Our consistent quality speaks for itself.',
      color: 'bg-amber-500/10 text-amber-500',
    },
    {
      icon: Truck,
      title: '0–4°C Chilled Delivery',
      description: 'Our unbroken cold chain ensures your food arrives at peak freshness, never frozen and always safe.',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      icon: ShieldCheck,
      title: 'Trusted Local Vendors',
      description: 'We partner directly with the best local farms and fishermen, ensuring traceable, premium quality in every order.',
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      icon: CalendarSync,
      title: 'Flexible Subscriptions',
      description: 'Daily, weekly, or monthly deliveries that fit your schedule. Pause, skip, or modify anytime without fees.',
      color: 'bg-primary/10 text-primary',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="py-20 bg-muted/60 relative overflow-hidden border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-sans font-semibold text-xs tracking-widest uppercase text-secondary mb-2 block">
            Uncompromising Excellence
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-primary tracking-tight">
            The FDH Quality Covenant
          </h2>
          <p className="mt-4 text-foreground/75 text-base md:text-lg leading-relaxed">
            We operate on a foundation of absolute transparency and premium quality, delivering fresh food on your terms.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {cards.map((card, idx) => {
            const Icon = card.icon
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100/50 hover:shadow-[0_20px_40px_-15px_rgba(15,61,46,0.08)] transition-all duration-300 flex flex-col items-start text-left"
              >
                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center mb-6 flex-shrink-0 transition-transform hover:scale-105 duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="font-sans font-bold text-xl text-primary mb-3">
                  {card.title}
                </h3>
                
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
