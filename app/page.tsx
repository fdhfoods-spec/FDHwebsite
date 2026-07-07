import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Categories } from '@/components/categories'
import { FeaturedProducts } from '@/components/featured-products'
import { WhyChooseUs } from '@/components/why-choose-us'
import { HowItWorks } from '@/components/how-it-works'
import { MobileApp } from '@/components/mobile-app'
import { Pricing } from '@/components/pricing'
import { Footer } from '@/components/footer'
import { AuthModal } from '@/components/auth-modal'

export default function Home() {
  return (
    <>
      <Suspense fallback={<div className="h-20 bg-slate-950 animate-pulse w-full" />}>
        <Header />
      </Suspense>
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <WhyChooseUs />
        <HowItWorks />
        <MobileApp />
        <Pricing />
      </main>
      <Footer />
      <AuthModal />
    </>
  )
}