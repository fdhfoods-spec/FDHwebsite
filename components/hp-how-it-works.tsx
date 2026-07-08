import { ShoppingCart, Package, Truck, CheckCircle } from 'lucide-react'

export function HpHowItWorks() {
  const steps = [
    {
      icon: ShoppingCart,
      number: 1,
      title: 'Browse & Select',
      description: 'Browse our selection of premium meat and add items to your cart.',
    },
    {
      icon: Package,
      number: 2,
      title: 'We Prepare',
      description: 'Our expert butchers prepare and pack your order with care in temperature-controlled storage.',
    },
    {
      icon: Truck,
      number: 3,
      title: 'We Deliver',
      description: 'Your order arrives fresh within 24 hours in insulated, temperature-controlled packaging.',
    },
    {
      icon: CheckCircle,
      number: 4,
      title: 'Enjoy',
      description: 'Prepare and enjoy the finest quality meat with confidence and peace of mind.',
    },
  ]

  return (
    <section id="how-it-works" className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">How It Works</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Simple, fast, and reliable. Get fresh meat delivered to your door in 4 easy steps.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-secondary to-transparent ml-4" />
                )}

                {/* Card */}
                <div className="bg-card p-6 rounded-lg border border-border relative z-10">
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
