'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { Heart, ShoppingBag, Trash2, ArrowLeft, Star } from 'lucide-react'

export default function WishlistPage() {
  const { products, wishlist, toggleWishlist, addItem } = useStore()

  const bookmarkedProducts = products.filter((p) => wishlist.includes(p.id))

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Header Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold">
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </Link>
          <div className="flex items-center gap-2 text-red-400">
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-xs font-black tracking-wider uppercase">My Saved Wishlist</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-850 pb-4">
          <div>
            <h1 className="text-xl font-black text-white">Your Bookmarked Items</h1>
            <p className="text-xs text-slate-400">Items saved for fast re-ordering.</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-300">{bookmarkedProducts.length} items</span>
        </div>

        {bookmarkedProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-xl">
            <Heart className="w-12 h-12 text-slate-600 mx-auto" />
            <h2 className="text-base font-bold text-white">Your Wishlist is Empty</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Explore our fresh cuts and tap the heart icon on any item to bookmark it here!</p>
            <Link href="/" className="inline-block px-6 py-3 bg-secondary text-white rounded-xl text-xs font-bold shadow-lg shadow-secondary/20">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bookmarkedProducts.map((product) => (
              <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between shadow-xl group hover:border-secondary transition-all">
                <div>
                  <div className="aspect-square relative rounded-2xl overflow-hidden bg-slate-950 mb-3">
                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 bg-slate-950/80 backdrop-blur-md rounded-xl text-red-400 border border-red-500/20 hover:scale-110 transition-transform"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[9px] font-extrabold text-secondary uppercase tracking-widest block mb-1">{product.category}</span>
                  <h3 className="text-xs font-bold text-white line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold mt-1">
                    <Star className="w-3 h-3 fill-current" /> {product.rating}
                  </div>
                </div>

                <div className="border-t border-slate-850 pt-3 mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-bold">{product.weight}</span>
                    <span className="text-base font-mono font-black text-white">₹{product.price}</span>
                  </div>

                  <button
                    onClick={() => addItem({
                      id: product.id,
                      name: product.name,
                      category: product.category,
                      weight: product.weight,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      rating: product.rating,
                      reviews: product.reviews,
                      badge: product.badge,
                      image: product.image
                    })}
                    className="px-3.5 py-2 bg-secondary text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-secondary/20"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
