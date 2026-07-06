'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import {
  Star,
  ShoppingBag,
  Heart,
  ArrowLeft,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  ChevronRight,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const productId = parseInt(resolvedParams.id, 10)
  const router = useRouter()

  const { products, addItem, wishlist, toggleWishlist, reviews, addReview, fetchReviews, user } = useStore()

  const product = products.find((p) => p.id === productId) || products[0]
  const isBookmarked = wishlist.includes(productId)

  const [selectedWeight, setSelectedWeight] = useState('500g')
  const [quantity, setQuantity] = useState(1)
  const [reviewerName, setReviewerName] = useState(user?.name || '')
  const [ratingInput, setRatingInput] = useState(5)
  const [commentInput, setCommentInput] = useState('')
  const [showReviewSuccess, setShowReviewSuccess] = useState(false)

  useEffect(() => {
    if (productId) {
      fetchReviews(productId)
    }
  }, [productId, fetchReviews])

  const productReviews = reviews.filter((r) => r.productId === productId)

  const handleAddToCart = () => {
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        category: product.category,
        weight: selectedWeight,
        price: selectedWeight === '1kg' ? Math.round(product.price * 1.8) : product.price,
        originalPrice: product.originalPrice,
        rating: product.rating,
        reviews: product.reviews,
        badge: product.badge,
        image: product.image,
        vendorId: product.vendorId,
        vendorName: product.vendorName
      })
    }
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentInput.trim()) return
    addReview({
      productId,
      userName: reviewerName || 'Verified Customer',
      rating: ratingInput,
      comment: commentInput
    })
    setCommentInput('')
    setShowReviewSuccess(true)
    setTimeout(() => setShowReviewSuccess(false), 3000)
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold">Product Not Found</h2>
          <Link href="/" className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-xl">
            Return to Storefront
          </Link>
        </div>
      </div>
    )
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const currentPrice = selectedWeight === '1kg' ? Math.round(product.price * 1.8) : product.price

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Top Sticky Nav */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold">
            <ArrowLeft className="w-4 h-4" /> Back to Store Catalog
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2 rounded-xl border transition-all ${
                isBookmarked
                  ? 'bg-red-500/10 text-red-500 border-red-500/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-10">
        
        {/* Main Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Image Showcase */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl group">
            <div className="aspect-square relative rounded-2xl overflow-hidden bg-slate-950">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="absolute top-8 left-8 bg-secondary/90 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-lg">
              {product.badge}
            </span>
          </div>

          {/* Product Details & Actions */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span className="uppercase font-extrabold text-secondary tracking-wider">{product.category}</span>
                <span>•</span>
                <span className="font-mono">{product.vendorName || 'Standard Poultry Farms'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">{product.name}</h1>
              
              {/* Rating Summary */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg text-amber-400 text-xs font-black">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {product.rating}
                </div>
                <span className="text-xs text-slate-400 font-medium">({productReviews.length + product.reviews} customer reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-slate-900/60 border border-slate-850 p-5 rounded-2xl flex items-baseline gap-3">
              <span className="text-3xl font-black font-mono text-white">₹{currentPrice}</span>
              {product.originalPrice && (
                <span className="text-sm font-mono text-slate-500 line-through">₹{Math.round(currentPrice * 1.2)}</span>
              )}
              <span className="text-xs font-bold text-emerald-400 ml-auto bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Inclusive of all taxes
              </span>
            </div>

            {/* Weight Variant Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Select Package Weight</label>
              <div className="flex gap-3">
                {['500g', '1kg'].map((wt) => (
                  <button
                    key={wt}
                    onClick={() => setSelectedWeight(wt)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedWeight === wt
                        ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/20 font-black'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {wt} {wt === '1kg' ? '(Value Pack)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-1.5 w-36">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-mono font-bold text-white text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-secondary hover:bg-secondary/90 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-xl shadow-secondary/25 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add To Fresh Cart
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-850 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" /> Express 90-Min Delivery
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" /> FSSAI Certified 100% Fresh
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-secondary" /> Customer Reviews & Verified Ratings
            </h2>
            <span className="text-xs text-slate-400 font-mono">{productReviews.length} Ratings Logged</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Submit Review Form */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Leave a Verified Review</h3>
              
              {showReviewSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Review submitted successfully!
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Star Rating</label>
                  <select
                    value={ratingInput}
                    onChange={(e) => setRatingInput(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white outline-none focus:border-secondary font-bold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars (Good)</option>
                    <option value={3}>⭐⭐⭐ 3 Stars (Average)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Feedback Comment</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe freshness, taste, and packaging..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white outline-none focus:border-secondary resize-none"
                  />
                </div>

                <button type="submit" className="w-full py-2.5 bg-secondary text-white font-bold rounded-xl text-xs transition-all shadow">
                  Submit Feedback
                </button>
              </form>
            </div>

            {/* Reviews Feed */}
            <div className="lg:col-span-2 space-y-3">
              {productReviews.length === 0 ? (
                <div className="text-center text-slate-500 text-xs py-8">Be the first to review this product!</div>
              ) : (
                productReviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{rev.userName}</span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3 h-3 fill-current" /> {rev.rating}.0
                      </div>
                    </div>
                    <p className="text-xs text-slate-300">{rev.comment}</p>
                    <span className="text-[9px] font-mono text-slate-500 block">{new Date(rev.date).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* Related Products Carousel Grid */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-base font-black text-white uppercase tracking-wider">Frequently Bought Together</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <Link key={rel.id} href={`/product/${rel.id}`} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-secondary transition-all group">
                  <div className="aspect-square relative rounded-xl overflow-hidden bg-slate-950 mb-3">
                    <Image src={rel.image} alt={rel.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{rel.name}</h4>
                  <p className="text-xs font-mono font-black text-secondary mt-1">₹{rel.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
