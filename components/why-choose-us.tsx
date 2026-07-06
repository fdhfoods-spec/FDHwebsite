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
      title: 'Verified Vendors',
      description: 'We partner directly with trusted farms to ensure premium quality sourcing.',
    },
    {
      icon: Clock,
      title: 'Scheduled Delivery',
      description: 'Book precise temperature-insulated slots up to 7 days in advance.',
    },
    {
      icon: Sparkles,
      title: 'Farm Fresh Quality',
      description: 'Sourced daily from farm to door under absolute 0-4°C cold-chain maintenance.',
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: '100% traceable pasture-raised meats. Lab tested for hormone residues.',
    },
    {
      icon: CheckCircle,
      title: 'Food Safety First',
      description: 'Prepared under strict pharmaceutical-grade conditions. UV sanitized and RO washed.',
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
            Why Choose FDH?
          </h2>
          <p className="mt-4 text-foreground/70 text-base md:text-lg leading-relaxed">
            We don’t compromise on details. Experience pharmaceutical-grade processing, rigorous lab testing, and uncompromised freshness.
          </p>
        </div>

        {/* 6 Core Highlights Grid (3x2) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
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

        {/* Side-by-Side Comparison Container */}
        <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-primary text-white text-center font-sans py-6 font-bold tracking-wide border-b border-gray-200">
            <div className="hidden md:block md:col-span-3 text-left pl-8 uppercase text-xs tracking-widest text-white/70">
              Parameter
            </div>
            <div className="col-span-12 md:col-span-4 flex items-center justify-center gap-2 text-sm uppercase tracking-wider text-orange-200">
              <CheckCircle className="w-5 h-5 text-orange-400" /> FDH Standard
            </div>
            <div className="hidden md:flex md:col-span-1" />
            <div className="col-span-12 md:col-span-4 mt-2 md:mt-0 flex items-center justify-center gap-2 text-sm uppercase tracking-wider text-red-200">
              <ShieldAlert className="w-5 h-5 text-red-400" /> Ordinary Meat Shops
            </div>
          </div>

          {/* Table Body */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="divide-y divide-gray-100 bg-white"
          >
            {comparisonData.map((row, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-12 items-center p-6 md:py-8 md:px-8 hover:bg-muted/30 transition-colors duration-150"
              >
                {/* Parameter (Mobile title) */}
                <div className="col-span-12 md:col-span-3 font-sans font-bold text-base md:text-sm text-primary mb-4 md:mb-0 uppercase tracking-wider">
                  {row.parameter}
                </div>

                {/* FDH standard */}
                <div className="col-span-12 md:col-span-4 flex items-start gap-3 bg-orange-50/20 md:bg-transparent p-4 md:p-0 rounded-2xl border border-orange-50/50 md:border-transparent">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-700 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-semibold text-primary leading-relaxed">
                    {row.fdh}
                  </span>
                </div>

                {/* Gap spacer for desktop */}
                <div className="hidden md:block md:col-span-1" />

                {/* Ordinary meat shops */}
                <div className="col-span-12 md:col-span-4 flex items-start gap-3 mt-4 md:mt-0 bg-red-50/20 md:bg-transparent p-4 md:p-0 rounded-2xl border border-red-50/30 md:border-transparent">
                  <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-600 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-foreground/60 leading-relaxed">
                    {row.ordinary}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
