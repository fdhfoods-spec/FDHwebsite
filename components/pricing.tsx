'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Essential',
    price: '₹999',
    duration: '/month',
    description: 'Perfect for small households looking for weekly fresh cuts.',
    features: [
      '2 Deliveries per week',
      'Free standard delivery',
      'Access to daily fresh cuts',
      'Basic support',
    ],
    isPopular: false,
    buttonText: 'Get Started',
  },
  {
    name: 'Premium',
    price: '₹1,999',
    duration: '/month',
    description: 'Our most popular plan for families who love premium meats.',
    features: [
      'Unlimited weekly deliveries',
      'Free express chilled delivery',
      'Priority access to rare cuts',
      'Early access to offers',
      '24/7 Priority support',
    ],
    isPopular: true,
    buttonText: 'Subscribe Now',
  },
  {
    name: 'Elite',
    price: '₹3,499',
    duration: '/month',
    description: 'The ultimate experience for gourmet chefs and large families.',
    features: [
      'Unlimited express deliveries',
      'Dedicated account manager',
      'Exclusive gourmet marinated cuts',
      'Custom cut requests',
      'Complimentary chef recipes',
      'VIP Support',
    ],
    isPopular: false,
    buttonText: 'Go Elite',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-white to-muted/20 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-sans font-semibold text-xs tracking-widest uppercase text-secondary mb-2 block">
            Subscription Plans
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-primary tracking-tight">
            Flexible Plans for Every Kitchen
          </h2>
          <p className="mt-4 text-foreground/70 text-base leading-relaxed">
            Choose a plan that fits your family's needs. Enjoy premium, farm-fresh cuts delivered to your door with zero hassle.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-center"
        >
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className={`relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border ${
                plan.isPopular ? 'border-primary shadow-lg scale-100 md:scale-105 z-10' : 'border-gray-100 scale-100'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary text-white text-[10px] font-extrabold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-sans font-bold text-xl text-primary mb-2">{plan.name}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8 flex items-end gap-1">
                <span className="font-sans font-extrabold text-4xl text-primary leading-none">
                  {plan.price}
                </span>
                <span className="text-sm font-semibold text-foreground/50 mb-1">
                  {plan.duration}
                </span>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground/80 leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className={`w-full py-6 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
                  plan.isPopular
                    ? 'bg-primary hover:bg-primary/95 text-white shadow-md hover:shadow-lg'
                    : 'bg-muted/50 hover:bg-primary/10 text-primary border border-transparent hover:border-primary/20'
                }`}
                variant={plan.isPopular ? 'default' : 'secondary'}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
