'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArrowLeft, Target, Eye, ShieldCheck, Heart, Award, Sparkles, ChefHat } from 'lucide-react'

export default function AboutPage() {
  const coreValues = [
    {
      icon: ShieldCheck,
      title: 'Pharmaceutical Grade Hygiene',
      desc: 'All our meat is cut and prepared in clean-rooms prepped to WHO standards, keeping the product sterile and completely untouched by bare hands.',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      icon: Target,
      title: 'Hormone & Antibiotic Free',
      desc: 'We trace and audit our sources rigorously. No growth hormones, no chemical residues, and no synthetic antibiotics in our meat.',
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    },
    {
      icon: Award,
      title: 'Uncompromised Cold Chain',
      desc: 'From processing rooms to your kitchen door, our active cold chain storage ensures the meat is chilled and never frozen, preserving flavor.',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      icon: ChefHat,
      title: 'Expert Custom Cuts',
      desc: 'Our butchers are skilled experts trained in sanitation and precise trimming, ensuring you receive perfectly trimmed curry cuts, breasts, and chops.',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <Suspense fallback={<div className="h-20 bg-slate-950 animate-pulse w-full" />}>
          <Header />
        </Suspense>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Breadcrumb */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold">
              <ArrowLeft className="w-4 h-4" /> Back to Storefront
            </Link>
          </div>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="text-[10px] uppercase font-black text-secondary tracking-widest bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                Who We Are
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase">
                Fresh Delivery Hub <br />
                <span className="text-secondary font-serif font-medium italic lowercase">is</span> Redefining Meat Standards
              </h1>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Fresh Delivery Hub (FDH) was founded on a simple principle: you shouldn’t have to compromise on hygiene, safety, and source transparency when buying fresh cuts. We handle curation, custom cutting, and cold chain shipping in-house to deliver the cleanest cuts possible.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
              <Image 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80" 
                alt="Premium fresh cuts background" 
                fill 
                className="object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-white font-extrabold text-sm uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-secondary" /> Certified WHO Cleanroom Prepared
                </span>
              </div>
            </div>
          </div>

          {/* Mission & Vision Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl hover:border-secondary/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Our Mission</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                To deliver fresh, hygienic, antibiotic-free cuts directly from source to your home. We audit our farms regularly to guarantee high quality and completely eliminate heavy-metal or chemical residue contamination.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl hover:border-secondary/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Our Vision</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                To raise the safety bar across fresh meat and seafood delivery nationwide, making sterile-packaged, lab-tested cuts the default household choice for health-conscious families.
              </p>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Our Core Values</h2>
              <p className="text-slate-400 text-xs">The standards we live by to ensure absolute quality in every pack.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((val, idx) => {
                const Icon = val.icon
                return (
                  <div key={idx} className={`p-6 rounded-2xl border ${val.color} space-y-3 flex flex-col justify-between h-full bg-slate-900/30`}>
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-black uppercase text-white tracking-wider leading-relaxed">{val.title}</h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
