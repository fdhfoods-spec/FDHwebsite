import { Suspense } from 'react'
import { Header } from '@/components/header'
import { HpHero } from '@/components/hp-hero'
import { HpProductsSection } from '@/components/hp-products-section'
import { HpHowItWorks } from '@/components/hp-how-it-works'
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
        <HpProductsSection />
        <HpHowItWorks />
      </main>
      <HpFooter />
      <AuthModal />
    </>
  )
}