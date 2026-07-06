'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Flame, Sparkles, Check, ShoppingCart, MapPin, ChevronDown, ArrowLeft } from 'lucide-react'
import { useStore, type Product } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { LOCATIONS } from '@/lib/locations'

// Products loaded dynamically from Zustand store

const POPULAR_SEARCHES = [
  'Chicken Breast',
  'Mutton Curry Cut',
  'Seer Fish',
  'Prawns',
  'Eggs',
  'Chicken Tikka',
]

export function SearchSection() {
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
  const containerRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)

  // Location selector states
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [locationSearchQuery, setLocationSearchQuery] = useState('')

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([])
      return
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setSuggestions(filtered)
  }, [searchQuery, products])

  // Reset "added" animation state after 2 seconds
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

  // Click outside and key listeners
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (locationRef.current && !locationRef.current.contains(target)) {
        setIsLocationOpen(false)
        setLocationSearchQuery('')
      }
      if (containerRef.current && !containerRef.current.contains(target)) {
        setSearchFocused(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSearchFocused(false)
        setIsLocationOpen(false)
        setLocationSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setSearchFocused])

  // Filter districts across all states when searching inside the location selector
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

  return (
    <section
      id="premium-search-section"
      className="py-20 bg-gradient-to-b from-white to-muted/20 border-b border-gray-100 relative overflow-hidden"
      ref={containerRef}
    >
      {/* Dynamic Background Accents */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">


        {/* Search Bar Container */}
        <div className="relative">
          <motion.div
            animate={{
              scale: isSearchFocused || isLocationOpen ? 1.01 : 1,
              boxShadow: isSearchFocused || isLocationOpen
                ? '0 20px 40px -15px rgba(153,27,27,0.08)'
                : '0 4px 20px -2px rgba(0,0,0,0.02)',
            }}
            transition={{ duration: 0.2 }}
            className={`flex flex-col md:flex-row items-stretch md:items-center bg-white border ${
              isSearchFocused || isLocationOpen ? 'border-primary/45' : 'border-gray-200'
            } rounded-2xl p-2.5 transition-all duration-200 gap-2 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100 overflow-visible`}
          >
            {/* Location selector */}
            <div className="relative flex-shrink-0 flex items-center px-4 py-3 md:py-2 md:h-10 w-full md:w-56" ref={locationRef}>
              <button
                onClick={() => {
                  setIsLocationOpen(!isLocationOpen)
                  setSelectedState(null)
                  setLocationSearchQuery('')
                }}
                className="flex items-center justify-between gap-2 text-xs sm:text-sm font-semibold text-foreground/80 hover:text-primary transition-colors w-full text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="truncate">{selectedLocation || 'Select Location'}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-foreground/45 transition-transform duration-200 flex-shrink-0 ${isLocationOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLocationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 md:right-auto md:w-72 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 py-3 overflow-hidden flex flex-col max-h-80"
                  >
                    {/* Location Search Input */}
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

                    {/* Search Results vs Standard Navigation */}
                    {locationSearchQuery.trim() !== '' ? (
                      <div className="max-h-56 overflow-y-auto px-1 space-y-0.5">
                        <p className="px-3.5 py-1 text-[8px] uppercase font-extrabold text-foreground/40 tracking-wider">
                          Search Results
                        </p>
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
                                  setSelectedState(null)
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Input section */}
            <div className="flex-grow flex items-center gap-3 px-4 py-4 md:py-2 md:h-10">
              <Search className="w-5.5 h-5.5 text-foreground/40 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by product name, cut, category (e.g. 'mutton', 'chicken breast')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full bg-transparent text-sm sm:text-base font-semibold text-primary outline-none placeholder:text-foreground/35 placeholder:font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors text-foreground/45 flex-shrink-0"
                  aria-label="Clear query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Autocomplete / Search Suggestions UI */}
          <AnimatePresence>
            {isSearchFocused && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-2xl z-40 overflow-hidden divide-y divide-gray-50"
              >
                {/* Popular searches suggestions when search is empty */}
                {searchQuery.trim() === '' ? (
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-foreground/40 tracking-wider mb-4">
                      <Flame className="w-3.5 h-3.5 text-secondary animate-pulse" />
                      <span>Popular Fresh Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-4 py-2 bg-muted/40 hover:bg-primary/5 border border-gray-100 hover:border-primary/20 text-xs font-semibold text-foreground/75 hover:text-primary rounded-xl transition-all duration-200"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Filtered autocomplete results list */
                  <div className="max-h-[380px] overflow-y-auto">
                    {suggestions.length === 0 ? (
                      <div className="p-8 text-center text-foreground/50">
                        <Sparkles className="w-8 h-8 text-foreground/20 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-foreground/60">No direct matches found</p>
                        <p className="text-[10px] mt-1">Try looking for general terms like "chicken", "mutton", "fish".</p>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        <p className="px-3 py-1.5 text-[9px] uppercase font-bold text-foreground/40 tracking-wider">
                          Found {suggestions.length} matching fresh cut{suggestions.length > 1 ? 's' : ''}
                        </p>
                        {suggestions.map((prod) => {
                          const hasAdded = addedItems[prod.id]
                          return (
                            <motion.div
                              key={prod.id}
                              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/40 transition-colors border border-transparent hover:border-gray-100"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="relative w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                  <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-primary leading-snug truncate">
                                    {prod.name}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1 text-[10px] text-foreground/50 font-bold uppercase tracking-wider">
                                    <span>{prod.category}</span>
                                    <span>•</span>
                                    <span>{prod.weight}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xs font-extrabold text-primary">₹{prod.price}</span>
                                <Button
                                  size="sm"
                                  onClick={() => handleAddToCart(prod)}
                                  className={`px-3 py-1 text-[10px] font-bold rounded-lg ${
                                    hasAdded
                                      ? 'bg-secondary text-white hover:bg-secondary'
                                      : 'bg-primary hover:bg-primary/95 text-white'
                                  }`}
                                >
                                  {hasAdded ? (
                                    <span className="flex items-center gap-1">
                                      <Check className="w-3 h-3" /> Added
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1">
                                      <ShoppingCart className="w-3 h-3" /> Add
                                    </span>
                                  )}
                                </Button>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestions Quick Bar */}
        {searchQuery && (
          <div className="mt-4 flex items-center justify-between text-xs text-foreground/50 px-2 font-medium">
            <span>Press Escape to close autocomplete suggestions</span>
            <button
              onClick={() => {
                setSearchQuery('')
                setSearchFocused(false)
              }}
              className="text-primary hover:underline font-bold"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
