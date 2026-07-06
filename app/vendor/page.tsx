'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import {
  Store,
  Boxes,
  ShoppingBag,
  CheckCircle,
  Clock,
  ArrowLeft,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  PackageCheck,
  Truck,
  Check,
  RefreshCw
} from 'lucide-react'

export default function VendorPortalPage() {
  const { user, isAuthLoading, vendors = [], orders = [], updateOrderStatus } = useStore()
  const [selectedVendorId, setSelectedVendorId] = useState<string>('VND-001')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'delivered'>('all')

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans p-4">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Verifying supplier session...</p>
        </div>
      </div>
    )
  }

  if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden font-sans p-4">
        <div className="w-full max-w-md p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-2xl flex items-center justify-center mx-auto rounded-2xl">
            <Store className="w-7 h-7" />
          </div>
          {!user ? (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-white">Vendor Portal Authentication Required</h2>
              <p className="text-slate-400 text-xs leading-relaxed">Please sign in with your verified supplier mobile number to manage orders and stock.</p>
              <Link href="/auth?redirect=/vendor" className="inline-block w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-600/20">
                Sign In via SMS OTP
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-white">Unauthorized Vendor Access</h2>
              <p className="text-slate-400 text-xs leading-relaxed">Your account ({user.phone}) does not have active vendor partner permissions.</p>
              <Link href="/" className="inline-block w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
                Return to Storefront
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }

  const vendorsList = vendors || []
  const ordersList = orders || []
  const activeVendor = vendorsList.find((v) => v.id === selectedVendorId) || vendorsList[0] || {
    id: 'VND-001',
    name: 'Standard Poultry Farms',
    contactPerson: 'Rahul Sharma',
    phone: '9876543210'
  }

  // Filter orders that contain items supplied by active vendor
  const vendorOrders = ordersList.filter((o) =>
    o.items && o.items.some((item) => {
      const vId = item.vendorId || `VND-00${(item.id % 3) + 1}`
      return vId === selectedVendorId
    })
  )

  // Filtered list by status
  const filteredVendorOrders = vendorOrders.filter((o) => {
    if (statusFilter === 'pending') return o.status === 'pending' || o.status === 'preparing'
    if (statusFilter === 'delivered') return o.status === 'delivered'
    return true
  })

  // Calculate vendor specific revenue and metrics
  let vendorRevenue = 0
  let pendingItemsCount = 0

  vendorOrders.forEach((o) => {
    o.items.forEach((item) => {
      const vId = item.vendorId || `VND-00${(item.id % 3) + 1}`
      if (vId === selectedVendorId) {
        vendorRevenue += item.price * item.qty
        if (o.status !== 'delivered' && o.status !== 'cancelled') {
          pendingItemsCount += item.qty
        }
      }
    })
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Top Navigation Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold">
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </Link>
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black tracking-wider uppercase text-emerald-400">Multi-Vendor Fulfillment Portal</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Vendor Profile & Switcher Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">{activeVendor.name}</h1>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold uppercase rounded-full">
                  Partner Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">ID: {activeVendor.id} • Contact: {activeVendor.contactPerson} ({activeVendor.phone})</p>
            </div>
          </div>

          {/* Vendor Switcher Dropdown */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850 space-y-1 min-w-[240px]">
            <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block">Switch Active Vendor Account</label>
            <select
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white text-xs font-bold py-2 px-3 rounded-xl outline-none focus:border-emerald-500"
            >
              {vendorsList.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vendor KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider">Vendor Sales Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white font-mono">₹{vendorRevenue.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider">Pending Items to Pack</span>
              <PackageCheck className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400 font-mono">{pendingItemsCount} units</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider">Supplied Orders Count</span>
              <ShoppingBag className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white font-mono">{vendorOrders.length} orders</p>
          </div>
        </div>

        {/* Orders Fulfillment Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Vendor Orders Fulfillment Queue</h2>
              <p className="text-xs text-slate-400">View orders containing products supplied by your farm/facility.</p>
            </div>

            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'pending', label: 'Pending Dispatch' },
                { id: 'delivered', label: 'Completed' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    statusFilter === f.id
                      ? 'bg-emerald-600 border-emerald-500 text-white font-black'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredVendorOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">No vendor orders found matching filter criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] uppercase tracking-wider font-black text-slate-400">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Supplied Items</th>
                    <th className="p-4">Delivery Slot</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Fulfillment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredVendorOrders.map((o) => {
                    const vendorItems = o.items.filter((item) => {
                      const vId = item.vendorId || `VND-00${(item.id % 3) + 1}`
                      return vId === selectedVendorId
                    })

                    return (
                      <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-mono font-black text-white">{o.id}</td>
                        <td className="p-4">
                          <p className="font-bold text-white">{o.customerName}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">{o.customerPhone}</p>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {vendorItems.map((vi, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span className="font-bold text-slate-200">{vi.name} ({vi.weight} x{vi.qty})</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-slate-400 font-medium">
                          {o.scheduledDate ? `${o.scheduledDate} (${o.scheduledSlot})` : 'Immediate Dispatch'}
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-800 text-slate-300">
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {o.status === 'pending' || o.status === 'accepted' ? (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'ready-for-pickup')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 shadow"
                            >
                              <Check className="w-3.5 h-3.5" /> Mark Packed & Ready
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Dispatched to Hub</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
