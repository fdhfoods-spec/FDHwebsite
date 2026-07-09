import { Clock, Store, Scissors, CheckCircle, Truck } from 'lucide-react'

export function HpHowItWorks() {
  const steps = [
    {
      icon: Clock,
      number: 1,
      title: 'Choose your slot',
      description: 'Pick a delivery window that fits your kitchen—not ours.',
    },
    {
      icon: Store,
      number: 2,
      title: 'Shop gets your order',
      description: 'Your order is instantly assigned to the nearest trusted FDH partner.',
    },
    {
      icon: Scissors,
      number: 3,
      title: 'Cut before your slot',
      description: 'Your meat is freshly cut and packed close to your selected delivery time.',
    },
    {
      icon: CheckCircle,
      number: 4,
      title: 'Verified before dispatch',
      description: 'Every order is quality checked before leaving the shop to ensure freshness.',
    },
    {
      icon: Truck,
      number: 5,
      title: 'Delivered in your window',
      description: 'Delivered fresh within your selected time slot—exactly when you need it.',
    },
  ]

  return (
    <section id="how-it-works" className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">How It Works</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Freshly prepared, quality checked, and delivered within your chosen delivery slot.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-secondary to-transparent ml-4" />
                )}

                {/* Card */}
                <div className="bg-card p-6 rounded-lg border border-border relative z-10 h-full">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-center font-bold text-primary mb-2">{step.title}</h3>
                  <p className="text-sm text-center text-foreground/70">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
