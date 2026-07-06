'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Truck, Calendar, Compass, Shield, MapPin, Thermometer } from 'lucide-react'

export function ProcessSection() {
  const [vehicleProgress, setVehicleProgress] = useState(0)
  const [temp, setTemp] = useState(2.8)

  // Simulation for live tracking movement and temperature fluctuation
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setVehicleProgress((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 400)

    const tempInterval = setInterval(() => {
      setTemp((prev) => {
        const delta = (Math.random() - 0.5) * 0.2
        const next = prev + delta
        return next < 1.5 ? 1.5 : next > 3.5 ? 3.5 : parseFloat(next.toFixed(1))
      })
    }, 2000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(tempInterval)
    }
  }, [])

  const promises = [
    {
      icon: Truck,
      title: 'Same Day Delivery',
      description: 'Need it for dinner? Order by 2:00 PM for guaranteed same-day delivery across our service zones.',
    },
    {
      icon: Calendar,
      title: 'Scheduled Delivery Slots',
      description: 'Choose a precise 2-hour delivery window that fits your lifestyle. Schedule up to 7 days in advance.',
    },
    {
      icon: Compass,
      title: 'Real-Time Tracking',
      description: 'Track your delivery rider on a live map, complete with real-time package temperature monitoring.',
    },
    {
      icon: Shield,
      title: 'Reliable Delivery Experience',
      description: 'Our certified hygiene-trained logistics team handles your orders in insulated thermal bags.',
    },
  ]

  return (
    <section className="py-24 bg-muted/30 border-y border-gray-100 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Interactive Simulation Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="font-sans font-semibold text-xs tracking-widest uppercase text-secondary mb-2 block">
              Logistics Infrastructure
            </span>
            <h2 className="text-3xl font-sans font-bold text-primary tracking-tight mb-6">
              Our Chilled Delivery Promise
            </h2>
            <p className="text-foreground/75 text-sm leading-relaxed mb-8">
              We own and operate our entire cold-chain fleet. Unlike standard delivery aggregators, we maintain the 0-4°C safety threshold from our sterile clean rooms all the way to your doorstep.
            </p>

            {/* Simulated Live Tracking Widget */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] uppercase font-bold text-foreground/45 tracking-wider">Live Delivery Status</span>
                </div>
                <span className="text-[10px] bg-primary/5 text-primary px-2.5 py-1 rounded-md font-bold">
                  Order #FDH-9921
                </span>
              </div>

              {/* Map Simulator */}
              <div className="relative w-full h-32 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100/50 mb-4">
                {/* Simulated Road Path */}
                <svg className="w-full h-full absolute inset-0 text-primary/10 stroke-[3]" viewBox="0 0 200 100">
                  <path d="M20,70 Q60,30 100,60 T180,30" fill="none" stroke="currentColor" />
                  <path
                    d="M20,70 Q60,30 100,60 T180,30"
                    fill="none"
                    stroke="#C2410C"
                    strokeWidth="3"
                    strokeDasharray="200"
                    strokeDashoffset={200 - (vehicleProgress / 100) * 200}
                  />
                </svg>

                {/* Start Pin */}
                <div className="absolute bottom-[20px] left-[15px] flex flex-col items-center">
                  <div className="w-4 h-4 bg-primary text-white text-[8px] font-sans font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    F
                  </div>
                  <span className="text-[8px] font-bold text-foreground/40 mt-0.5">Hub</span>
                </div>

                {/* Vehicle Pin (moving) */}
                <div
                  className="absolute"
                  style={{
                    left: `${20 + (vehicleProgress / 100) * 150}px`,
                    top: `${70 - (vehicleProgress / 100) * 35}px`, // Simple path estimate
                    transform: 'translate(-50%, -50%)',
                    transition: 'left 0.4s linear, top 0.4s linear',
                  }}
                >
                  <div className="w-7 h-7 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* End Pin */}
                <div className="absolute top-[18px] right-[10px] flex flex-col items-center">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[8px] font-bold text-foreground/45 mt-0.5">You</span>
                </div>
              </div>

              {/* Live Telemetry Data */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 border border-gray-50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center flex-shrink-0">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-foreground/45 leading-none">Chamber Temp</p>
                    <p className="text-sm font-extrabold text-primary mt-1">{temp} °C</p>
                  </div>
                </div>

                <div className="bg-muted/40 border border-gray-50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-foreground/45 leading-none">Est. Arrival</p>
                    <p className="text-sm font-extrabold text-primary mt-1">12 Mins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Promises Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {promises.map((promise, index) => {
              const Icon = promise.icon
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-100/60 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_-15px_rgba(153,27,27,0.04)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-sans font-bold text-base text-primary mb-2">
                      {promise.title}
                    </h3>
                    <p className="text-foreground/70 text-xs leading-relaxed">
                      {promise.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
