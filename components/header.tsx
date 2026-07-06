'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, User, LogOut, Plus, Minus, Trash2, ShieldCheck, MapPin, Search, ChevronDown, Check, ArrowLeft, CreditCard, Banknote, ShieldAlert, CheckCircle, MessageSquare, Smartphone, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore, type Product } from '@/lib/store'
import { LOCATIONS } from '@/lib/locations'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { MapPickerModal } from '@/components/location/map-picker-modal'
import { SearchOverlay } from '@/components/search-overlay'

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email?: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export function Header() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false)

  // Location selection and search states
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [locationSearchQuery, setLocationSearchQuery] = useState('')

  // Search suggestion states
  const [headerSuggestions, setHeaderSuggestions] = useState<Product[]>([])
  const [addedAnimationItems, setAddedAnimationItems] = useState<Record<number, boolean>>({})

  // Cart Drawer Step Machine: 'cart' | 'checkout' | 'razorpay' | 'success'
  const [cartStep, setCartStep] = useState<'cart' | 'checkout' | 'razorpay' | 'success'>('cart')
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online' | 'whatsapp'>('cod')

  // Checkout Form State
  const [custName, setCustName] = useState('')
  const [custPhone, setCustPhone] = useState('')
  const [custAddress, setCustAddress] = useState('')
  const [cashConfirmed, setCashConfirmed] = useState(false)
  const [deliveryType, setDeliveryType] = useState<'immediate' | 'scheduled'>('immediate')
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0])
  const [scheduledSlot, setScheduledSlot] = useState('07:00 AM - 10:00 AM')
  
  // Location & Map Picker State
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [custLatitude, setCustLatitude] = useState<number>(28.5390)
  const [custLongitude, setCustLongitude] = useState<number>(77.2450)
  const [custDistanceKm, setCustDistanceKm] = useState<number>(2.5)
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState<string>('')
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])

  const ALL_TIME_SLOTS = [
    { label: '07:00 AM - 10:00 AM', endHour: 10 },
    { label: '10:00 AM - 01:00 PM', endHour: 13 },
    { label: '01:00 PM - 04:00 PM', endHour: 16 },
    { label: '04:00 PM - 07:00 PM', endHour: 19 },
    { label: '07:00 PM - 10:00 PM', endHour: 22 },
  ]

  const isTodaySelected = () => {
    if (!scheduledDate) return false
    const parts = scheduledDate.split('-')
    if (parts.length !== 3) return false
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)
    const today = new Date()
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    )
  }

  const availableSlots = useMemo(() => {
    if (!isTodaySelected()) {
      return ALL_TIME_SLOTS
    }
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    const currentDecimalHour = currentHour + currentMinutes / 60
    return ALL_TIME_SLOTS.filter(slot => slot.endHour > currentDecimalHour)
  }, [scheduledDate, isCartOpen])

  // Auto-validate and select first slot if current slot is invalid/expired
  useEffect(() => {
    if (availableSlots.length > 0) {
      const isCurrentValid = availableSlots.some(s => s.label === scheduledSlot)
      if (!isCurrentValid) {
        setScheduledSlot(availableSlots[0].label)
      }
    } else {
      if (scheduledSlot !== '') {
        setScheduledSlot('')
      }
    }
  }, [availableSlots, scheduledSlot])

  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setScheduledDate(tomorrow.toISOString().split('T')[0])
  }, [])

  // Simulated Razorpay fields
  const [simulatedSubMethod, setSimulatedSubMethod] = useState<'card' | 'upi' | 'netbanking' | null>(null)
  const [simulatedUpiId, setSimulatedUpiId] = useState('')
  const [simulatedCardNumber, setSimulatedCardNumber] = useState('')
  const [simulatedCardExpiry, setSimulatedCardExpiry] = useState('')
  const [simulatedCardCvv, setSimulatedCardCvv] = useState('')

  // Final verification parameters
  const [transactionId, setTransactionId] = useState('')
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)

  const desktopLocationRef = useRef<HTMLDivElement>(null)
  const mobileLocationRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false)
      }
    };
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const {
    items,
    removeItem,
    updateQty,
    clearCart,
    totalItems,
    subtotal,
    selectedLocation,
    setSelectedLocation,
    searchQuery,
    setSearchQuery,
    setSearchFocused,
    setAuthModalOpen,
    user,
    setUser,
    products,
    addOrder,
    whatsappNumber,
    deliveryFee: storeDeliveryFee,
    freeDeliveryLimit,
    enableCod,
    enableOnline,
    enableWhatsappCheckout,
    wishlist = [],
    setActiveFilter,
  } = useStore()

  const deliveryFee = subtotal > 0 && subtotal < freeDeliveryLimit ? storeDeliveryFee : 0
  const total = subtotal + deliveryFee

  // Automatically switch selected paymentMethod if its configuration gets disabled
  useEffect(() => {
    if (cartStep === 'checkout') {
      if (paymentMethod === 'cod' && !enableCod) {
        if (enableOnline) setPaymentMethod('online')
        else if (enableWhatsappCheckout) setPaymentMethod('whatsapp')
      } else if (paymentMethod === 'online' && !enableOnline) {
        if (enableCod) setPaymentMethod('cod')
        else if (enableWhatsappCheckout) setPaymentMethod('whatsapp')
      } else if (paymentMethod === 'whatsapp' && !enableWhatsappCheckout) {
        if (enableCod) setPaymentMethod('cod')
        else if (enableOnline) setPaymentMethod('online')
      }
    }
  }, [cartStep, enableCod, enableOnline, enableWhatsappCheckout, paymentMethod])

  // Close popovers if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node

      const clickedOutsideDesktop = !desktopLocationRef.current || !desktopLocationRef.current.contains(target)
      const clickedOutsideMobile = !mobileLocationRef.current || !mobileLocationRef.current.contains(target)

      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setIsLocationOpen(false)
        setSelectedState(null)
        setLocationSearchQuery('')
      }

      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchPanelOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-filter search matches
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setHeaderSuggestions([])
      return
    }
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setHeaderSuggestions(filtered)
  }, [searchQuery, products])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen || isMenuOpen) {
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [isCartOpen, isMenuOpen])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    useStore.getState().addItem({
      id: product.id,
      name: product.name,
      weight: product.weight,
      price: product.price,
      image: product.image,
    })
    setAddedAnimationItems((prev) => ({ ...prev, [product.id]: true }))
    setTimeout(() => {
      setAddedAnimationItems((prev) => ({ ...prev, [product.id]: false }))
    }, 1800)
  }

  // Pre-fill user profile fields on checkout screen if logged in
  useEffect(() => {
    if (user && isCartOpen) {
      setCustName((prev) => prev || user.name)
      if (user.phone) {
        setCustPhone((prev) => prev || user.phone || '')
      } else if (user.email && user.email.includes('whatsapp')) {
        setCustPhone((prev) => prev || user.name.replace(/\D/g, '') || '')
      }
      
      if (isSupabaseConfigured() && supabase && user.phone) {
        supabase.from('users').select('address').eq('phone', user.phone).single().then(({ data }) => {
          if (data?.address) {
            try {
              const parsed = JSON.parse(data.address)
              if (Array.isArray(parsed)) {
                setSavedAddresses(parsed)
                if (parsed.length > 0 && !custAddress) {
                  const defaultAddr = parsed.find(a => a.isDefault) || parsed[0]
                  setCustAddress(defaultAddr.details)
                }
              }
            } catch (e) {
              console.error('Failed to parse checkout addresses', e)
            }
          }
        })
      }
    }
  }, [user, isCartOpen])

  // Auto-open checkout cart if returning from auth redirect
  useEffect(() => {
    if (searchParams && searchParams.get('cart') === 'open') {
      setIsCartOpen(true)
      setCartStep('checkout')
    }
  }, [searchParams])

  // Filter districts across all states when searching inside the location selector
  const getFilteredLocations = () => {
    const query = locationSearchQuery.trim().toLowerCase()
    if (!query) return []

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

  // Load Razorpay script dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  // Handle placing a Cash on Delivery order
  const handlePlaceCodOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!custName || !custPhone || !custAddress || !cashConfirmed) return

    setIsProcessingCheckout(true)
    setTimeout(() => {
      setIsProcessingCheckout(false)
      const orderId = 'FDH-' + Math.floor(1000 + Math.random() * 9000)
      setLastPlacedOrderId(orderId)
      addOrder({
        id: orderId,
        customerName: custName,
        customerPhone: custPhone,
        customerAddress: custAddress,
        items: [...items],
        paymentMethod: 'cod',
        subtotal,
        deliveryFee,
        total,
        status: 'pending',
        date: new Date().toISOString(),
        latitude: custLatitude,
        longitude: custLongitude,
        distanceKm: custDistanceKm,
        estimatedDeliveryTime: '30-45 mins',
        deliveryType,
        scheduledDate: deliveryType === 'scheduled' ? scheduledDate : undefined,
        scheduledSlot: deliveryType === 'scheduled' ? scheduledSlot : undefined,
        scheduledTime: deliveryType === 'scheduled' ? scheduledSlot : undefined,
      })
      setCartStep('success')
      // Clear cart items in Zustand store
      clearCart()
    }, 1500)
  }

  // Handle opening the Razorpay payment window
  const handleOpenRazorpay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!custName || !custPhone || !custAddress) return

    setIsProcessingCheckout(true)

    const realKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

    // If there is no real, valid Razorpay key defined, open the simulated payment gateway directly.
    if (!realKey || realKey.includes('dummy') || realKey.includes('test_key') || realKey === '') {
      console.info("Using simulated Razorpay gateway. To use real SDK, configure NEXT_PUBLIC_RAZORPAY_KEY_ID.")
      setTimeout(() => {
        setIsProcessingCheckout(false)
        setCartStep('razorpay')
      }, 1000)
      return
    }

    const scriptLoaded = await loadRazorpayScript()

    if (!scriptLoaded) {
      console.warn("Could not load Razorpay SDK dynamically. Opening fallback simulation.")
      setIsProcessingCheckout(false)
      setCartStep('razorpay')
      return
    }

    try {
      const options: RazorpayOptions = {
        key: realKey,
        amount: total * 100, // paise
        currency: 'INR',
        name: 'Fresh Delivery Hub (FDH)',
        description: 'Premium Sourced Fresh Meat & Cuts',
        handler: function (response: RazorpayResponse) {
          setIsProcessingCheckout(true)
          setTimeout(() => {
            setIsProcessingCheckout(false)
            const payId = response.razorpay_payment_id || 'pay_razorpay_mock'
            setTransactionId(payId)
            const orderId = 'FDH-' + Math.floor(1000 + Math.random() * 9000)
            setLastPlacedOrderId(orderId)
            addOrder({
              id: orderId,
              customerName: custName,
              customerPhone: custPhone,
              customerAddress: custAddress,
              items: [...items],
              paymentMethod: 'online',
              subtotal,
              deliveryFee,
              total,
              status: 'preparing',
              date: new Date().toISOString(),
              latitude: custLatitude,
              longitude: custLongitude,
              distanceKm: custDistanceKm,
              estimatedDeliveryTime: '25-35 mins',
              deliveryType,
              scheduledDate: deliveryType === 'scheduled' ? scheduledDate : undefined,
              scheduledSlot: deliveryType === 'scheduled' ? scheduledSlot : undefined,
              scheduledTime: deliveryType === 'scheduled' ? scheduledSlot : undefined,
            })
            setCartStep('success')
            clearCart()
          }, 1200)
        },
        prefill: {
          name: custName,
          contact: custPhone,
          email: user?.email || '',
        },
        theme: {
          color: '#991B1B',
        },
        modal: {
          ondismiss: function () {
            setIsProcessingCheckout(false)
          }
        }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error("Failed to initialize Razorpay SDK window, loading local mockup:", err)
      setCartStep('razorpay')
    } finally {
      setIsProcessingCheckout(false)
    }
  }

  // Handle placing a WhatsApp Order
  const handlePlaceWhatsappOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!custName || !custPhone || !custAddress) return

    setIsProcessingCheckout(true)

    const itemsListText = items
      .map((item) => `• ${item.name} (${item.weight} x${item.qty}) - ₹${item.price * item.qty}`)
      .join('\n')

    const scheduleMsg = deliveryType === 'scheduled' 
      ? `*Delivery Schedule:* Scheduled for ${scheduledDate} (${scheduledSlot})\n`
      : `*Delivery Schedule:* Immediate Dispatch\n`

    const message = `*Fresh Delivery Hub (FDH) Order Details*\n\n` +
      `*Customer Name:* ${custName}\n` +
      `*Phone:* ${custPhone}\n` +
      `*Delivery Address:* ${custAddress}\n` +
      scheduleMsg + `\n` +
      `*Order Details:*\n${itemsListText}\n\n` +
      `*Subtotal:* ₹${subtotal}\n` +
      `*Delivery Fee:* ₹${deliveryFee === 0 ? 'FREE' : deliveryFee}\n` +
      `*Total Amount:* *₹${total}*\n\n` +
      `Please confirm and dispatch my vacuum-sealed package.`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    setTimeout(() => {
      setIsProcessingCheckout(false)
      const orderId = 'FDH-' + Math.floor(1000 + Math.random() * 9000)
      setLastPlacedOrderId(orderId)
      addOrder({
        id: orderId,
        customerName: custName,
        customerPhone: custPhone,
        customerAddress: custAddress,
        items: [...items],
        paymentMethod: 'whatsapp',
        subtotal,
        deliveryFee,
        total,
        status: 'pending',
        date: new Date().toISOString(),
        latitude: custLatitude,
        longitude: custLongitude,
        distanceKm: custDistanceKm,
        estimatedDeliveryTime: '30-45 mins',
        deliveryType,
        scheduledDate: deliveryType === 'scheduled' ? scheduledDate : undefined,
        scheduledSlot: deliveryType === 'scheduled' ? scheduledSlot : undefined,
        scheduledTime: deliveryType === 'scheduled' ? scheduledSlot : undefined,
      })
      window.open(whatsappUrl, '_blank')
      setCartStep('success')
      clearCart()
    }, 1500)
  }

  // Handle successful simulated online payment
  const handleSimulatedPaymentSuccess = () => {
    setIsProcessingCheckout(true)
    setTimeout(() => {
      setIsProcessingCheckout(false)
      const mockPayId = 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase()
      setTransactionId(mockPayId)
      const orderId = 'FDH-' + Math.floor(1000 + Math.random() * 9000)
      setLastPlacedOrderId(orderId)
      addOrder({
        id: orderId,
        customerName: custName,
        customerPhone: custPhone,
        customerAddress: custAddress,
        items: [...items],
        paymentMethod: 'online',
        subtotal,
        deliveryFee,
        total,
        status: 'preparing',
        date: new Date().toISOString(),
        latitude: custLatitude,
        longitude: custLongitude,
        distanceKm: custDistanceKm,
        estimatedDeliveryTime: '25-35 mins',
        deliveryType,
        scheduledDate: deliveryType === 'scheduled' ? scheduledDate : undefined,
        scheduledSlot: deliveryType === 'scheduled' ? scheduledSlot : undefined,
        scheduledTime: deliveryType === 'scheduled' ? scheduledSlot : undefined,
      })
      setCartStep('success')
      clearCart()
    }, 1500)
  }

  const resetCartDrawer = () => {
    setIsCartOpen(false)
    setCartStep('cart')
    setPaymentMethod('cod')
    setCustName('')
    setCustPhone('')
    setCustAddress('')
    setCashConfirmed(false)
    setTransactionId('')
    setSimulatedSubMethod(null)
    setSimulatedUpiId('')
    setSimulatedCardNumber('')
    setSimulatedCardExpiry('')
    setSimulatedCardCvv('')
    setDeliveryType('immediate')
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setScheduledDate(tomorrow.toISOString().split('T')[0])
    setScheduledSlot('Morning 8 AM - 11 AM')
  }

  const navLinks = [
    { name: 'Home', href: '/', onClick: (e: any) => {
        e.preventDefault()
        router.push('/')
        scrollToTop()
      }
    },
    { name: 'Categories', href: '/#categories', onClick: (e: any) => {
        e.preventDefault()
        router.push('/#categories')
        setTimeout(() => {
          const el = document.getElementById('categories')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 150)
      }
    },
    { name: 'Fresh Today', href: '/#bestsellers', onClick: (e: any) => {
        e.preventDefault()
        setActiveFilter('all')
        router.push('/#bestsellers')
        setTimeout(() => {
          const el = document.getElementById('bestsellers')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 150)
      }
    },
    { name: 'About', href: '/#why-fdh', onClick: (e: any) => {
        e.preventDefault()
        if (pathname === '/') {
          const el = document.getElementById('why-fdh')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          router.push('/#why-fdh')
        }
      }
    },
    { name: 'Contact', href: '/#contact', onClick: (e: any) => {
        e.preventDefault()
        router.push('/#contact')
        setTimeout(() => {
          const el = document.getElementById('contact')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 150)
      }
    },
  ]

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-colors duration-300 ${isScrolled
          ? 'bg-white border-b border-gray-100 shadow-sm'
          : 'bg-white border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Logo & Location Dropdown */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link href="/" onClick={scrollToTop} className="flex items-center gap-2 group">
              <span className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-serif font-semibold text-xl tracking-tighter transition-transform group-hover:scale-105">
                F
              </span>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-lg leading-tight tracking-wider text-primary">FDH</span>
                <span className="font-sans text-[10px] tracking-widest text-secondary font-semibold uppercase leading-none">
                  Fresh Delivery Hub
                </span>
              </div>
            </Link>

            {/* Location Selector (Desktop) */}
            <div className="hidden lg:relative lg:block" ref={desktopLocationRef}>
              <button
                onClick={() => {
                  setIsLocationOpen(!isLocationOpen)
                  setSelectedState(null)
                  setLocationSearchQuery('')
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full hover:bg-gray-50 border border-gray-100 text-xs font-semibold text-foreground/80 hover:text-primary transition-all duration-200"
              >
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                <span>{selectedLocation}</span>
                <ChevronDown className={`w-3 h-3 text-foreground/45 transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLocationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 py-3 overflow-hidden flex flex-col"
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
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-between ${selectedLocation === fullLocString ? 'text-primary bg-primary/5' : 'text-foreground/75'
                                  }`}
                              >
                                <span>{res.district}</span>
                                <span className="text-[9px] text-foreground/40 font-bold uppercase">{res.state}</span>
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
                                className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-muted/40 transition-colors ${selectedLocation === fullLocString ? 'text-primary bg-primary/5 font-semibold' : 'text-foreground/70'
                                  }`}
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
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-grow max-w-sm relative" ref={searchRef}>
            <div className="relative">
              <Search className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search premium fresh cuts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onClick={() => setSearchFocused(true)}
                onTouchStart={() => setSearchFocused(true)}
                readOnly
                className="w-full pl-10 pr-4 py-2 border border-gray-200 focus:border-primary/45 focus:ring-1 focus:ring-primary/20 rounded-full bg-gray-50/50 hover:bg-gray-50 text-xs font-medium outline-none transition-all duration-200 cursor-pointer"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Suggestions Panel */}
            <AnimatePresence>
              {isSearchPanelOpen && searchQuery.trim() !== '' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  {headerSuggestions.length === 0 ? (
                    <div className="p-4 text-center text-foreground/45 text-xs">
                      No matching fresh cuts found
                    </div>
                  ) : (
                    <div className="p-1.5 max-h-72 overflow-y-auto space-y-1">
                      <p className="px-2.5 py-1 text-[8px] uppercase font-extrabold text-foreground/40 tracking-wider">
                        Suggested Fresh Cuts
                      </p>
                      {headerSuggestions.map((prod) => {
                        const inCart = items.some((i) => i.id === prod.id)
                        const hasAdded = addedAnimationItems[prod.id]
                        return (
                          <div
                            key={prod.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-gray-50"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative w-8 h-8 rounded bg-muted overflow-hidden flex-shrink-0">
                                <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-[11px] font-bold text-primary leading-tight truncate">
                                  {prod.name}
                                </h4>
                                <p className="text-[9px] text-foreground/45 mt-0.5 font-semibold">
                                  {prod.weight} • {prod.category}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-extrabold text-primary">₹{prod.price}</span>
                              <button
                                onClick={(e) => handleQuickAdd(prod, e)}
                                className={`p-1.5 rounded-md transition-colors ${hasAdded || inCart
                                    ? 'bg-secondary text-white'
                                    : 'bg-primary hover:bg-primary/95 text-white'
                                  }`}
                              >
                                {hasAdded ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Plus className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={link.onClick}
                  className={`relative text-xs font-semibold tracking-wide transition-colors py-2 group ${
                    isActive ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary transition-transform origin-left duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              )
            })}
          </nav>

          {/* Actions Panel */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Location Selector (Mobile) */}
            <div className="lg:hidden relative" ref={mobileLocationRef}>
              <button
                onClick={() => {
                  setIsLocationOpen(!isLocationOpen)
                  setSelectedState(null)
                  setLocationSearchQuery('')
                }}
                className="p-2 hover:bg-primary/5 rounded-full transition-colors flex items-center gap-1 text-foreground/70"
                aria-label="Select location"
              >
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-[10px] font-bold hidden sm:inline">{selectedLocation.split(',')[0]}</span>
              </button>

              <AnimatePresence>
                {isLocationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2.5 overflow-hidden flex flex-col"
                  >
                    {/* Location Search Input for mobile */}
                    <div className="px-3 pb-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-foreground/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search state or district..."
                          value={locationSearchQuery}
                          onChange={(e) => setLocationSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary/45"
                        />
                      </div>
                    </div>

                    {locationSearchQuery.trim() !== '' ? (
                      <div className="max-h-52 overflow-y-auto px-1 space-y-0.5">
                        {locationSearchResults.length === 0 ? (
                          <div className="px-3 py-4 text-center text-xs text-foreground/45">
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
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-between ${selectedLocation === fullLocString ? 'text-primary bg-primary/5' : 'text-foreground/75'
                                  }`}
                              >
                                <span>{res.district}</span>
                                <span className="text-[8px] text-foreground/40 font-bold uppercase">{res.state}</span>
                              </button>
                            )
                          })
                        )}
                      </div>
                    ) : !selectedState ? (
                      <>
                        <p className="px-3.5 py-1 text-[8px] uppercase font-bold text-foreground/45 tracking-wider">
                          Select State
                        </p>
                        {Object.keys(LOCATIONS).map((state) => (
                          <button
                            key={state}
                            onClick={() => setSelectedState(state)}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-foreground/70 hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-between"
                          >
                            <span>{state}</span>
                            <ChevronDown className="-rotate-90 w-3 h-3 text-foreground/40" />
                          </button>
                        ))}
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 px-2.5 pb-2 border-b border-gray-100">
                          <button
                            onClick={() => setSelectedState(null)}
                            className="p-0.5 hover:bg-muted rounded text-foreground/50"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[8px] uppercase font-extrabold text-foreground/40">
                            {selectedState}
                          </span>
                        </div>
                        <div className="max-h-52 overflow-y-auto">
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
                                className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-muted/40 transition-colors ${selectedLocation === fullLocString ? 'text-primary bg-primary/5 font-semibold' : 'text-foreground/70'
                                  }`}
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

            {/* Mobile Search Button */}
            <button
              onClick={() => {
                const searchSection = document.getElementById('premium-search-section')
                if (searchSection) {
                  searchSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
              }}
              className="p-2.5 hover:bg-primary/5 active:bg-primary/10 rounded-full transition-colors text-foreground/80 md:hidden"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>



            {/* Cart Button */}
            <button
              onClick={() => {
                setCartStep('cart')
                setIsCartOpen(true)
              }}
              className="relative p-2.5 hover:bg-primary/5 active:bg-primary/10 rounded-full transition-colors group"
            >
              <ShoppingCart className="w-5 h-5 text-foreground/80 group-hover:text-primary transition-colors" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-4.5 h-4.5 bg-secondary text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Profile */}
            {user ? (
              <div className="relative hidden sm:block" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-50 border border-gray-100 text-xs font-semibold text-primary transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-[9px] font-extrabold uppercase">
                    {user.name.slice(0, 2)}
                  </div>
                  <span>{user.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-foreground/45 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-50 overflow-hidden"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-foreground/80 hover:text-primary hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <User className="w-3.5 h-3.5" /> My Profile & Orders
                      </Link>
                      <button
                        onClick={async () => {
                          setIsProfileOpen(false)
                          if (isSupabaseConfigured() && supabase) {
                            await supabase.auth.signOut()
                          }
                          setUser(null)
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border-t border-gray-100 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => router.push('/auth')}
                className="hidden sm:flex text-foreground/80 hover:text-primary text-xs font-semibold hover:bg-transparent items-center gap-1"
              >
                <User className="w-4 h-4" /> Sign In
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-primary/5 active:bg-primary/10 rounded-full transition-colors text-foreground/80 focus:outline-none xl:hidden"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="xl:hidden border-t border-gray-100 bg-white shadow-inner overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={(e) => {
                        if (link.onClick) link.onClick(e)
                        setIsMenuOpen(false)
                      }}
                      className={`block px-4 py-3 rounded-lg font-semibold text-sm transition-colors ${
                        isActive 
                          ? 'bg-primary/5 text-primary' 
                          : 'text-foreground/80 hover:bg-muted/40 hover:text-primary'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )
                })}
              </nav>
              <div className="h-px bg-gray-100" />
              <div className="flex flex-col gap-3 px-4">
                {user ? (
                  <div className="flex flex-col gap-2 p-2.5 bg-muted/40 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2.5 px-1.5">
                      <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-extrabold uppercase">
                        {user.name.slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary">{user.name}</span>
                        <span className="text-[9px] text-foreground/45 leading-none">{user.email}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        if (isSupabaseConfigured() && supabase) {
                          await supabase.auth.signOut()
                        }
                        setUser(null)
                        setIsMenuOpen(false)
                      }}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 text-xs font-bold py-2 mt-1.5"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push('/auth')
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-foreground/80 border-gray-200 hover:text-primary"
                  >
                    <User className="w-4 h-4 mr-2" /> Sign In
                  </Button>
                )}
                <Link href="#categories" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/95 text-white">Shop Now</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CART DRAWER ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetCartDrawer}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />

            {/* Sliding panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  {cartStep !== 'cart' && cartStep !== 'success' && (
                    <button
                      onClick={() => setCartStep(cartStep === 'razorpay' ? 'checkout' : 'cart')}
                      className="p-1 hover:bg-muted rounded-full text-foreground/50 hover:text-primary transition-colors mr-1"
                    >
                      <ArrowLeft className="w-4.5 h-4.5" />
                    </button>
                  )}
                  <span className="font-sans font-bold text-lg text-primary">
                    {cartStep === 'cart' && 'Your Basket'}
                    {cartStep === 'checkout' && 'Checkout Details'}
                    {cartStep === 'razorpay' && 'Razorpay Security Gateway'}
                    {cartStep === 'success' && 'Order Confirmed'}
                  </span>
                </div>
                <button
                  onClick={resetCartDrawer}
                  className="p-2 hover:bg-muted rounded-full transition-colors text-foreground/60 hover:text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step 1: Standard Basket Items list */}
              {cartStep === 'cart' && (
                <>
                  <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-foreground/30 mb-4">
                          <ShoppingCart className="w-8 h-8" />
                        </div>
                        <h4 className="font-sans font-bold text-base text-primary">Your Basket is Empty</h4>
                        <p className="text-foreground/50 text-xs mt-2 max-w-[200px] leading-relaxed">
                          Add premium fresh cuts from our collection to get started.
                        </p>
                        <Button
                          onClick={() => {
                            setIsCartOpen(false)
                            if (window.location.pathname !== '/') {
                              router.push('/#categories')
                            } else {
                              document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
                            }
                          }}
                          className="mt-6 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg"
                        >
                          Shop Premium Cuts
                        </Button>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {items.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.25 }}
                            className="flex items-start gap-4 p-4 bg-muted/30 border border-gray-100 rounded-xl relative"
                          >
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>

                            <div className="flex-grow min-w-0">
                              <h4 className="font-sans font-bold text-sm text-primary leading-tight truncate pr-6">
                                {item.name}
                              </h4>
                              <p className="text-foreground/50 text-[10px] uppercase font-bold tracking-wider mt-1">
                                {item.weight}
                              </p>

                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                  <button
                                    onClick={() => updateQty(item.id, item.qty - 1)}
                                    className="p-1.5 hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="px-3 text-xs font-bold text-primary">{item.qty}</span>
                                  <button
                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                    className="p-1.5 hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <span className="font-sans font-extrabold text-sm text-primary">
                                  ₹{item.price * item.qty}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="absolute top-4 right-4 text-foreground/30 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>

                  {items.length > 0 && (
                    <div className="p-6 border-t border-gray-100 space-y-4 bg-muted/20 flex-shrink-0">
                      <div className="space-y-2 text-xs font-medium">
                        <div className="flex justify-between text-foreground/60">
                          <span>Subtotal</span>
                          <span className="font-bold text-primary">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-foreground/60">
                          <span>Chilled Delivery Fee</span>
                          {deliveryFee === 0 ? (
                            <span className="text-secondary font-bold">FREE</span>
                          ) : (
                            <span className="font-bold text-primary">₹{deliveryFee}</span>
                          )}
                        </div>
                        {deliveryFee > 0 && (
                          <p className="text-[10px] text-secondary font-semibold">
                            Add ₹{freeDeliveryLimit - subtotal} more for free delivery
                          </p>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
                        <span className="font-sans font-bold text-sm text-primary">Total</span>
                        <div className="text-right">
                          <span className="font-sans font-extrabold text-xl text-primary">₹{total}</span>
                          <p className="text-[9px] text-foreground/45 mt-0.5 leading-none">All taxes included</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-red-50/50 border border-red-100/50 rounded-xl text-[10px] text-red-900 font-medium">
                        <ShieldCheck className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span>Transported at 0-4°C to lock in authentic quality.</span>
                      </div>

                      <Button
                        onClick={() => {
                          if (!user) {
                            // Prompt login before checkout
                            router.push('/auth?redirect=/?cart=open')
                          } else {
                            setCartStep('checkout')
                          }
                        }}
                        className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-widest py-6 rounded-xl shadow-sm hover:shadow transition-all duration-300"
                      >
                        {!user ? 'Sign In to Checkout →' : 'Proceed to Checkout →'}
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Step 2: Checkout Form & Payment Selection */}
              {cartStep === 'checkout' && (
                <div className="flex-grow overflow-y-auto p-6 flex flex-col justify-between">
                  <form
                    onSubmit={
                      paymentMethod === 'cod'
                        ? handlePlaceCodOrder
                        : paymentMethod === 'online'
                          ? handleOpenRazorpay
                          : handlePlaceWhatsappOrder
                    }
                    className="space-y-5"
                  >
                    {/* User Details */}
                    <div className="space-y-3.5">
                      <h4 className="text-[10px] uppercase font-extrabold text-foreground/40 tracking-wider">
                        Delivery Contact Info
                      </h4>
                      <div>
                        <input
                          type="text"
                          placeholder="Recipient Full Name"
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50/50 focus:bg-white border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="Mobile Number"
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-3 bg-gray-50/50 focus:bg-white border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                          required
                        />
                      </div>
                      <div>
                        {savedAddresses.length > 0 && (
                          <div className="mb-3 space-y-2">
                            <label className="text-[10px] font-bold text-foreground/50 uppercase block">Select Saved Address</label>
                            <div className="flex flex-wrap gap-2">
                              {savedAddresses.map((addr, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setCustAddress(addr.details)}
                                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                                    custAddress === addr.details
                                      ? 'bg-secondary/10 border-secondary text-secondary'
                                      : 'bg-white border-gray-200 text-foreground/70 hover:bg-gray-50'
                                  }`}
                                >
                                  {addr.title}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <textarea
                          placeholder="Complete Shipping Address (Flat No, Street, Landmark)"
                          value={custAddress}
                          onChange={(e) => setCustAddress(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-50/50 focus:bg-white border border-gray-200 rounded-xl text-xs font-semibold outline-none resize-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setIsMapModalOpen(true)}
                          className="mt-2 w-full py-2 px-3 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 text-secondary rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <MapPin className="w-4 h-4" /> Pin Exact Location on Map & Check 30km Radius
                        </button>
                      </div>
                    </div>

                    {/* Delivery Scheduling */}
                    <div className="space-y-3 bg-muted/40 border border-gray-100 rounded-xl p-3.5">
                      <h4 className="text-[10px] uppercase font-extrabold text-foreground/45 tracking-wider">
                        Delivery Schedule
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDeliveryType('immediate')}
                          className={`py-2 px-3 rounded-lg border text-center transition-all text-xs font-bold ${
                            deliveryType === 'immediate'
                              ? 'border-secondary bg-secondary/5 text-secondary'
                              : 'border-gray-200 text-foreground/60 hover:bg-gray-50'
                          }`}
                        >
                          ⚡ Immediate Dispatch
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryType('scheduled')}
                          className={`py-2 px-3 rounded-lg border text-center transition-all text-xs font-bold ${
                            deliveryType === 'scheduled'
                              ? 'border-secondary bg-secondary/5 text-secondary'
                              : 'border-gray-200 text-foreground/60 hover:bg-gray-50'
                          }`}
                        >
                          📅 Schedule Delivery
                        </button>
                      </div>

                      {deliveryType === 'scheduled' && (
                        <div className="grid grid-cols-2 gap-2 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="space-y-1">
                            <label className="text-[8px] uppercase font-black text-foreground/50">Select Date</label>
                            <input
                              type="date"
                              value={scheduledDate}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={(e) => setScheduledDate(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold outline-none"
                              required={deliveryType === 'scheduled'}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] uppercase font-black text-foreground/50">Time Slot</label>
                            <select
                              value={scheduledSlot}
                              onChange={(e) => setScheduledSlot(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold outline-none"
                              disabled={availableSlots.length === 0}
                            >
                              {availableSlots.length > 0 ? (
                                availableSlots.map((slot) => (
                                  <option key={slot.label} value={slot.label}>
                                    {slot.label}
                                  </option>
                                ))
                              ) : (
                                <option value="">No Slots Available</option>
                              )}
                            </select>
                          </div>
                          {availableSlots.length === 0 && (
                            <p className="text-red-500 text-[8px] font-black uppercase tracking-wide mt-1.5 col-span-2 animate-pulse">
                              ⚠️ No delivery slots available for today. Please select a future date.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Payment Mode Selection */}
                    <div className="space-y-2.5">
                      <h4 className="text-[10px] uppercase font-extrabold text-foreground/40 tracking-wider">
                        Select Payment Method
                      </h4>
                      {([enableCod, enableOnline, enableWhatsappCheckout].filter(Boolean).length === 0) ? (
                        <div className="p-3.5 bg-red-50/50 border border-red-100 rounded-xl text-center text-xs text-red-600 font-semibold">
                          Checkout is temporarily disabled. Please contact the administrator.
                        </div>
                      ) : (
                        <div className={`grid gap-2 ${
                          [enableCod, enableOnline, enableWhatsappCheckout].filter(Boolean).length === 3 ? 'grid-cols-3' :
                          [enableCod, enableOnline, enableWhatsappCheckout].filter(Boolean).length === 2 ? 'grid-cols-2' :
                          'grid-cols-1'
                        }`}>
                          {enableCod && (
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('cod')}
                              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center min-h-[72px] ${paymentMethod === 'cod'
                                  ? 'border-secondary bg-secondary/5 text-secondary shadow-sm'
                                  : 'border-gray-200 text-foreground/60 hover:border-gray-300'
                                }`}
                            >
                              <Banknote className="w-5 h-5 flex-shrink-0" />
                              <span className="text-[8px] font-black uppercase tracking-tight leading-tight">Cash on Delivery</span>
                            </button>
                          )}

                          {enableOnline && (
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('online')}
                              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center min-h-[72px] ${paymentMethod === 'online'
                                  ? 'border-secondary bg-secondary/5 text-secondary shadow-sm'
                                  : 'border-gray-200 text-foreground/60 hover:border-gray-300'
                                }`}
                            >
                              <CreditCard className="w-5 h-5 flex-shrink-0" />
                              <span className="text-[8px] font-black uppercase tracking-tight leading-tight">Online Payment</span>
                            </button>
                          )}

                          {enableWhatsappCheckout && (
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('whatsapp')}
                              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center min-h-[72px] ${paymentMethod === 'whatsapp'
                                  ? 'border-secondary bg-secondary/5 text-secondary shadow-sm'
                                  : 'border-gray-200 text-foreground/60 hover:border-gray-300'
                                }`}
                            >
                              <MessageSquare className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                              <span className="text-[8px] font-black uppercase tracking-tight leading-tight">WhatsApp Order</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Conditional Payment Details */}
                    {paymentMethod === 'cod' && (
                      <div className="p-4 bg-muted/40 border border-gray-100 rounded-xl space-y-2.5">
                        <h5 className="text-[9px] uppercase font-black text-foreground/45 tracking-wider">
                          COD Verification Checklist
                        </h5>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/75">
                            {custName.trim().length > 0 ? (
                              <span className="text-emerald-500 font-extrabold">✅</span>
                            ) : (
                              <span className="text-gray-300">⚪</span>
                            )}
                            <span className={custName.trim().length > 0 ? 'text-foreground/80' : 'text-foreground/40'}>
                              Name: {custName.trim() || 'Required'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/75">
                            {custPhone.trim().length === 10 ? (
                              <span className="text-emerald-500 font-extrabold">✅</span>
                            ) : (
                              <span className="text-gray-300">⚪</span>
                            )}
                            <span className={custPhone.trim().length === 10 ? 'text-foreground/80' : 'text-foreground/40'}>
                              Phone Number: {custPhone.trim() || 'Required (10 digits)'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/75">
                            {custAddress.trim().length > 0 ? (
                              <span className="text-emerald-500 font-extrabold">✅</span>
                            ) : (
                              <span className="text-gray-300">⚪</span>
                            )}
                            <span className={custAddress.trim().length > 0 ? 'text-foreground/80' : 'text-foreground/40'}>
                              Address: {custAddress.trim() || 'Required'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/75">
                            <span className="text-emerald-500 font-extrabold">✅</span>
                            <span className="text-foreground/80">
                              Order Details ({totalItems} Items - Total ₹{total})
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/75">
                            {cashConfirmed ? (
                              <span className="text-emerald-500 font-extrabold">✅</span>
                            ) : (
                              <span className="text-gray-300">⚪</span>
                            )}
                            <span className={cashConfirmed ? 'text-foreground/80' : 'text-foreground/40'}>
                              Cash Collection Confirmation
                            </span>
                          </div>
                        </div>

                        <div className="p-3 mt-2 bg-orange-50/40 border border-orange-100/50 rounded-lg space-y-2">
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              id="cod-confirm"
                              checked={cashConfirmed}
                              onChange={(e) => setCashConfirmed(e.target.checked)}
                              className="w-4 h-4 text-secondary mt-0.5 rounded cursor-pointer"
                              required
                            />
                            <label htmlFor="cod-confirm" className="text-[9px] font-bold text-orange-950 uppercase tracking-wide leading-relaxed cursor-pointer select-none">
                              I confirm that I will pay ₹{total} in cash upon receipt.
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'online' && (
                      <div className="p-3.5 bg-blue-50/30 border border-blue-100/40 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-blue-900 font-bold tracking-wide">
                          <span>Secured via Razorpay API Gateway</span>
                          <span className="bg-blue-600 text-white text-[8px] px-2 py-0.5 rounded uppercase font-black tracking-widest">
                            Secure
                          </span>
                        </div>
                        <p className="text-[9px] text-foreground/50 leading-relaxed">
                          Your transaction will be processed instantly via Razorpay Checkout. You can pay using Cards, UPI, Netbanking, or Wallets.
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'whatsapp' && (
                      <div className="p-3.5 bg-emerald-50/30 border border-emerald-100/40 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-emerald-900 font-bold tracking-wide">
                          <span>Direct Order via WhatsApp</span>
                          <span className="bg-emerald-600 text-white text-[8px] px-2 py-0.5 rounded uppercase font-black tracking-widest">
                            Instant
                          </span>
                        </div>
                        <p className="text-[9px] text-foreground/50 leading-relaxed">
                          Clicking checkout will compile your receipt details and redirect you to WhatsApp to place your order directly with our agent (+{whatsappNumber}).
                        </p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isProcessingCheckout || (deliveryType === 'scheduled' && availableSlots.length === 0)}
                        className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-widest py-6 rounded-xl flex items-center justify-center gap-1.5 shadow"
                      >
                        {isProcessingCheckout ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Processing Order...
                          </>
                        ) : paymentMethod === 'cod' ? (
                          `Place COD Order (₹${total})`
                        ) : paymentMethod === 'online' ? (
                          `Pay & Complete (₹${total})`
                        ) : (
                          `Proceed on WhatsApp (₹${total})`
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Order summary container */}
                  <div className="mt-8 border-t border-gray-100 pt-5">
                    <p className="text-[9px] uppercase font-bold text-foreground/40 tracking-wider mb-2">Order Details Summary</p>
                    <div className="space-y-1.5 max-h-24 overflow-y-auto">
                      {useStore.getState().items.map((item) => (
                        <div key={item.id} className="flex justify-between text-xs text-foreground/70 font-semibold px-1">
                          <span className="truncate max-w-[200px]">{item.name} ({item.weight} x{item.qty})</span>
                          <span>₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-50 mt-3 pt-2.5 flex justify-between text-xs font-bold text-primary">
                      <span>Total Amount</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Razorpay Simulated Gateway */}
              {cartStep === 'razorpay' && (
                <div className="flex-grow bg-slate-900/10 p-4 flex items-center justify-center overflow-y-auto">
                  {/* Razorpay Frame Mockup */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-xs bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
                  >
                    {/* Header */}
                    <div className="bg-[#0f2d59] p-4 text-white flex justify-between items-center flex-shrink-0">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-slate-300 font-extrabold leading-none">Merchant</span>
                        <span className="text-xs font-bold tracking-wide mt-1">Fresh Delivery Hub (FDH)</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-300 uppercase leading-none">Amount</p>
                        <p className="text-sm font-extrabold mt-1">₹{total}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4 text-left flex-grow overflow-y-auto max-h-[350px]">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-b border-gray-100 pb-2">
                        <span className="flex items-center gap-1">
                          {simulatedSubMethod && (
                            <button
                              type="button"
                              onClick={() => setSimulatedSubMethod(null)}
                              className="text-slate-500 hover:text-slate-700 font-extrabold mr-1 flex items-center gap-0.5"
                            >
                              ← Back
                            </button>
                          )}
                          Razorpay Checkout
                        </span>
                        <span className="text-[#0582ca] bg-blue-50 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-black">Test Mode</span>
                      </div>

                      {/* Main options selector */}
                      {!simulatedSubMethod ? (
                        <div className="space-y-3">
                          <div className="space-y-1.5 text-xs">
                            <p className="font-bold text-slate-700">Recipient Details:</p>
                            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] text-slate-600 flex justify-between">
                              <span><strong>{custName}</strong></span>
                              <span><strong>{custPhone}</strong></span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Payment Method</p>
                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={() => setSimulatedSubMethod('card')}
                                className="w-full p-3 bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-between transition-all"
                              >
                                <span className="flex items-center gap-2">
                                  <CreditCard className="w-4 h-4 text-blue-600" />
                                  Card (Visa, Mastercard, RuPay)
                                </span>
                                <span className="text-[9px] text-slate-400">→</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSimulatedSubMethod('upi')}
                                className="w-full p-3 bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-between transition-all"
                              >
                                <span className="flex items-center gap-2">
                                  <Smartphone className="w-4 h-4 text-emerald-600" />
                                  UPI (Google Pay, PhonePe, Paytm)
                                </span>
                                <span className="text-[9px] text-slate-400">→</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSimulatedSubMethod('netbanking')}
                                className="w-full p-3 bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-between transition-all"
                              >
                                <span className="flex items-center gap-2">
                                  <Banknote className="w-4 h-4 text-indigo-600" />
                                  Net Banking (SBI, HDFC, ICICI)
                                </span>
                                <span className="text-[9px] text-slate-400">→</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {/* Card Details Input */}
                      {simulatedSubMethod === 'card' && (
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Enter Card Details</p>
                          <div className="space-y-2">
                            <input
                              type="text"
                              maxLength={19}
                              placeholder="Card Number (16 digits)"
                              value={simulatedCardNumber}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                const formatted = value.match(/.{1,4}/g)?.join(' ') || value
                                setSimulatedCardNumber(formatted)
                              }}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-blue-400 text-foreground"
                              required
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                maxLength={5}
                                placeholder="MM/YY"
                                value={simulatedCardExpiry}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '')
                                  if (value.length > 2) {
                                    setSimulatedCardExpiry(value.substring(0, 2) + '/' + value.substring(2, 4))
                                  } else {
                                    setSimulatedCardExpiry(value)
                                  }
                                }}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-center outline-none focus:border-blue-400 text-foreground"
                                required
                              />
                              <input
                                type="password"
                                maxLength={3}
                                placeholder="CVV"
                                value={simulatedCardCvv}
                                onChange={(e) => setSimulatedCardCvv(e.target.value.replace(/\D/g, ''))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-center outline-none focus:border-blue-400 text-foreground"
                                required
                              />
                            </div>
                          </div>

                          <Button
                            onClick={handleSimulatedPaymentSuccess}
                            disabled={isProcessingCheckout || simulatedCardNumber.replace(/\s/g, '').length < 16 || simulatedCardExpiry.length < 5 || simulatedCardCvv.length < 3}
                            className="w-full bg-[#0582ca] hover:bg-[#0582ca]/90 text-white font-bold text-[10px] uppercase tracking-wider py-4.5 rounded-xl shadow flex items-center justify-center gap-1.5"
                          >
                            {isProcessingCheckout ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                Processing Payment...
                              </>
                            ) : (
                              `Pay ₹${total}`
                            )}
                          </Button>
                        </div>
                      )}

                      {/* UPI ID Input */}
                      {simulatedSubMethod === 'upi' && (
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Enter UPI Address</p>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="example@upi"
                              value={simulatedUpiId}
                              onChange={(e) => setSimulatedUpiId(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-blue-400 text-foreground"
                              required
                            />
                            <div className="grid grid-cols-4 gap-1.5 pt-1">
                              {['gpay', 'phonepe', 'paytm', 'ybl'].map((handle) => (
                                <button
                                  key={handle}
                                  type="button"
                                  onClick={() => setSimulatedUpiId(`${custPhone || 'customer'}@${handle}`)}
                                  className="py-1 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-[8px] font-black uppercase text-slate-500 rounded-md transition-colors"
                                >
                                  @{handle}
                                </button>
                              ))}
                            </div>
                          </div>

                          <Button
                            onClick={handleSimulatedPaymentSuccess}
                            disabled={isProcessingCheckout || !simulatedUpiId.includes('@')}
                            className="w-full bg-[#0582ca] hover:bg-[#0582ca]/90 text-white font-bold text-[10px] uppercase tracking-wider py-4.5 rounded-xl shadow flex items-center justify-center gap-1.5"
                          >
                            {isProcessingCheckout ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                Requesting UPI Payment...
                              </>
                            ) : (
                              `Pay ₹${total}`
                            )}
                          </Button>
                        </div>
                      )}

                      {/* Net Banking Bank Selector */}
                      {simulatedSubMethod === 'netbanking' && (
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Select Popular Bank</p>
                          <div className="grid grid-cols-2 gap-2">
                            {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'PNB'].map((bank) => (
                              <button
                                key={bank}
                                type="button"
                                onClick={handleSimulatedPaymentSuccess}
                                className="p-2.5 bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-200 rounded-lg text-[9px] font-bold text-slate-600 flex items-center gap-1.5 transition-all text-left"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                <span className="truncate">{bank}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-center gap-1.5 text-[8px] text-slate-400 font-medium pt-2 border-t border-slate-50 flex-shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Razorpay Secure (PCI-DSS Compliant)</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Step 4: Success confirmation screen */}
              {cartStep === 'success' && (
                <div className="flex-grow p-8 flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 border-4 border-emerald-50"
                  >
                    <CheckCircle className="w-12 h-12" />
                  </motion.div>

                  <h3 className="font-sans font-bold text-2xl text-primary mb-2">
                    {paymentMethod === 'online' ? 'Payment Successful!' : paymentMethod === 'whatsapp' ? 'Receipt Sent!' : 'Order Placed!'}
                  </h3>
                  <p className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100/50 mb-6">
                    Order Confirmed Successfully
                  </p>

                  <div className="w-full bg-muted/40 border border-gray-100 rounded-2xl p-5 space-y-3.5 text-xs text-left mb-8">
                    <div className="flex justify-between border-b border-gray-100/50 pb-2">
                      <span className="text-foreground/45">Recipient Name</span>
                      <span className="font-bold text-primary">{custName}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100/50 pb-2">
                      <span className="text-foreground/45">Delivery Address</span>
                      <span className="font-bold text-primary text-right max-w-[200px] truncate">{custAddress}</span>
                    </div>
                    {paymentMethod === 'online' && transactionId ? (
                      <div className="flex justify-between border-b border-gray-100/50 pb-2">
                        <span className="text-foreground/45">Razorpay payment ID</span>
                        <span className="font-mono font-bold text-secondary text-[10px]">{transactionId}</span>
                      </div>
                    ) : paymentMethod === 'whatsapp' ? (
                      <div className="flex justify-between border-b border-gray-100/50 pb-2">
                        <span className="text-foreground/45">Payment Method</span>
                        <span className="font-bold text-emerald-600">Sent via WhatsApp</span>
                      </div>
                    ) : (
                      <div className="flex justify-between border-b border-gray-100/50 pb-2">
                        <span className="text-foreground/45">Payment Method</span>
                        <span className="font-bold text-secondary">Cash on Delivery</span>
                      </div>
                    )}
                    <p className="text-[10px] text-foreground/50 text-center leading-normal pt-1.5">
                      Your farm-fresh cuts will be custom-portioned in our clean rooms and delivered chilled at your chosen schedule.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 w-full">
                    {lastPlacedOrderId && (
                      <Link
                        href={`/track/${lastPlacedOrderId}`}
                        onClick={() => resetCartDrawer()}
                        className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow text-center flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4 animate-bounce" /> Live Track Order Progress
                      </Link>
                    )}
                    <Button
                      onClick={resetCartDrawer}
                      className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-widest py-5 rounded-xl shadow"
                    >
                      Continue Sourcing
                    </Button>
                  </div>
                  <MapPickerModal
                    isOpen={isMapModalOpen}
                    onClose={() => setIsMapModalOpen(false)}
                    initialAddress={custAddress}
                    onSelectAddress={(loc) => {
                      setCustAddress(loc.address)
                      setCustLatitude(loc.latitude)
                      setCustLongitude(loc.longitude)
                      setCustDistanceKm(loc.distanceKm)
                    }}
                  />
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <SearchOverlay />
    </motion.header>
  )
}
