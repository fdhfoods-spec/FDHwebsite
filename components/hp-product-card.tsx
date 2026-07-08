import Image from 'next/image'
import { Star } from 'lucide-react'
import Link from 'next/link'

interface HpProductCardProps {
  id: string
  name: string
  category: string
  price: number
  image: string
  rating: number
  reviews: number
  badge?: string
}

export function HpProductCard({
  id,
  name,
  category,
  price,
  image,
  rating,
  reviews,
  badge,
}: HpProductCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border hover:border-secondary transition-all hover:shadow-lg overflow-hidden group">
      {/* Image Container */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground px-3 py-1 rounded text-xs font-semibold">
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
          {category}
        </p>
        <h3 className="font-bold text-primary mb-2 line-clamp-2">{name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(rating)
                    ? 'fill-secondary text-secondary'
                    : 'text-muted'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">${price}</span>
          <Link
            href={`/product/${id}`}
            className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Add
          </Link>
        </div>
      </div>
    </div>
  )
}
