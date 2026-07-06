'use client'

import { motion } from 'framer-motion'
import { Check, Smartphone, ShieldCheck, MapPin } from 'lucide-react'

export function MobileApp() {
  const features = [
    'Real-time cold chain temperature tracking',
    'Custom portion weight selection (to the gram)',
    'Priority access to dry-aged & specialty cuts',
    'Manage standing recurring weekly orders',
  ]

  return (
    <section className="py-24 bg-primary text-white relative overflow-hidden">
      
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left content block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <span className="font-sans font-semibold text-xs tracking-widest uppercase text-orange-400 mb-3">
              The FDH App
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-white leading-tight mb-6">
              Premium Freshness In Your Pocket
            </h2>
            <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
              Download the FDH mobile client to enjoy customized butcher cuts, real-time logistics temperature monitoring, and instant automated standing orders.
            </p>

            {/* Feature List */}
            <ul className="space-y-4 mb-10">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500/25 flex items-center justify-center flex-shrink-0 text-orange-400 mt-1">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm md:text-base text-white/90 font-medium">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Premium App Download Buttons */}
            <div className="flex flex-wrap gap-4">
              
              {/* App Store Button */}
              <a
                href="#"
                className="group flex items-center gap-3 bg-black border border-white/20 hover:border-white/50 px-5 py-3 rounded-xl transition-all hover:bg-black/90"
              >
                {/* Custom SVG App Store Icon */}
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94 1.07.08 2.15-.52 2.81-1.33z" />
                </svg>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-white/55 font-bold leading-none">
                    Download on the
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5 leading-none">
                    App Store
                  </p>
                </div>
              </a>

              {/* Play Store Button */}
              <a
                href="#"
                className="group flex items-center gap-3 bg-black border border-white/20 hover:border-white/50 px-5 py-3 rounded-xl transition-all hover:bg-black/90"
              >
                {/* Custom SVG Play Store Icon */}
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                  <path d="M5 3.002a2.316 2.316 0 0 0-1.895.895L12.5 13.294l9.395-9.397A2.315 2.315 0 0 0 20 3.002H5zm16.895 1.796L12.5 14.195l9.395 9.397c.45-.55.705-1.25.705-2.095V6.892c0-.845-.255-1.545-.705-2.094zM12.5 15.097L3.105 24.492A2.316 2.316 0 0 0 5 25.392H20c.895 0 1.69-.35 2.105-.9L12.5 15.097zm-10.29 8.5L11.605 14.2l-9.395-9.4c-.45.55-.71 1.25-.71 2.092v14.502c0 .845.26 1.545.71 2.094z" />
                </svg>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-white/55 font-bold leading-none">
                    Get it on
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5 leading-none">
                    Google Play
                  </p>
                </div>
              </a>

            </div>
          </motion.div>

          {/* Right Mobile Mockup Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex justify-center items-center relative"
          >
            
            {/* Ambient phone shadow glow */}
            <div className="absolute w-60 h-[450px] bg-secondary/20 rounded-[40px] blur-2xl -z-10" />

            {/* Phone Container */}
            <div className="relative w-64 h-[480px] bg-zinc-900 rounded-[38px] p-2.5 shadow-2xl border-4 border-zinc-800 flex-shrink-0">
              
              {/* Ear speaker notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-zinc-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-10 h-1 bg-zinc-800 rounded-full" />
              </div>

              {/* Screen Content */}
              <div className="w-full h-full bg-white rounded-[28px] overflow-hidden text-primary p-4 pt-8 flex flex-col justify-between relative">
                
                {/* Top Status Bar */}
                <div className="flex justify-between items-center text-[10px] text-foreground/50 font-sans font-bold px-2">
                  <span>14:02</span>
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <div className="w-4 h-2 border border-foreground/35 rounded-sm flex items-center p-0.5">
                      <div className="w-full h-full bg-foreground/75" />
                    </div>
                  </div>
                </div>

                {/* Simulated App Header */}
                <div className="flex justify-between items-center mt-3 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 bg-primary text-white text-[8px] font-sans font-extrabold rounded-md flex items-center justify-center">F</span>
                    <span className="text-[10px] font-bold tracking-wider">FDH Chilled</span>
                  </div>
                  <span className="text-[9px] bg-orange-50 text-orange-800 px-2 py-0.5 rounded-full font-bold">
                    Active
                  </span>
                </div>

                {/* Simulated Order Card */}
                <div className="my-auto py-4 flex flex-col justify-center flex-grow">
                  
                  {/* Map representation */}
                  <div className="relative w-full h-24 bg-sky-50 rounded-xl overflow-hidden mb-4 border border-gray-100">
                    {/* Simulated Path Line */}
                    <svg className="w-full h-full absolute inset-0 text-orange-500 stroke-2" viewBox="0 0 100 100">
                      <path d="M10,80 C30,40 60,60 90,20" fill="none" stroke="currentColor" strokeDasharray="3,3" />
                    </svg>
                    {/* Map pins */}
                    <div className="absolute bottom-[10px] left-[8px]">
                      <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center border border-white shadow-sm">
                        <MapPin className="w-1.5 h-1.5 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-[12px] right-[8px] animate-bounce">
                      <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center border border-white shadow-md">
                        <Smartphone className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Temp display */}
                  <div className="bg-muted p-3 rounded-xl border border-gray-100/55 flex justify-between items-center mb-3">
                    <div className="text-left">
                      <p className="text-[8px] text-foreground/45 uppercase font-bold tracking-wide leading-none">Chamber Temp</p>
                      <p className="text-sm font-extrabold text-primary mt-1">2.4 °C</p>
                    </div>
                    <span className="text-[8px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" /> Optimal Chilled
                    </span>
                  </div>

                  {/* Order Details */}
                  <div className="text-left px-1">
                    <p className="text-[8px] text-foreground/45 uppercase font-bold tracking-wide leading-none">Your Selection</p>
                    <p className="text-xs font-bold text-primary mt-1 leading-tight">Premium Mutton Curry Cut</p>
                    <div className="flex justify-between items-center text-[9px] text-foreground/60 mt-1">
                      <span>Portion: 500g</span>
                      <span>ETA: 14:45</span>
                    </div>
                  </div>

                </div>

                {/* Simulated Bottom Navigation */}
                <div className="border-t border-gray-100 pt-2 flex justify-around text-[9px] text-foreground/40 font-semibold mt-auto">
                  <span className="text-primary font-bold">Store</span>
                  <span>Orders</span>
                  <span>Account</span>
                </div>

              </div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}
