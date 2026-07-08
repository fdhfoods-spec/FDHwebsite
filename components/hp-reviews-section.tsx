import { Star } from 'lucide-react'

export function HpReviewsSection() {
  const reviews = [
    {
      name: 'Sarah M.',
      role: 'Home Chef',
      rating: 5,
      text: "The quality is exceptional! I've been a loyal customer for over a year and FDH never disappoints. The meat is always fresh and beautifully prepared.",
      avatar: 'SM',
    },
    {
      name: 'James T.',
      role: 'Restaurant Owner',
      rating: 5,
      text: 'Outstanding selection and reliability. FDH has become my go-to supplier for premium cuts. The consistency is unmatched in this industry.',
      avatar: 'JT',
    },
    {
      name: 'Emma L.',
      role: 'Food Blogger',
      rating: 5,
      text: 'I recommend FDH to all my followers. The attention to detail, from sourcing to delivery, shows genuine care for quality.',
      avatar: 'EL',
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
            ))}
            <span className="ml-2 text-lg font-semibold text-primary">4.9 / 5.0</span>
          </div>
          <p className="text-foreground/80">Based on 2,400+ customer reviews</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-card p-6 rounded-lg border border-border">
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-secondary text-secondary"
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-foreground/80 mb-6 leading-relaxed italic">
                &quot;{review.text}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-semibold text-primary">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
