'use client'

import { useState } from 'react'
import { useStore, type CustomerAccount } from '@/lib/store'
import {
  Users,
  Search,
  Filter,
  Bell,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldAlert,
  Ban,
  UserCheck,
  Award,
  Sparkles
} from 'lucide-react'
import { CustomerProfileModal } from './customer-profile-modal'
import { NotificationsDrawer } from './notifications-drawer'

export function CustomerManagement() {
  const { customers, orders, adminNotifications } = useStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<'all' | 'active' | 'blocked' | 'new' | 'high_value'>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAccount | null>(null)
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const unreadNotifsCount = adminNotifications.filter((n) => !n.read).length

  // Map total orders and spend for each customer
  const enrichedCustomers = customers.map((c) => {
    const custOrders = orders.filter(
      (o) => o.customerPhone === c.phone || o.customerName.toLowerCase() === c.fullName.toLowerCase()
    )
    const totalOrders = custOrders.length
    const totalSpend = custOrders.reduce((sum, o) => sum + o.total, 0)
    return {
      ...c,
      totalOrders,
      totalSpend
    }
  })

  // Apply Search & Filters
  const filteredCustomers = enrichedCustomers.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)

    let matchesFilter = true
    if (filterCategory === 'active') matchesFilter = c.status === 'active'
    if (filterCategory === 'blocked') matchesFilter = c.status === 'blocked' || c.status === 'suspended'
    if (filterCategory === 'new') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000)
      matchesFilter = new Date(c.createdAt) >= thirtyDaysAgo
    }
    if (filterCategory === 'high_value') matchesFilter = c.totalSpend > 2000

    return matchesSearch && matchesFilter
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner Controls & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Total Registered Users</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">{customers.length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Active Verified Accounts</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{customers.filter((c) => c.status === 'active').length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Blocked / Suspended</span>
            <Ban className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-black text-red-400">{customers.filter((c) => c.status !== 'active').length}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">High Value Customers</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">{enrichedCustomers.filter((c) => c.totalSpend > 2000).length}</p>
        </div>
      </div>

      {/* Search Bar & Filter Tabs */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
        
        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All Users' },
            { id: 'active', label: 'Active' },
            { id: 'blocked', label: 'Blocked / Suspended' },
            { id: 'new', label: 'New Users' },
            { id: 'high_value', label: '⭐ High Value' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setFilterCategory(f.id as any)
                setCurrentPage(1)
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                filterCategory === f.id
                  ? 'bg-secondary border-secondary text-white shadow-md shadow-secondary/20'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input & Notifications Trigger */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Name, Email, Phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs py-2 pl-10 pr-4 rounded-xl outline-none focus:border-secondary transition-all"
            />
          </div>

          <button
            onClick={() => setIsNotifDrawerOpen(true)}
            className="p-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded-xl transition-all relative shrink-0"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] uppercase tracking-wider font-black text-slate-400">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Reg. Date</th>
                <th className="p-4 text-center">Account Status</th>
                <th className="p-4 text-center">Total Orders</th>
                <th className="p-4 font-mono">Total Spent</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 text-xs">
                    No matching customer accounts found.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center font-black text-xs">
                        {c.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-bold">{c.fullName}</p>
                        <p className="text-slate-500 text-[10px] font-mono">{c.id}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-slate-300 font-semibold">{c.phone}</p>
                      <p className="text-slate-500 text-[10px]">{c.email || 'N/A'}</p>
                    </td>
                    <td className="p-4 text-slate-400 font-medium">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          c.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : c.status === 'blocked'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-slate-300">
                      {c.totalOrders}
                    </td>
                    <td className="p-4 font-mono font-black text-white">
                      ₹{c.totalSpend.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {paginatedCustomers.length} of {filteredCustomers.length} accounts</span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded-lg text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs font-bold text-white">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded-lg text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Detailed Profile Slide-over Modal */}
      <CustomerProfileModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />

      {/* Admin Notifications & Security Drawer */}
      <NotificationsDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
      />

    </div>
  )
}
