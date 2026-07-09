import Image from 'next/image'
import { Star, Minus, Plus } from 'lucide-react'
import { useStore } from '@/lib/store'

interface HpProductCardProps {
  id: string | number
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
  const { items, addItem, updateQty, removeItem, setIsCartOpen, setCartStep } = useStore()

  const cartItem = items.find((item) => item.id === Number(id))

  const handleAddToCart = () => {
    addItem({
      id: Number(id),
      name,
      category,
      price,
      image,
      rating,
      reviews,
      badge,
    })
    setIsCartOpen(true)
    setCartStep('cart')
  }

  const handleIncreaseCartQty = () => {
    if (cartItem) {
      updateQty(Number(id), cartItem.qty + 1)
    }
  }

  const handleDecreaseCartQty = () => {
    if (cartItem) {
      if (cartItem.qty <= 1) {
        removeItem(Number(id))
      } else {
        updateQty(Number(id), cartItem.qty - 1)
      }
    }
  }

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
          <span className="text-lg font-bold text-primary">₹{price}</span>
          {cartItem ? (
            <div className="flex items-center border border-border rounded bg-card overflow-hidden shadow-sm">
              <button
                onClick={handleDecreaseCartQty}
                className="p-1.5 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 text-xs font-bold text-primary">{cartItem.qty}</span>
              <button
                onClick={handleIncreaseCartQty}
                className="p-1.5 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
