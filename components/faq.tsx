'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'How do FDH subscriptions work?',
    answer: 'It’s a flexible fresh food plan designed for your lifestyle. Choose your preferred delivery frequency (weekly, bi-weekly, or monthly), pick your items, and we handle the rest. You can pause, skip, or change your products anytime before the cutoff.',
  },
  {
    question: 'Where do you source your products?',
    answer: 'We partner directly with trusted local farms and coastal fishermen. We bypass traditional wholesale markets to ensure you receive farm-fresh quality with complete traceability.',
  },
  {
    question: 'Is the delivery chilled?',
    answer: 'Yes. Our entire supply chain is temperature-controlled. From our processing center to your doorstep, your order is transported at a constant 0–4°C to guarantee peak freshness.',
  },
  {
    question: 'Can I cancel or skip a delivery?',
    answer: 'Absolutely. We believe in ultimate flexibility. You can skip a week, pause your subscription, or cancel entirely through your dashboard without any hidden fees or lock-in periods.',
  },
  {
    question: 'What is your freshness guarantee?',
    answer: 'Your food is prepared strictly for your scheduled slot, not stored overnight. If you ever receive a product that does not meet our premium standard, we will refund or replace it immediately, no questions asked.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <span className="font-sans font-semibold text-xs tracking-widest uppercase text-secondary mb-2 block">
            Common Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-primary tracking-tight">
            Everything You Need To Know
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen ? 'bg-white border-primary/20 shadow-md' : 'bg-white/50 border-gray-100 hover:border-gray-200'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className={`font-sans font-bold text-lg transition-colors ${isOpen ? 'text-primary' : 'text-foreground/80'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'bg-muted text-foreground/40'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-2 text-foreground/70 leading-relaxed text-sm">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
