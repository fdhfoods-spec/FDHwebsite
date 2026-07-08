'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Calendar, Box, RefreshCw, User, ArrowRight, Edit, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
  const [globalFreq, setGlobalFreq] = useState('Weekly')

  // Configurator state
  const [configFreq, setConfigFreq] = useState('Weekly')
  const [configMeats, setConfigMeats] = useState(['Chicken', 'Eggs', 'Ready to Cook'])
  const [configBudget, setConfigBudget] = useState(612)
  const [configDays, setConfigDays] = useState(['Tuesday', 'Saturday', 'Sunday'])

  const toggleMeat = (meat: string) => {
    setConfigMeats(prev => prev.includes(meat) ? prev.filter(m => m !== meat) : [...prev, meat])
  }
  const toggleDay = (day: string) => {
    setConfigDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  const allMeats = ['Chicken', 'Fish', 'Mutton', 'Eggs', 'Ready to Cook']
  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-white to-muted/20 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-sans font-semibold text-xs tracking-widest uppercase text-secondary mb-2 block">
            Subscription Plans
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-primary tracking-tight">
            Choose How You Want Freshness
          </h2>
          <p className="mt-4 text-foreground/70 text-base leading-relaxed">
            Flexible recurring deliveries based on how often you buy—not membership tiers.
          </p>
        </div>

        {/* FREQUENCY SELECTOR */}
        <div className="flex flex-col items-center mb-16">
          <div className="inline-flex flex-wrap justify-center gap-2 bg-white border border-gray-100 rounded-3xl md:rounded-full p-1.5 shadow-sm mb-4 relative overflow-hidden">
            {['Daily', 'Weekly', 'Bi-Weekly', 'Monthly'].map((freq) => (
              <button
                key={freq}
                onClick={() => setGlobalFreq(freq)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  globalFreq === freq ? 'text-white' : 'text-foreground/70 hover:text-primary'
                }`}
              >
                {globalFreq === freq && (
                  <motion.div
                    layoutId="freq-bubble"
                    className="absolute inset-0 bg-[#2E7D32] border border-[#2E7D32] rounded-full z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{freq}</span>
                {freq === 'Weekly' && (
                  <span className={`absolute -top-2 -right-2 bg-secondary text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm z-20 ${globalFreq === freq ? 'scale-110' : ''} transition-transform`}>
                    Most Popular
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="text-sm text-foreground/50 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-secondary" /> Cancel anytime
          </p>
        </div>

        {/* 3 CARDS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-24"
        >
          {/* CARD 1 */}
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-primary relative flex flex-col h-full z-10 scale-100 lg:scale-105">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="bg-primary flex items-center gap-1 text-white text-[10px] font-extrabold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-sm whitespace-nowrap">
                <Star className="w-3 h-3 fill-current" /> Most Popular
              </span>
            </div>
            <div className="mb-6">
              <h3 className="font-sans font-bold text-2xl text-primary mb-2">Weekly Essentials</h3>
              <div className="flex items-end gap-1 mt-4">
                <span className="font-sans font-extrabold text-4xl text-primary leading-none">₹499</span>
                <span className="text-sm font-semibold text-foreground/50 mb-1">/week</span>
              </div>
            </div>
            <div className="flex-grow">
              <ul className="space-y-4 mb-8">
                {[
                  'Choose products worth ₹500+',
                  'Scheduled weekly delivery',
                  'Change products before every delivery',
                  'Skip any week',
                  'Free chilled delivery',
                  'Fresh reward points'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground/80 leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button className="w-full py-6 rounded-xl font-bold text-sm tracking-wide bg-primary hover:bg-primary/95 text-white shadow-md hover:shadow-lg transition-all duration-300 mt-auto">
              Start Weekly Plan
            </Button>
          </motion.div>

          {/* CARD 2 */}
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
            <div className="mb-6">
              <h3 className="font-sans font-bold text-2xl text-primary mb-2">Family Monthly Box</h3>
              <div className="flex items-end gap-1 mt-4">
                <span className="font-sans font-extrabold text-4xl text-primary leading-none">₹1,999</span>
                <span className="text-sm font-semibold text-foreground/50 mb-1">/month</span>
              </div>
            </div>
            <div className="flex-grow">
              <ul className="space-y-4 mb-8">
                {[
                  '4 scheduled deliveries',
                  'Flexible product selection',
                  'Priority packing',
                  'Family combo pricing',
                  'Exclusive subscriber discounts'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground/80 leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="secondary" className="w-full py-6 rounded-xl font-bold text-sm tracking-wide bg-muted/50 hover:bg-primary/10 text-primary border border-transparent hover:border-primary/20 transition-all duration-300 mt-auto">
              Subscribe Monthly
            </Button>
          </motion.div>

          {/* CARD 3 - CUSTOM PLAN CONFIGURATOR */}
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full bg-gradient-to-br from-white to-primary/5">
            <div className="mb-6">
              <h3 className="font-sans font-bold text-2xl text-primary mb-1">Custom Plan</h3>
              <p className="text-sm text-foreground/60">Build your own subscription.</p>
            </div>
            
            <div className="flex-grow space-y-6">
              {/* Section 1: How Often? */}
              <div>
                <p className="text-sm font-semibold text-primary mb-2">1. How Often?</p>
                <div className="flex gap-2 bg-muted/30 p-1 rounded-lg">
                  {['Daily', 'Weekly', 'Monthly'].map(freq => (
                    <button
                      key={freq}
                      onClick={() => setConfigFreq(freq)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        configFreq === freq ? 'bg-white shadow-sm text-primary' : 'text-foreground/60 hover:text-primary'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2: What do you eat? */}
              <div>
                <p className="text-sm font-semibold text-primary mb-2">2. What do you eat?</p>
                <div className="flex flex-wrap gap-2">
                  {allMeats.map(meat => (
                    <button
                      key={meat}
                      onClick={() => toggleMeat(meat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all flex items-center gap-1.5 ${
                        configMeats.includes(meat)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 text-foreground/60 hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${configMeats.includes(meat) ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                        {configMeats.includes(meat) && <Check className="w-2 h-2 text-white" />}
                      </div>
                      {meat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 3: Weekly Budget */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-sm font-semibold text-primary">3. Weekly Budget</p>
                  <span className="text-sm font-bold text-secondary">₹{configBudget}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="50"
                  value={configBudget}
                  onChange={(e) => setConfigBudget(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-foreground/50 mt-1">
                  <span>₹500</span>
                  <span>₹5000</span>
                </div>
              </div>

              {/* Section 4: Preferred Delivery Days */}
              <div>
                <p className="text-sm font-semibold text-primary mb-2">4. Preferred Delivery Days</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                    const fullDay = allDays.find(d => d.startsWith(day)) || day;
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(fullDay)}
                        className={`w-9 h-9 flex items-center justify-center text-[11px] font-bold rounded-full transition-all ${
                          configDays.includes(fullDay)
                            ? 'bg-secondary text-white shadow-sm'
                            : 'bg-muted/50 text-foreground/60 hover:bg-muted'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Section 5: Estimated Cost */}
            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-foreground/60 uppercase tracking-wider mb-1">Estimated Cost</p>
                <div className="flex items-end gap-1">
                  <span className="font-sans font-extrabold text-2xl text-primary leading-none">
                    ₹{configBudget * 4}
                  </span>
                  <span className="text-xs font-semibold text-foreground/50 mb-0.5">/month</span>
                </div>
              </div>
              <Button className="py-2 px-6 rounded-xl font-bold text-sm bg-primary hover:bg-primary/95 text-white shadow-md">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* MEAL PLANS SECTION */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-sans font-bold text-primary">Curated Lifestyle Plans</h3>
            <p className="text-foreground/70 mt-2">Premium boxes designed for exactly how you eat.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { 
                title: 'Fitness Protein Plan', 
                subtitle: 'Ideal for athletes & gym-goers', 
                price: '₹2,999/mo',
                serves: '1-2 People',
                benefits: ['High Protein', 'Lean Cuts', 'Zero Prep'],
                items: ['Chicken Breast', 'Egg Whites', 'Lean Fish Steaks'], 
                image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=500&auto=format&fit=crop&q=60' 
              },
              { 
                title: 'Family Weekly Box', 
                subtitle: 'Perfect for a family of four', 
                price: '₹3,499/mo',
                serves: '4 People',
                benefits: ['Kid Friendly', 'Versatile Cuts', 'Value Combo'],
                items: ['Boneless Chicken', 'Fresh Catch', 'Ready-to-Cook Snacks'], 
                image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60' 
              },
              { 
                title: 'Seafood Fridays', 
                subtitle: 'For the coastal cravings', 
                price: '₹2,199/mo',
                serves: '2-3 People',
                benefits: ['Omega-3 Rich', 'Daily Catch', 'Exotic Cuts'],
                items: ['Seer Fish Steaks', 'Tiger Prawns', 'Squid Rings'], 
                image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=500&auto=format&fit=crop&q=60' 
              },
            ].map((plan, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_-15px_rgba(15,61,46,0.08)] transition-all duration-500 hover:-translate-y-1 flex flex-col">
                <div className="relative h-48 bg-muted w-full">
                  <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur text-primary text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                    {plan.serves}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="font-bold text-2xl text-primary mb-1">{plan.title}</h4>
                  <p className="text-sm text-foreground/60 mb-5">{plan.subtitle}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {plan.benefits.map((b, i) => (
                      <span key={i} className="bg-muted/50 text-foreground/70 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                        {b}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-2 mb-8 flex-grow">
                    {plan.items.map((item, i) => (
                      <li key={i} className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                        <Check className="w-4 h-4 text-secondary shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="font-extrabold text-2xl text-primary">{plan.price}</div>
                    <Button className="rounded-xl text-sm font-bold bg-primary hover:bg-primary/95 text-white transition-colors">
                      Select Plan
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* WORKFLOW TIMELINE */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-sans font-bold text-primary">How It Works</h3>
            <p className="text-foreground/70 mt-2">Simple, seamless, and fully under your control.</p>
          </div>
          
          <div className="relative">
            {/* Desktop Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 -translate-y-1/2 z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
              {[
                { icon: User, title: 'Customer Setup', desc: 'Step 1', steps: ['Choose Frequency', 'Choose Products'] },
                { icon: Calendar, title: 'Schedule', desc: 'Step 2', steps: ['Choose Delivery Day', 'Choose Quantity'] },
                { icon: RefreshCw, title: 'Automated', desc: 'Step 3', steps: ['Recurring Order Created', 'Reminder 24h Before'] },
                { icon: Edit, title: 'Full Control', desc: 'Customer Can:', steps: ['Skip', 'Pause', 'Swap Products', 'Reschedule'] },
              ].map((step, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative group hover:-translate-y-1 transition-transform">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform shadow-sm">
                    <step.icon className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-lg text-primary mb-1">{step.title}</h4>
                  <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-5">{step.desc}</p>
                  <ul className="space-y-3">
                    {step.steps.map((s, i) => (
                      <li key={i} className="text-sm font-medium text-foreground/80 flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <span className="leading-tight">{s}</span>
                      </li>
                    ))}
                  </ul>
                  {idx < 3 && (
                    <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-100 rounded-full items-center justify-center text-primary/40 shadow-sm z-20">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
