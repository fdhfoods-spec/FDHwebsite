'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import {
  User,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  Package,
  Truck,
  LogOut,
  ShieldCheck,
  Plus
} from 'lucide-react'

export default function UserProfilePage() {
  const router = useRouter()
  const { user, isAuthLoading, setUser, orders, addItem, setAuthModalOpen } = useStore()
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders')

  const [addresses, setAddresses] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')

  useEffect(() => {
    if (user) {
      const nameVal = user.name && user.name !== 'Verified Customer' ? user.name : ''
      const emailVal = user.email && !user.email.includes('@placeholder') && !user.email.includes('example.com') ? user.email : ''
      setProfileName(nameVal)
      setProfileEmail(emailVal)
    }
  }, [user])
  
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.phone) return
      
      let token = null
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession()
        token = session?.access_token
      }

      try {
        const res = await fetch(`/api/user/address?phone=${encodeURIComponent(user.phone)}`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        })
        const data = await res.json()
        if (data.address) {
          const parsed = typeof data.address === 'string' ? JSON.parse(data.address) : data.address
          if (Array.isArray(parsed)) {
            setAddresses(parsed)
          }
        }
      } catch (e) {
        console.error('Failed to fetch addresses', e)
      }
    }

    fetchAddresses()
  }, [user])

  const saveAddressesToDb = async (newAddresses: any[]) => {
    if (!user?.phone) return
    if (isSaving) return

    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      let token = null
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession()
        token = session?.access_token
      }

      const response = await fetch('/api/user/address', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ phone: user.phone, addresses: newAddresses })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save address')
      }

      if (data.addresses && Array.isArray(data.addresses)) {
        setAddresses(data.addresses)
      } else {
        setAddresses(newAddresses)
      }
      setSaveSuccess(true)
      setEditingId(null)
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (e: any) {
      console.error('Failed to save to database', e)
      setSaveError(e.message || 'Failed to save address. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const [editingId, setEditingId] = useState<number | 'new' | null>(null)
  const [formState, setFormState] = useState({ details: '' })

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans p-4">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-secondary animate-spin mx-auto" />
          <p className="text-xs font-bold text-foreground/70">Restoring account session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans p-4">
        <div className="w-full max-w-md p-8 bg-white border border-gray-100 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 bg-secondary/10 border border-secondary/20 text-secondary font-black text-2xl flex items-center justify-center mx-auto rounded-2xl">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-foreground">Customer Sign In Required</h2>
          <p className="text-foreground/70 text-xs leading-relaxed">Please sign in with your verified mobile number to view your order history and profile details.</p>
          <Link href="/auth?redirect=/profile" className="inline-block w-full py-3.5 bg-secondary hover:bg-secondary/90 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-secondary/20">
            Sign In via SMS OTP
          </Link>
        </div>
      </div>
    )
  }

  // Filter user orders by phone or email
  const userOrders = orders.filter((o) => {
    return (
      (user.phone && o.customerPhone === user.phone) ||
      (user.email && o.customerEmail === user.email) ||
      o.customerName.toLowerCase() === user.name.toLowerCase()
    )
  })

  const handleReorder = (orderItems: typeof orders[0]['items']) => {
    orderItems.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        category: 'general',
        weight: item.weight,
        price: item.price,
        originalPrice: Math.round(item.price * 1.2),
        rating: 5,
        reviews: 10,
        badge: 'Top Seller',
        image: item.image
      })
    })
    alert('Items re-added to your cart!')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-foreground font-sans pb-16">
      {/* Header Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors text-xs font-bold">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wider uppercase text-secondary">My Customer Portal</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* User Hero Banner */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              {user ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-foreground">{user ? user.name : 'Verified Customer'}</h1>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold uppercase rounded-full">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-foreground/70 mt-1">{user?.phone || '+91 98765 43210'} • {user?.email || 'customer@fdh.com'}</p>
            </div>
          </div>

          {user ? (
            <button
              onClick={() => {
                setUser(null)
                router.push('/')
              }}
              className="px-4 py-2 bg-gray-50 hover:bg-red-500/10 text-foreground/70 hover:text-red-400 border border-gray-100 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout Session
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-5 py-2.5 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-secondary/20"
            >
              Sign In / Authenticate
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 space-x-2">
          {[
            { id: 'orders', label: `My Orders (${userOrders.length})`, icon: ShoppingBag },
            { id: 'profile', label: 'Account Profile', icon: User },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-secondary text-secondary font-black'
                    : 'border-transparent text-foreground/70 hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-foreground uppercase tracking-wider">Order History & Tracking</h2>

            {userOrders.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-foreground/40 mx-auto" />
                <h3 className="text-foreground">No Orders Placed Yet</h3>
                <p className="text-xs text-foreground/70 max-w-sm mx-auto">Browse our fresh cuts catalog and place your first order today!</p>
                <Link href="/" className="inline-block px-6 py-3 bg-secondary text-white rounded-xl text-xs font-bold shadow-lg shadow-secondary/20">
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((o) => (
                  <div key={o.id} className="bg-white border border-gray-100 rounded-3xl p-5 space-y-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-3 gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-foreground/50 font-bold block">ORDER #{o.id}</span>
                        <span className="text-xs text-foreground/70">{new Date(o.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          o.status === 'delivered'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : o.status === 'cancelled'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                        }`}>
                          {o.status}
                        </span>

                        <Link
                          href={`/track/${o.id}`}
                          className="px-3.5 py-1.5 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 text-secondary rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <MapPin className="w-3.5 h-3.5 animate-bounce" /> Track Live
                        </Link>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 overflow-hidden relative border border-gray-200 shrink-0">
                              {item.image ? (
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                              ) : (
                                <Package className="w-4 h-4 text-foreground/40 m-2" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{item.name}</p>
                              <p className="text-[10px] text-foreground/70">{item.weight} x {item.qty}</p>
                            </div>
                          </div>
                          <span className="text-foreground">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order Total & Reorder Button */}
                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-foreground/50 block">Total Amount</span>
                        <span className="text-base font-mono font-black text-secondary">₹{o.total}</span>
                      </div>

                      <button
                        onClick={() => handleReorder(o.items)}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-foreground rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-secondary" /> Buy Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground uppercase tracking-wider">Account Information</h2>
              {!isEditingProfile ? (
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-xl hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      if (user) {
                        setUser({ ...user, name: profileName, email: profileEmail })
                      }
                      setIsEditingProfile(false)
                    }}
                    className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-xl hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => {
                      setProfileName(user?.name || '')
                      setProfileEmail(user?.email || '')
                      setIsEditingProfile(false)
                    }}
                    className="px-4 py-2 bg-white border border-gray-200 text-foreground text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <label className="text-[10px] font-bold text-foreground/50 uppercase block mb-1">Full Name</label>
                <input 
                  type="text"
                  readOnly={!isEditingProfile}
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className={`w-full bg-transparent font-bold text-sm text-foreground outline-none ${isEditingProfile ? 'border-b border-gray-300 pb-1' : ''}`}
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <span className="text-[10px] font-bold text-foreground/50 uppercase block mb-1">Phone Number</span>
                <span className="text-foreground font-bold text-sm">{user?.phone || '+91 98765 43210'}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <label className="text-[10px] font-bold text-foreground/50 uppercase block mb-1">Email (Optional)</label>
                <input 
                  type="email"
                  readOnly={!isEditingProfile}
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className={`w-full bg-transparent font-bold text-sm text-foreground outline-none ${isEditingProfile ? 'border-b border-gray-300 pb-1' : ''}`}
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <span className="text-[10px] font-bold text-foreground/50 uppercase block mb-1">Membership Status</span>
                <span className="text-emerald-400 font-bold text-sm">Active Premium Member</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4 overflow-hidden">
            <h2 className="text-foreground uppercase tracking-wider">Saved Addresses</h2>
            
            {saveSuccess && (
              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Address saved successfully!
              </div>
            )}
            
            <AnimatePresence mode="wait">
              {editingId !== null ? (
                <motion.div
                  key="edit"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-[10px] font-bold text-foreground/50 uppercase block mb-1">Full Address</label>
                    {saveError && (
                      <div className="mb-2 text-[10px] font-bold text-red-500 bg-red-500/10 p-2 rounded-lg">
                        {saveError}
                      </div>
                    )}
                    <textarea 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-secondary min-h-[80px]" 
                      value={formState.details}
                      onChange={(e) => setFormState({...formState, details: e.target.value})}
                      placeholder="Enter your full delivery address"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      disabled={isSaving}
                      onClick={() => {
                        if (!formState.details || !formState.details.trim()) {
                          setSaveError('Address details cannot be empty.')
                          return
                        }
                        if (editingId === 'new') {
                          const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1
                          saveAddressesToDb([...addresses, {
                            id: newId,
                            title: `Address ${newId}`,
                            details: formState.details,
                            isDefault: addresses.length === 0
                          }])
                        } else {
                          saveAddressesToDb(addresses.map(a => 
                            a.id === editingId ? { ...a, details: formState.details } : a
                          ))
                        }
                      }}
                      className="px-5 py-2.5 bg-secondary text-white text-xs font-bold rounded-xl shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="px-5 py-2.5 bg-white border border-gray-200 text-foreground text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div key={address.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-foreground">{address.title}</p>
                              {address.isDefault && (
                                <span className="px-2 py-0.5 bg-secondary/20 text-secondary text-[9px] font-bold rounded-lg uppercase">Default</span>
                              )}
                            </div>
                            <p className="text-foreground/70 text-[11px] mt-1">{address.details}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <button 
                            onClick={() => {
                              setFormState({ details: address.details })
                              setEditingId(address.id)
                            }}
                            className="px-4 py-2 bg-white border border-gray-200 text-foreground text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      onClick={() => {
                        setFormState({ details: '' })
                        setEditingId('new')
                      }}
                      className="px-5 py-2.5 bg-secondary text-white text-xs font-bold rounded-xl shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-colors"
                    >
                      Add Address
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  )
}
