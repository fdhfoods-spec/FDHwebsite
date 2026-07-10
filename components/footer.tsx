'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

// Custom inline SVG icons to avoid missing exports in the installed lucide-react version
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export function Footer() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categories = [
    { name: 'Protein Essentials', href: '#categories' },
    { name: 'Family Chicken', href: '#categories' },
    { name: 'Fresh Catch', href: '#categories' },
    { name: 'Weekend BBQ', href: '#categories' },
    { name: 'Ready in 15 Mins', href: '#categories' },
  ]

  const company = [
    { name: 'Our Story', href: '/about' },
    { name: 'Sourcing Standards', href: '#why-fdh' },
    { name: 'Delivery Coverage', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press & Media', href: '#' },
  ]

  const community = [
    { name: 'Recipe Blog', href: '#' },
    { name: 'Download App', href: '#' },
    { name: 'Refer Friends', href: '#' },
    { name: 'Future Home Chef Program', href: '#' },
    { name: 'Become a Vendor', href: '#' },
  ]

  const socials = [
    { icon: FacebookIcon, href: '#', label: 'Facebook' },
    { icon: InstagramIcon, href: '#', label: 'Instagram' },
    { icon: TwitterIcon, href: '#', label: 'Twitter' },
    { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
  ]

  return (
    <footer id="contact" className="bg-[#111625] text-white/80 border-t border-zinc-800/40 pt-20 pb-12 relative overflow-hidden">
      
      {/* Background shape */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Newsletter Section */}
        <div className="mb-16 bg-primary/10 border border-primary/20 rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h3 className="font-sans font-bold text-2xl text-white mb-2">Join the FDH Community</h3>
            <p className="text-white/70 text-sm leading-relaxed">Subscribe to our newsletter for exclusive recipes, early access to new collections, and behind-the-scenes stories from our local farms.</p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <input type="email" placeholder="Your email address" className="w-full sm:w-72 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-secondary transition-colors" />
            <button className="bg-secondary hover:bg-secondary/90 text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-zinc-800">
          
          {/* Column 1: Brand Info */}
          <div className="col-span-12 lg:col-span-4 flex flex-col justify-start">
            <Link href="/" onClick={scrollToTop} className="flex items-center gap-3 mb-6 group">
              <span className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-white font-serif font-semibold text-xl tracking-tighter">
                F
              </span>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-lg leading-tight tracking-wider text-white">
                  FDH
                </span>
                <span className="font-sans text-[10px] tracking-widest text-orange-400 font-semibold uppercase leading-none">
                  Fresh Direct Home
                </span>
              </div>
            </Link>
            
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
              FDH represents premium fresh meat and seafood delivery. Sourced fresh daily, prepared in WHO-compliant sterile clean-rooms, and delivered in double vacuum-sealed packages on your schedule.
            </p>

            {/* Contact details */}
            <div className="space-y-3.5 text-sm">
              <div className="flex items-center gap-3 hover:text-white transition-colors duration-200">
                <Phone className="w-4.5 h-4.5 text-secondary flex-shrink-0" />
                <a href="tel:+9118001034455" className="font-semibold">+91-1800-103-4455 (Toll-Free)</a>
              </div>
              <div className="flex items-center gap-3 hover:text-white transition-colors duration-200">
                <Mail className="w-4.5 h-4.5 text-secondary flex-shrink-0" />
                <a href="mailto:support@fdh.com" className="font-semibold">support@fdh.com</a>
              </div>
              <div className="flex items-start gap-3 text-white/60">
                <MapPin className="w-4.5 h-4.5 text-secondary flex-shrink-0 mt-0.5" />
                <span>FDH Quality Center, Sector 63, Noida, NCR, India</span>
              </div>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <h4 className="font-sans font-bold text-sm text-white uppercase tracking-widest mb-6">
              Categories
            </h4>
            <ul className="space-y-3.5 text-sm">
              {categories.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="col-span-6 sm:col-span-4 lg:col-span-2">
            <h4 className="font-sans font-bold text-sm text-white uppercase tracking-widest mb-6">
              Company
            </h4>
            <ul className="space-y-3.5 text-sm">
              {company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Community */}
          <div className="col-span-12 sm:col-span-4 lg:col-span-2">
            <h4 className="font-sans font-bold text-sm text-white uppercase tracking-widest mb-6">
              Community
            </h4>
            <ul className="space-y-3.5 text-sm">
              {community.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Social Connection */}
          <div className="col-span-12 sm:col-span-12 lg:col-span-2 flex flex-col justify-start">
            <h4 className="font-sans font-bold text-sm text-white uppercase tracking-widest mb-6">
              Follow FDH
            </h4>
            <div className="flex gap-3 mb-6">
              {socials.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-zinc-800/40 hover:bg-secondary flex items-center justify-center text-white/80 hover:text-white border border-zinc-800 transition-all duration-200"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
            {/* Certificated badge placeholders */}
            <div className="bg-zinc-800/20 border border-zinc-800/50 p-4 rounded-xl text-left">
              <span className="text-[10px] text-orange-400 font-extrabold uppercase tracking-widest leading-none block">FSSAI Audited</span>
              <p className="text-[10px] text-white/50 mt-1 leading-normal">Our processing labs hold ISO 22000 & HACCP certifications.</p>
            </div>
          </div>

        </div>

        {/* Bottom copyright section */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-white/40">
          
          <div>
            <p>&copy; {new Date().getFullYear()} Fresh Direct Home (FDH). All rights reserved.</p>
          </div>

          {/* Payment Partner Declarations */}
          <div className="flex items-center gap-4">
            <span className="tracking-widest uppercase font-bold text-[9px] text-white/30">Secure Payments</span>
            <div className="flex items-center gap-2.5 font-semibold text-[10px] text-white/55 tracking-wider bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-950/30">
              <span>VISA</span>
              <span className="text-white/20">|</span>
              <span>MASTERCARD</span>
              <span className="text-white/20">|</span>
              <span>UPI</span>
              <span className="text-white/20">|</span>
              <span>NETBANKING</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-secondary" />
            <span>Serving Delhi NCR, Mumbai, Bengaluru and Kolkata</span>
          </div>

        </div>

      </div>
    </footer>
  )
}
