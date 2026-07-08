import { Suspense } from 'react'
import { Header } from '@/components/header'
import { HpHero } from '@/components/hp-hero'
import { HpTrustSection } from '@/components/hp-trust-section'
import { HpProductsSection } from '@/components/hp-products-section'
import { HpHowItWorks } from '@/components/hp-how-it-works'
import { HpQualitySection } from '@/components/hp-quality-section'
import { HpReviewsSection } from '@/components/hp-reviews-section'
import { HpDeliverySection } from '@/components/hp-delivery-section'
import { HpFAQSection } from '@/components/hp-faq-section'
import { HpFooter } from '@/components/hp-footer'
import { AuthModal } from '@/components/auth-modal'

export default function Home() {
  return (
    <>
      <Suspense fallback={<div className="h-20 bg-slate-950 animate-pulse w-full" />}>
        <Header />
      </Suspense>
      <main className="bg-background">
        <HpHero />
        <HpTrustSection />
        <HpProductsSection />
        <HpHowItWorks />
        <HpQualitySection />
        <HpReviewsSection />
        <HpDeliverySection />
        <HpFAQSection />
      </main>
      <HpFooter />
      <AuthModal />
    </>
  )
}