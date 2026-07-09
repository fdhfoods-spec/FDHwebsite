import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

export function HpQualitySection() {
  const qualityPoints = [
    'USDA Certified Suppliers Only',
    'Zero Antibiotics & Hormones',
    'Grass-Fed & Pasture-Raised Options',
    'Rigorous Hygiene Standards',
    'Cold Chain Integrity Guaranteed',
    '100% Satisfaction Promise',
  ]

  return (
    <section id="quality" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Image */}
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src="/images/quality-new-uploaded.jpg"
              alt="Quality control and processing"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Our Quality Promise</h2>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              We partner only with farms and suppliers who share our commitment to quality, sustainability, and ethical practices.
            </p>

            <div className="space-y-3 mb-8">
              {qualityPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
