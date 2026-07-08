import { MapPin, Clock, Thermometer, Lock } from 'lucide-react'

export function HpDeliverySection() {
  const deliveryFeatures = [
    {
      icon: MapPin,
      title: 'Wide Coverage',
      description: 'Serving metropolitan areas and select suburbs with 24-hour delivery windows.',
    },
    {
      icon: Clock,
      title: 'Schedule Flexibility',
      description: 'Choose delivery times that work for you. Recurring orders available for regular customers.',
    },
    {
      icon: Thermometer,
      title: 'Temperature Control',
      description: 'Insulated boxes with ice packs maintain optimal freshness throughout transit.',
    },
    {
      icon: Lock,
      title: 'Secure Packaging',
      description: 'Discreet, secure packaging ensures your order arrives safely and fresh.',
    },
  ]

  return (
    <section id="delivery" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Delivery Information</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Fast, reliable delivery with complete temperature control to ensure your meat arrives in perfect condition.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {deliveryFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-card p-6 rounded-lg border border-border">
                <Icon className="w-8 h-8 text-secondary mb-4" />
                <h3 className="font-bold text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground/70">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Delivery Areas */}
        <div className="bg-muted/50 p-8 rounded-lg border border-border">
          <h3 className="text-xl font-bold text-primary mb-4">Delivery Areas</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-foreground/80">
            <div>✓ Downtown Metro</div>
            <div>✓ North District</div>
            <div>✓ South Suburbs</div>
            <div>✓ East Valley</div>
            <div>✓ West Lakeside</div>
            <div>✓ Central Park Zone</div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Enter your zipcode at checkout to confirm delivery availability.
          </p>
        </div>
      </div>
    </section>
  )
}
