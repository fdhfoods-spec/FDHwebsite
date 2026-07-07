'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Award, Sparkles } from 'lucide-react'
import { useStore } from '@/lib/store'

export function Hero() {
  const { banners = [], setActiveFilter } = useStore()
  const activeBanners = banners.filter(b => b.active)

  const handleBannerButtonClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault()

    // Known homepage section IDs and matching filter values
    // Any /category/<slug> or #<slug> link is resolved to a filter + scroll target
    const HOMEPAGE_SECTIONS: Record<string, { section: string; filter: string }> = {
      chicken:       { section: 'bestsellers', filter: 'chicken' },
      mutton:        { section: 'bestsellers', filter: 'mutton' },
      fish:          { section: 'bestsellers', filter: 'fish' },
      seafood:       { section: 'bestsellers', filter: 'fish' },
      prawns:        { section: 'bestsellers', filter: 'fish' },
      marinated:     { section: 'bestsellers', filter: 'marinated' },
      'ready-to-cook': { section: 'bestsellers', filter: 'ready-to-cook' },
      'fresh-cuts':  { section: 'bestsellers', filter: 'all' },
      bestsellers:   { section: 'bestsellers', filter: 'all' },
      categories:    { section: 'categories',  filter: '' },
      offers:        { section: 'offers',      filter: '' },
    }

    // Extract slug from /category/<slug> or from #<slug>
    let slug = ''
    if (link.startsWith('/category/')) {
      slug = link.replace('/category/', '').split('?')[0].toLowerCase()
    } else if (link.startsWith('#')) {
      slug = link.replace('#', '').toLowerCase()
    } else if (link.startsWith('/')) {
      // Any other internal route — extract last segment
      slug = link.split('/').filter(Boolean).pop()?.toLowerCase() || ''
    }

    // Look up the resolved mapping, fall back to categories scroll
    const resolved = HOMEPAGE_SECTIONS[slug] || { section: 'categories', filter: '' }

    // Apply filter if targeting the bestsellers section
    if (resolved.filter) {
      setActiveFilter(resolved.filter)
    }

    // Smooth scroll to the target section
    const element = document.getElementById(resolved.section)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const slide = {
    id: 1,
    title: 'Farm Fresh Meat Delivered To Your Doorstep',
    subtitle: 'Premium chicken, fish, mutton and ready-to-cook products prepared under strict hygiene standards and delivered chilled.',
    badge: 'FDH Signature Standard',
    imageUrl: '/generated-banner.png?v=2',
    buttonText: 'Shop Fresh',
    link: '#bestsellers',
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E8F5E9] to-white py-16 md:py-24 lg:py-32">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Text Column */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              {/* Trust Badge */}
              <div className="flex items-center gap-2 mb-4 bg-white border border-gray-100 rounded-full px-4 py-1.5 w-fit shadow-sm">
                <span className="text-primary text-sm">🌿</span>
                <span className="font-sans font-semibold text-xs tracking-wide text-foreground/80">
                  Trusted by 50,000+ Families
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-primary leading-[1.15] tracking-tight mb-6">
                {slide.title.includes(' Delivered ') ? (
                  <>
                    {slide.title.split(' Delivered ')[0]}<br />
                    <span className="text-secondary font-serif font-medium italic">Delivered To Your</span><br />
                    {slide.title.split(' Delivered ')[1] || 'Doorstep.'}
                  </>
                ) : (
                  slide.title
                )}
              </h1>

              {/* Subheadline */}
              <p className="text-foreground/70 text-lg leading-relaxed max-w-xl mb-8">
                {slide.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                <a
                  href={slide.link}
                  onClick={(e) => handleBannerButtonClick(e, slide.link)}
                  className="flex-1 sm:flex-none"
                >
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-semibold text-base py-6 px-10 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    Shop Now
                    <span className="text-lg leading-none">→</span>
                  </Button>
                </a>
                <a
                  href="#why-fdh"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById('why-fdh')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-primary text-primary font-semibold text-base py-6 px-8 rounded-full hover:bg-primary/5 transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </a>
              </div>

              {/* Key Trust Checkmarks / Trust Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col gap-1">
                  <span className="text-xl font-bold text-primary">4.9★</span>
                  <span className="text-[10px] font-semibold text-foreground/60 uppercase tracking-wider">Average Rating</span>
                </div>
                <div className="flex flex-col gap-1 border-l border-gray-100 pl-4">
                  <span className="text-xl font-bold text-primary">24hr</span>
                  <span className="text-[10px] font-semibold text-foreground/60 uppercase tracking-wider">Fresh Guarantee</span>
                </div>
                <div className="flex flex-col gap-1 border-l border-gray-100 pl-4">
                  <span className="text-xl font-bold text-primary">100%</span>
                  <span className="text-[10px] font-semibold text-foreground/60 uppercase tracking-wider">Verified Vendors</span>
                </div>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              
              {/* Main Image Container */}
              <div className="relative w-full max-w-[500px] lg:max-w-none aspect-[4/3] sm:aspect-square bg-muted rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
              </div>

              {/* Floating Trust Badge 1 */}
              <div className="absolute -top-6 left-4 sm:left-12 bg-white/95 backdrop-blur shadow-xl border border-gray-100 rounded-2xl p-4 flex items-center gap-3 max-w-[200px]">
                <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center flex-shrink-0 text-secondary">
                  🥩
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-secondary leading-none">
                    Chilled Delivery
                  </p>
                  <p className="text-xs font-bold text-foreground mt-0.5 leading-tight">
                    Always 0-4°C
                  </p>
                </div>
              </div>

              {/* Floating Trust Badge 2 */}
              <div className="absolute -bottom-6 right-4 sm:right-12 bg-white/95 backdrop-blur shadow-xl border border-gray-100 rounded-2xl p-4 flex items-center gap-3 max-w-[200px]">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 text-primary">
                  🛡️
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-primary leading-none">
                    Hygiene Standard
                  </p>
                  <p className="text-xs font-bold text-foreground mt-0.5 leading-tight">
                    WHO Compliant
                  </p>
                </div>
              </div>

            </div>
          </div>
      </div>
    </section>
  )
}
