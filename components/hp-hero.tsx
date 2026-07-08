import Image from 'next/image'

export function HpHero() {
  return (
    <section className="pt-24 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
              Premium Meat,
              <br />
              Delivered Fresh
            </h1>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              Experience the finest quality meat sourced from trusted farms and delivered fresh to your door within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/products"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-medium"
              >
                Shop Now
              </a>
              <a
                href="/how-it-works"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-secondary text-secondary rounded hover:bg-secondary/10 transition-colors font-medium"
              >
                Learn More
              </a>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-foreground">Same-Day Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-foreground">100% Fresh Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-foreground">Sustainable Sourcing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-foreground">Expert Curation</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full min-h-96 rounded-lg overflow-hidden">
            <Image
              src="/images/hero-premium-meat.png"
              alt="Premium fresh meat selection"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
