import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { TrustSection } from '@/components/trust'
import { Categories } from '@/components/categories'
import { FeaturedProducts } from '@/components/featured-products'
import { Offers } from '@/components/offers'
import { WhyChooseUs } from '@/components/why-choose-us'
import { ProcessSection } from '@/components/process'
import { MobileApp } from '@/components/mobile-app'
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
        <Offers />
        <WhyChooseUs />
        <ProcessSection />
        <TrustSection />
        <MobileApp />
      </main>
      <Footer />
      <AuthModal />
    </>
  )
}