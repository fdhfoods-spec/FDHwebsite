'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export function Testimonials() {
  const reviews = [
    {
      name: 'Aditi Deshmukh',
      role: 'Home Chef & Food Blogger',
      location: 'Bandra, Mumbai',
      initials: 'AD',
      rating: 5,
      text: '“I am extremely particular about the meat I cook for my family. FDH is a game-changer. The vacuum-sealed packaging is immaculate, and the chicken is incredibly tender, moisture-rich, and absolutely odorless. It feels like sourcing from a high-end European butchery.”',
    },
    {
      name: 'Dr. Vikram Malhotra',
      role: 'Cardiologist & Wellness Advocate',
      location: 'Alipore, Kolkata',
      initials: 'VM',
      rating: 5,
      text: '“Hygiene and source tracing are my primary concerns. Knowing that FDH performs lab audits for heavy metals and antibiotic residues gives me absolute peace of mind. The scheduled delivery slots are extremely punctual. A truly premium service.”',
    },
    {
      name: 'Rohan Singhal',
      role: 'Culinary Enthusiast',
      location: 'Indiranagar, Bengaluru',
      initials: 'RS',
      rating: 5,
      text: '“The Seer Fish steaks are cut with surgical precision. They are fresh, sweet, and firm. I’ve ordered multiple times and the quality is consistently spectacular. You can easily taste the difference between FDH and typical local markets.”',
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      
      {/* Decorative BG element */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-sans font-semibold text-xs tracking-widest uppercase text-secondary mb-2 block">
            Client Voices
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-primary tracking-tight">
            Trusted by Connoisseurs
          </h2>
          <p className="mt-4 text-foreground/70 text-base">
            Read stories from home chefs, physicians, and culinary enthusiasts who refuse to compromise on fresh quality.
          </p>
        </div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-muted/40 rounded-2xl p-8 md:p-10 border border-gray-100/50 hover:border-primary/10 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_45px_-15px_rgba(15,61,46,0.06)] bg-gradient-to-br from-white to-muted/20 transition-all duration-300 flex flex-col h-full relative"
            >
              {/* Quote Mark Decoration */}
              <Quote className="absolute top-6 right-8 w-12 h-12 text-primary/5 pointer-events-none" />

              {/* Rating */}
              <div className="flex gap-0.5 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="font-serif italic text-foreground/80 text-sm md:text-base leading-relaxed mb-8 flex-grow">
                {review.text}
              </p>

              {/* User Bio */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100 mt-auto">
                
                {/* Initials Circle */}
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-sans font-bold text-sm flex-shrink-0 shadow-sm border border-white">
                  {review.initials}
                </div>
                
                {/* Text Bio */}
                <div className="flex flex-col">
                  <span className="font-sans font-bold text-sm text-primary leading-tight">
                    {review.name}
                  </span>
                  <span className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider mt-0.5 leading-none">
                    {review.role}
                  </span>
                  <span className="text-[10px] text-secondary font-medium tracking-wide leading-normal">
                    {review.location}
                  </span>
                </div>

              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
