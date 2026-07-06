import { Button } from '@/components/ui/button'
import { Gift, Percent, Truck, Users } from 'lucide-react'

const offers = [
  {
    icon: Gift,
    title: 'First Order Discount',
    description: 'Get 20% off on your first order. No minimum purchase required.',
    code: 'WELCOME20',
    bg: 'bg-primary/10',
  },
  {
    icon: Percent,
    title: 'Weekend Specials',
    description: 'Enjoy up to 30% discount on selected products every weekend.',
    code: 'WEEKEND',
    bg: 'bg-secondary/10',
  },
  {
    icon: Users,
    title: 'Family Pack Offers',
    description: 'Buy more and save more with our exclusive family pack bundles.',
    code: 'FAMILY',
    bg: 'bg-blue-100',
  },
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'Free delivery on orders above ₹500. Fast and safe delivery guaranteed.',
    code: 'FREEDEL500',
    bg: 'bg-emerald-100',
  },
]

export function Offers() {
  return (
    <section id="offers" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Special Offers
          </h2>
          <p className="text-muted-foreground text-lg">
            Save more with our exclusive promotions and deals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, idx) => {
            const Icon = offer.icon
            return (
              <div
                key={idx}
                className={`${offer.bg} p-6 md:p-8 rounded-lg`}
              >
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {offer.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {offer.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/10"
                >
                  Code: {offer.code}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
