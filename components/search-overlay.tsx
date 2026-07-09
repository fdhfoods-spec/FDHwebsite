'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Flame, Clock, Sparkles, Check, ShoppingCart, MapPin, ChevronDown, ArrowLeft, Star } from 'lucide-react'
import { useStore, type Product } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { LOCATIONS } from '@/lib/locations'

const POPULAR_SEARCHES = [
  'Chicken Breast',
  'Mutton Curry Cut',
  'Seer Fish',
  'Prawns',
  'Eggs',
  'Chicken Tikka',
]

const QUICK_CATEGORIES = [
  { name: 'Chicken', slug: 'chicken', image: '/cat-chicken.png' },
  { name: 'Mutton', slug: 'mutton', image: '/cat-mutton.png' },
  { name: 'Fish & Seafood', slug: 'fish', image: '/cat-fish.png' },
  { name: 'Eggs', slug: 'eggs', image: '/images/eggs-category.jpg' }
]

export function SearchOverlay() {
  const {
    searchQuery,
    setSearchQuery,
    isSearchFocused,
    setSearchFocused,
    addItem,
    items,
    products,
    selectedLocation,
    setSelectedLocation,
  } = useStore()

  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({})
  const overlayRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Location selector states
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [locationSearchQuery, setLocationSearchQuery] = useState('')

  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fdh_recent_searches')
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved))
        } catch (e) {
          console.warn('Failed to parse recent searches:', e)
        }
      }
    }
  }, [isSearchFocused])

  const addRecentSearch = (term: string) => {
    if (!term || term.trim() === '') return
    const cleaned = term.trim()
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== cleaned.toLowerCase())
      const updated = [cleaned, ...filtered].slice(0, 5)
      localStorage.setItem('fdh_recent_searches', JSON.stringify(updated))
      return updated
    })
  }

  // Disable body scroll when open
  useEffect(() => {
    if (isSearchFocused) {
      document.body.style.overflow = 'hidden'
      // Auto-focus input on mount
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isSearchFocused])

  // Filter products by search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions(products)
      return
    }

    const query = searchQuery.trim().toLowerCase()
    const filtered = products.filter((product: any) => {
      const nameMatch = product.name?.toLowerCase().includes(query)
      const catMatch = product.category?.toLowerCase().includes(query)
      const descMatch = product.description?.toLowerCase().includes(query)
      const badgeMatch = product.badge?.toLowerCase().includes(query)
      const tagsMatch = product.tags?.some((t: string) => t?.toLowerCase().includes(query))
      return nameMatch || catMatch || descMatch || badgeMatch || tagsMatch
    })

    // Sort: exact matches to the top
    const sorted = [...filtered].sort((a, b) => {
      const aExact = a.name?.toLowerCase() === query
      const bExact = b.name?.toLowerCase() === query
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      return 0
    })

    setSuggestions(sorted)
  }, [searchQuery, products])

  // Add to cart with feedback animation
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      weight: product.weight,
      price: product.price,
      image: product.image,
    })
    setAddedItems((prev) => ({ ...prev, [product.id]: true }))
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }))
    }, 2000)
  }

  // Key listeners
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSearchFocused(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setSearchFocused])

  const getFilteredLocations = () => {
    const query = locationSearchQuery.trim().toLowerCase()
    if (query === '') return []

    const results: { district: string; state: string }[] = []
    Object.entries(LOCATIONS).forEach(([state, districts]) => {
      districts.forEach((district) => {
        if (
          district.toLowerCase().includes(query) ||
          state.toLowerCase().includes(query)
        ) {
          results.push({ district, state })
        }
      })
    })
    return results
  }
  const locationSearchResults = getFilteredLocations()
  const matchedCategory = searchQuery.trim() !== ''
    ? QUICK_CATEGORIES.find(
        (cat) =>
          cat.slug.toLowerCase() === searchQuery.trim().toLowerCase() ||
          cat.name.toLowerCase() === searchQuery.trim().toLowerCase()
      )
    : null

  if (!isSearchFocused) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-white flex flex-col font-sans"
      ref={overlayRef}
    >
      {/* Header Bar of the Search Overlay */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-50 px-4 py-3 md:py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          {/* Back Button */}
          <button
            onClick={() => {
              setSearchFocused(false)
            }}
            className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors text-foreground/75 flex-shrink-0"
            aria-label="Close search"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>

          {/* Search Input Box */}
          <div className="flex-grow relative">
            <Search className="w-5 h-5 text-foreground/45 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by product name, cut, category (e.g. 'chicken breast', 'mutton')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addRecentSearch(searchQuery)
              }}
              className="w-full pl-12 pr-10 py-2.5 bg-gray-50 border border-gray-200 focus:border-primary/45 focus:ring-1 focus:ring-primary/20 focus:bg-white rounded-full text-sm font-semibold text-primary outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-150 rounded-full text-foreground/45"
                aria-label="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Picker in search */}
          <div className="relative flex-shrink-0" ref={locationRef}>
            <button
              onClick={() => {
                setIsLocationOpen(!isLocationOpen)
                setSelectedState(null)
                setLocationSearchQuery('')
              }}
              className="hidden md:flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-full text-xs font-semibold text-foreground/80 hover:text-primary hover:border-primary/45 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span>{selectedLocation || 'Select Location'}</span>
              <ChevronDown className={`w-3 h-3 text-foreground/45 transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLocationOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 py-3 overflow-hidden flex flex-col max-h-80"
              >
                <div className="px-3 pb-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-foreground/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search state or district..."
                      value={locationSearchQuery}
                      onChange={(e) => setLocationSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-primary/45 transition-colors"
                    />
                  </div>
                </div>

                {locationSearchQuery.trim() !== '' ? (
                  <div className="max-h-56 overflow-y-auto px-1 space-y-0.5">
                    {locationSearchResults.length === 0 ? (
                      <div className="px-3.5 py-4 text-center text-xs text-foreground/40">
                        No locations found
                      </div>
                    ) : (
                      locationSearchResults.map((res) => {
                        const fullLocString = `${res.district}, ${res.state}`
                        return (
                          <button
                            key={fullLocString}
                            onClick={() => {
                              setSelectedLocation(fullLocString)
                              setIsLocationOpen(false)
                              setLocationSearchQuery('')
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-between ${selectedLocation === fullLocString ? 'text-primary bg-primary/5' : 'text-foreground/75'}`}
                          >
                            <span>{res.district}</span>
                            <span className="text-[8px] text-foreground/45 font-bold uppercase">{res.state}</span>
                          </button>
                        )
                      })
                    )}
                  </div>
                ) : !selectedState ? (
                  <>
                    <p className="px-4 py-1 text-[8px] uppercase font-bold text-foreground/40 tracking-wider">
                      Select State
                    </p>
                    <div className="mt-1 max-h-52 overflow-y-auto">
                      {Object.keys(LOCATIONS).map((state) => (
                        <button
                          key={state}
                          onClick={() => setSelectedState(state)}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all duration-200 flex items-center justify-between"
                        >
                          <span>{state}</span>
                          <ChevronDown className="-rotate-90 w-3.5 h-3.5 text-foreground/35" />
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 px-3 pb-2 border-b border-gray-100">
                      <button
                        onClick={() => setSelectedState(null)}
                        className="p-1 hover:bg-muted rounded-full text-foreground/50 hover:text-primary transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] uppercase font-extrabold text-foreground/40 tracking-wider">
                        Districts in {selectedState}
                      </span>
                    </div>
                    <div className="mt-1.5 max-h-52 overflow-y-auto">
                      {(LOCATIONS[selectedState] || []).map((district) => {
                        const fullLocString = `${district}, ${selectedState}`
                        return (
                          <button
                            key={district}
                            onClick={() => {
                              setSelectedLocation(fullLocString)
                              setIsLocationOpen(false)
                              setSelectedState(null)
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-muted/40 transition-colors ${selectedLocation === fullLocString ? 'text-primary bg-primary/5 font-semibold' : 'text-foreground/70'}`}
                          >
                            {district}
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Desktop Escape Hint */}
          <span className="hidden lg:inline text-[10px] text-foreground/40 font-bold uppercase tracking-wider">
            [Esc] to close
          </span>
        </div>
      </div>

      {/* Content Body of Search Overlay */}
      <div className="flex-grow overflow-y-auto px-4 py-6 md:py-8 bg-slate-50/50">
        <div className="max-w-6xl mx-auto w-full">
          {/* Popular searches, categories & recent searches grid (always visible at the top when query is empty) */}
          {searchQuery.trim() === '' && (
            <div className="space-y-6 mb-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-foreground/45 tracking-wider">
                      <Clock className="w-4 h-4 text-secondary" />
                      <span>Recent Searches</span>
                    </div>
                    <button
                      onClick={() => {
                        setRecentSearches([])
                        localStorage.removeItem('fdh_recent_searches')
                      }}
                      className="text-[10px] font-bold text-red-500 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term)
                          addRecentSearch(term)
                        }}
                        className="px-4 py-2 bg-gray-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/20 text-xs font-bold text-foreground/70 hover:text-primary rounded-xl transition-all duration-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-foreground/45 tracking-wider mb-4">
                  <Flame className="w-4 h-4 text-secondary animate-pulse" />
                  <span>Popular Searches Today</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term)
                        addRecentSearch(term)
                      }}
                      className="px-4 py-2 bg-gray-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/20 text-xs font-bold text-foreground/70 hover:text-primary rounded-xl transition-all duration-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse by Category Suggestions */}
              <div className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-foreground/45 tracking-wider mb-4">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span>Browse by Category</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {QUICK_CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setSearchQuery(cat.name)
                        addRecentSearch(cat.name)
                      }}
                      className="group bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-primary/25 hover:shadow-sm rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden relative bg-muted mb-2.5 group-hover:scale-105 transition-transform duration-300">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                      <span className="text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Matched Category Banner */}
          {matchedCategory && (
            <div className="bg-gradient-to-r from-primary to-primary/90 text-white rounded-3xl p-6 flex items-center justify-between shadow-md relative overflow-hidden group mb-6">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none">
                <Image src={matchedCategory.image} alt={matchedCategory.name} fill className="object-cover" />
              </div>
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                  Matched Category
                </span>
                <h4 className="text-xl font-extrabold tracking-tight">
                  {matchedCategory.name}
                </h4>
                <p className="text-xs text-white/70">
                  Showing related fresh cuts and custom portions.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchFocused(false)
                  const el = document.getElementById('categories')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all relative z-10"
              >
                View Category Page
              </button>
            </div>
          )}

          {/* Results Grid Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/60 pb-4 mb-6">
            <div>
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">
                {searchQuery.trim() === '' ? 'All Available Products' : 'Search Results'}
              </h3>
              <p className="text-xs text-foreground/50 mt-1">
                {searchQuery.trim() === '' 
                  ? `Showing all ${suggestions.length} fresh cuts`
                  : `Found ${suggestions.length} matching fresh cut${suggestions.length !== 1 ? 's' : ''} for "${searchQuery}"`}
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  inputRef.current?.focus()
                }}
                className="text-xs font-bold text-secondary hover:underline self-start sm:self-auto"
              >
                Clear Search
              </button>
            )}
          </div>

          {suggestions.length === 0 ? (
            /* State: No results found */
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm space-y-4">
              <Sparkles className="w-12 h-12 text-foreground/20 mx-auto" />
              <h4 className="text-base font-bold text-primary">No results found</h4>
              <p className="text-xs text-foreground/60 leading-relaxed">
                We couldn't find any direct matches. Try adjusting your query or searching for broader terms like "chicken", "mutton", or "fish".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  inputRef.current?.focus()
                }}
                className="px-5 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-all"
              >
                Clear Search Input
              </button>
            </div>
              ) : (
                /* State 2b: Results Grid taking full screen width */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {suggestions.map((prod) => {
                    const inCart = items.some((i) => i.id === prod.id)
                    const hasAdded = addedItems[prod.id]

                    return (
                      <div
                        key={prod.id}
                        className="bg-white border border-gray-100 rounded-3xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
                      >
                        <Link
                          href={`/product/${prod.id}`}
                          onClick={() => {
                            addRecentSearch(prod.name)
                            setSearchFocused(false)
                          }}
                          className="flex-grow flex flex-col justify-between cursor-pointer"
                        >
                          <div>
                            {/* Product Image */}
                            <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-50 mb-3.5">
                              <Image
                                src={prod.image}
                                alt={prod.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              {prod.badge && (
                                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-secondary text-white text-[8px] font-black uppercase tracking-wider rounded-md shadow-sm">
                                  {prod.badge}
                                </span>
                              )}
                            </div>

                            {/* Category & Rating */}
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[9px] font-black text-secondary uppercase tracking-widest">
                                {prod.category}
                              </span>
                              <div className="flex items-center gap-0.5 text-amber-400 text-[10px] font-extrabold">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{prod.rating}</span>
                              </div>
                            </div>

                            {/* Product Name */}
                            <h4 className="text-xs font-extrabold text-primary line-clamp-2 hover:text-secondary transition-colors leading-snug">
                              {prod.name}
                            </h4>
                          </div>
                        </Link>

                        {/* Footer with Weight, Price, Add to Cart */}
                        <div className="border-t border-gray-50 pt-3 mt-3.5 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-foreground/45 block font-bold">
                              {prod.weight}
                            </span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-black text-primary">
                                ₹{prod.price}
                              </span>
                              {prod.originalPrice && (
                                <span className="text-[10px] text-foreground/35 line-through font-semibold">
                                  ₹{prod.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(prod)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                              hasAdded || inCart
                                ? 'bg-secondary text-white hover:bg-secondary'
                                : 'bg-primary hover:bg-primary/95 text-white'
                            }`}
                          >
                            {hasAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Add</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
        </div>
      </div>
  )
}
