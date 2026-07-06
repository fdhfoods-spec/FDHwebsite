'use client'

import { motion } from 'framer-motion'
import { Calendar, ShieldCheck, Clock } from 'lucide-react'

export function TrustSection() {
  const cards = [
    {
      icon: Calendar,
      title: 'Fresh Daily',
      description: 'Sourced from organic farms and coastal waters daily. Transported at 0-4°C immediately after prep, guaranteeing optimal freshness without freezing.',
      color: 'bg-emerald-500/10 text-emerald-700',
    },
    {
      icon: ShieldCheck,
      title: 'Hygienically Processed',
      description: 'Prepared in WHO-compliant sterile clean-rooms. UV sanitized, washed in RO purified water, and double vacuum-sealed for zero contamination.',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Clock,
      title: 'Scheduled Delivery',
      description: 'Pick a precise delivery slot that fits your lifestyle. Shipped in temperature-insulated bags, guaranteeing timely arrival and chilled freshness.',
      color: 'bg-blue-500/10 text-blue-700',
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
            We operate outside the typical quick-commerce ecosystem, focusing instead on pristine sanitation and authentic freshness.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
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
