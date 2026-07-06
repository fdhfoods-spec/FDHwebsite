'use client'

import { useState } from 'react'
import { useStore, type Vendor } from '@/lib/store'
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Award,
  CheckCircle,
  Clock,
  Edit2
} from 'lucide-react'
import type { UserRole } from './index'

interface SupplierManagementProps {
  userRole: UserRole
}

export function SupplierManagement({ userRole }: SupplierManagementProps) {
  const { vendors: rawVendors = [], addVendor, updateVendor } = useStore()
  const vendors = rawVendors || []

  const [searchQuery, setSearchQuery] = useState('')

  // Add Vendor Modal
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newVendor, setNewVendor] = useState<Omit<Vendor, 'id' | 'productsSupplied' | 'totalPurchases' | 'totalSpend' | 'deliveryPerformance'>>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gstNumber: '',
    status: 'active'
  })

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.gstNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVendor.name || !newVendor.phone) return

    addVendor({
      ...newVendor,
      productsSupplied: 5,
      totalPurchases: 0,
      totalSpend: 0,
      deliveryPerformance: 100
    })

    setIsAddOpen(false)
    setNewVendor({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      gstNumber: '',
      status: 'active'
    })
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Top Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center shadow-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendor name, contact person, or GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 text-white text-xs py-2.5 pl-10 pr-4 rounded-xl outline-none focus:border-secondary transition-all"
          />
        </div>

        {userRole !== 'warehouse_staff' && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 bg-secondary hover:bg-secondary/90 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-secondary/20"
          >
            <Plus className="w-4 h-4" /> Add New Supplier
          </button>
        )}
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((v) => (
          <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group">
            <div className="space-y-3">
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest block">{v.id}</span>
                  <h3 className="text-base font-black text-white group-hover:text-secondary transition-colors">{v.name}</h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  v.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                }`}>
                  {v.status}
                </span>
              </div>

              {/* Contact Details */}
              <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                <p className="flex items-center gap-2 text-white font-bold">
                  <span className="w-2 h-2 rounded-full bg-secondary" /> {v.contactPerson}
                </p>
                <p className="flex items-center gap-2 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> {v.phone}
                </p>
                <p className="flex items-center gap-2 font-mono">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> {v.email}
                </p>
                <p className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <FileText className="w-3.5 h-3.5 text-slate-500" /> GSTIN: {v.gstNumber}
                </p>
                <p className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-400 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" /> {v.address}
                </p>
              </div>
            </div>

            {/* Vendor Analytics Footer Cards */}
            <div className="border-t border-slate-800/80 pt-4 mt-2">
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-extrabold block">Total Spend</span>
                  <span className="text-xs font-black text-emerald-400 font-mono">₹{(v.totalSpend / 1000).toFixed(0)}k</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-extrabold block">Orders</span>
                  <span className="text-xs font-black text-white font-mono">{v.totalPurchases}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-extrabold block">Delivery Score</span>
                  <span className="text-xs font-black text-blue-400 font-mono">{v.deliveryPerformance}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-secondary" /> Add New Supplier Profile
            </h3>

            <form onSubmit={handleAddVendorSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Standard Farms Ltd."
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newVendor.contactPerson}
                    onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210"
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="orders@supplier.com"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">GSTIN Number</label>
                <input
                  type="text"
                  required
                  placeholder="07AAAAA1111A1Z1"
                  value={newVendor.gstNumber}
                  onChange={(e) => setNewVendor({ ...newVendor, gstNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none font-mono uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Warehouse / Supply Address</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Full physical address..."
                  value={newVendor.address}
                  onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-secondary/20"
                >
                  Save Supplier Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
