import Link from 'next/link'
import { HpProductCard } from './hp-product-card'

export function HpProductsSection() {
  const categories = [
    { id: 'beef', label: 'Beef', icon: '🥩' },
    { id: 'chicken', label: 'Chicken', icon: '🍗' },
    { id: 'pork', label: 'Pork', icon: '🐷' },
    { id: 'seafood', label: 'Seafood', icon: '🐟' },
  ]

  const bestSellers = [
    {
      id: '1',
      name: 'Grass-Fed Prime Ribeye',
      category: 'Beef',
      price: 24.99,
      image: '/images/ribeye.png',
      rating: 5,
      reviews: 324,
      badge: 'Best Seller',
    },
    {
      id: '2',
      name: 'Free-Range Chicken Breast',
      category: 'Chicken',
      price: 12.99,
      image: '/images/chicken-breast.png',
      rating: 5,
      reviews: 289,
      badge: 'Popular',
    },
    {
      id: '3',
      name: 'Organic Pork Tenderloin',
      category: 'Pork',
      price: 18.99,
      image: '/images/pork-tenderloin.png',
      rating: 4.8,
      reviews: 156,
    },
    {
      id: '4',
      name: 'Wild Salmon Fillet',
      category: 'Seafood',
      price: 22.99,
      image: '/images/salmon.png',
      rating: 4.9,
      reviews: 203,
      badge: 'Fresh',
    },
    {
      id: '5',
      name: 'Wagyu Beef Steaks',
      category: 'Beef',
      price: 44.99,
      image: '/images/wagyu.png',
      rating: 5,
      reviews: 178,
    },
    {
      id: '6',
      name: 'Turkey Ground Meat',
      category: 'Chicken',
      price: 9.99,
      image: '/images/turkey-ground.png',
      rating: 4.7,
      reviews: 142,
    },
    {
      id: '7',
      name: 'Lamb Chops',
      category: 'Pork',
      price: 26.99,
      image: '/images/lamb-chops.png',
      rating: 4.9,
      reviews: 98,
    },
    {
      id: '8',
      name: 'Sea Bass Whole Fish',
      category: 'Seafood',
      price: 32.99,
      image: '/images/seabass.png',
      rating: 4.8,
      reviews: 67,
    },
  ]

  return (
    <section id="products" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Products</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Browse our carefully curated selection of premium meat and seafood.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="px-6 py-2 rounded border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
            >
              {cat.icon} {cat.label}
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <HpProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
