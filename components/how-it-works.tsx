import { Clock, Store, PlusCircle, CheckCircle2, Truck } from 'lucide-react'

const steps = [
  {
    icon: Clock,
    step: 1,
    title: 'Choose your slot',
    description: 'Pick a window that fits your kitchen — not ours.'
  },
  {
    icon: Store,
    step: 2,
    title: 'Shop gets your order',
    description: 'Assigned to a trusted partner near you — no mystery sourcing.'
  },
  {
    icon: PlusCircle,
    step: 3,
    title: 'Cut before your slot',
    description: 'Prepared close to your window — not the night before.'
  },
  {
    icon: CheckCircle2,
    step: 4,
    title: 'Verified before dispatch',
    description: 'Weight check and photo proof — before it leaves the shop.'
  },
  {
    icon: Truck,
    step: 5,
    title: 'Delivered in your window',
    description: 'Arrives when you planned to cook — not when a rider guesses.'
  }
]

export function HowItWorks() {
  return (
    <section className="bg-[#FDFBF7] py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-lg font-medium">
            Slot-first delivery — built for freshness, not speed theatre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">
                    Step {s.step}
                  </div>
                  <h3 className="font-serif font-bold text-foreground text-lg leading-snug">
                    {s.title}
                  </h3>
                </div>
              </div>
              <p className="mt-5 text-sm text-foreground/60 leading-relaxed font-medium">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
