'use client'

import { Clock, Store, PlusCircle, CheckCircle2, Truck } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    icon: Clock,
    step: 1,
    title: 'Choose your slot',
    description: 'Pick a window that fits your kitchen — not ours.'
  },
  {
    icon: Store,
    step: 2,
    title: 'Shop gets your order',
    description: 'Assigned to a trusted partner near you — no mystery sourcing.'
  },
  {
    icon: PlusCircle,
    step: 3,
    title: 'Cut before your slot',
    description: 'Prepared close to your window — not the night before.'
  },
  {
    icon: CheckCircle2,
    step: 4,
    title: 'Verified before dispatch',
    description: 'Weight check and photo proof — before it leaves the shop.'
  },
  {
    icon: Truck,
    step: 5,
    title: 'Delivered in your window',
    description: 'Arrives when you planned to cook — not when a rider guesses.'
  }
]

export function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <section className="bg-[#FDFBF7] py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-lg font-medium">
            Slot-first delivery — built for freshness, not speed theatre.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {steps.map((s) => (
            <motion.div
              variants={itemVariants}
              key={s.step}
              className="bg-white p-6 rounded-3xl shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-[0_20px_45px_-15px_rgba(15,61,46,0.08)] transition-all duration-500 hover:-translate-y-1 relative"
            >
              {/* Optional connector line on desktop */}
              {s.step < 5 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] bg-gradient-to-r from-primary/20 to-transparent z-0" />
              )}
              
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">
                    Step {s.step}
                  </div>
                  <h3 className="font-sans font-bold text-primary text-base leading-snug">
                    {s.title}
                  </h3>
                </div>
              </div>
              <p className="mt-5 text-sm text-foreground/60 leading-relaxed font-medium">
                {s.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
