'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X, ShieldAlert, Award, ShieldCheck, Sparkles, Clock, CheckCircle } from 'lucide-react'

export function WhyChooseUs() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.hash === '#why-fdh' || window.location.hash === '#about')) {
      const el = document.getElementById('why-fdh')
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 200)
      }
    }
  }, [])

  const highlights = [
    {
      icon: ShieldCheck,
      title: 'Trusted Local Vendors',
      description: 'We partner directly with the finest local farms and fishermen to ensure premium quality.',
    },
    {
      icon: Clock,
      title: 'Choose Your Window',
      description: 'Select a precise delivery slot that fits your lifestyle. Your time is valuable.',
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: '100% traceable, premium cuts. If it doesn’t meet our standard, we replace it.',
    },
    {
      icon: CheckCircle,
      title: 'Prepared With Care',
      description: 'Expertly cut, cleaned, and vacuum-sealed for maximum freshness and flavor.',
    },
    {
      icon: Sparkles,
      title: 'Freshly Prepared',
      description: 'Your order is prepared just before your delivery slot—never stored overnight.',
    },
    {
      icon: ShieldAlert,
      title: 'Support Local',
      description: 'Empowering local farmers and ensuring sustainable, ethical agricultural practices.',
    },
  ]

  const comparisonData = [
    {
      parameter: 'Freshness Standard',
      fdh: 'Daily fresh farm sourcing. Direct dispatch in active 0-4°C cold-chain. Never frozen.',
      ordinary: 'Exposed to open stalls. Zero cooling during transport. Repeated freezing cycles.',
    },
    {
      parameter: 'Hygiene & Prep Labs',
      fdh: 'ISO-certified sterile clean rooms. Vaccinated master butchers, RO washed, and UV sanitized.',
      ordinary: 'Manual, unhygienic cuts on wooden blocks in dusty open air markets.',
    },
    {
      parameter: 'Vacuum Packaging',
      fdh: 'Double-vacuum sealed in thick polymer. Preserves bio-moisture, zero leaks or odors.',
      ordinary: 'Wrapped loosely in newsprint or black single-use plastic bags. Leak prone.',
    },
    {
      parameter: 'Chemical Audits',
      fdh: 'Certified hormone and antibiotic-free. Heavy metal testing and veterinary health clearance.',
      ordinary: 'Undocumented origins, unknown feed quality, and zero regulatory testing.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <section id="why-fdh" className="py-24 bg-white relative overflow-hidden" aria-labelledby="about">
      {/* Background shape */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="font-sans font-semibold text-xs tracking-widest uppercase text-secondary mb-2 block">
            The FDH Standard
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-primary tracking-tight">
            Why Families Choose FDH
          </h2>
          <p className="mt-4 text-foreground/70 text-base md:text-lg leading-relaxed">
            We don’t just deliver food; we deliver peace of mind. Experience premium quality, flexible scheduling, and uncompromising freshness.
          </p>
        </div>

        {/* 6 Core Highlights Grid (3x2) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {highlights.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group bg-muted/30 border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col items-start relative overflow-hidden"
              >
                {/* Background Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-extrabold text-primary mb-2 uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-foreground/75 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
