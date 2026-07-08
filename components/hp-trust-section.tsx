import { Shield, Leaf, Clock, Award } from 'lucide-react'

export function HpTrustSection() {
  const trustPoints = [
    {
      icon: Shield,
      title: 'Certified Quality',
      description: 'All meat sourced from USDA certified suppliers with rigorous hygiene standards.',
    },
    {
      icon: Leaf,
      title: 'Sustainable Sourcing',
      description: 'Grass-fed beef and humanely raised livestock from ethical farmers.',
    },
    {
      icon: Clock,
      title: 'Freshness Guaranteed',
      description: 'Delivered within 24 hours of processing in insulated, temperature-controlled packaging.',
    },
    {
      icon: Award,
      title: 'Expert Selection',
      description: 'Curated by master butchers with 20+ years of experience in premium cuts.',
    },
  ]

  return (
    <section id="why-fdh" className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Why Choose FDH?</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            We&apos;re committed to providing the highest quality meat with uncompromising standards.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point, index) => {
            const Icon = point.icon
            return (
              <div
                key={index}
                className="bg-card p-6 rounded-lg border border-border hover:border-secondary transition-colors"
              >
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-bold text-primary mb-2">{point.title}</h3>
                <p className="text-sm text-foreground/70">{point.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
