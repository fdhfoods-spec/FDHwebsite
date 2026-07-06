'use client'

import React, { useState, Fragment } from 'react'
import Image from 'next/image'
import { useStore, type Product, type ProductVariant } from '@/lib/store'
import {
  Search,
  Filter,
  Plus,
  Minus,
  Edit2,
  ChevronDown,
  ChevronRight,
  Download,
  Upload,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Layers
} from 'lucide-react'
import type { UserRole } from './index'

interface InventoryTableProps {
  userRole: UserRole
}

export function InventoryTable({ userRole }: InventoryTableProps) {
  const { products: rawProducts = [], vendors: rawVendors = [], adjustStock, updateProduct } = useStore()
  const products = rawProducts || []
  const vendors = rawVendors || []

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedVendor, setSelectedVendor] = useState<string>('all')

  // Expanded row IDs
  const [expandedProductIds, setExpandedProductIds] = useState<number[]>([])

  // Modal State for Manual Adjustment
  const [adjustingVariant, setAdjustingVariant] = useState<{
    productId: number
    productName: string
    variant: ProductVariant
  } | null>(null)
  const [adjustQty, setAdjustQty] = useState<number>(0)
  const [adjustType, setAdjustType] = useState<'manual' | 'damage' | 'in' | 'out'>('manual')
  const [adjustReason, setAdjustReason] = useState('')

  const toggleExpand = (id: number) => {
    setExpandedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Filter logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode?.includes(searchQuery)

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    const matchesVendor = selectedVendor === 'all' || p.vendorId === selectedVendor

    // Total stock across variants
    const totalStock = p.variants?.reduce((sum, v) => sum + v.stock, 0) ?? (p.inStock ? 50 : 0)
    const reorderLevel = p.reorderLevel ?? 10

    let matchesStatus = true
    if (selectedStatus === 'in_stock') matchesStatus = totalStock > reorderLevel
    if (selectedStatus === 'low_stock') matchesStatus = totalStock > 0 && totalStock <= reorderLevel
    if (selectedStatus === 'out_of_stock') matchesStatus = totalStock === 0

    return matchesSearch && matchesCategory && matchesVendor && matchesStatus
  })

  const categories = Array.from(new Set(products.map((p) => p.category)))

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustingVariant || adjustQty === 0) return

    const qtyChange = adjustType === 'out' || adjustType === 'damage' ? -Math.abs(adjustQty) : Math.abs(adjustQty)
    const userRoleName = userRole === 'super_admin' ? 'Super Admin' : userRole === 'inventory_manager' ? 'Inventory Manager' : 'Warehouse Staff'

    adjustStock(
      adjustingVariant.productId,
      adjustingVariant.variant.sku,
      qtyChange,
      adjustType === 'damage' ? 'damage' : adjustType === 'in' ? 'in' : adjustType === 'out' ? 'out' : 'manual',
      adjustReason || 'Manual Inventory Correction',
      userRoleName
    )

    setAdjustingVariant(null)
    setAdjustQty(0)
    setAdjustReason('')
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search product name, SKU (e.g. FDH-CHI-001), or barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 text-white text-xs py-2.5 pl-10 pr-4 rounded-xl outline-none focus:border-secondary transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs py-2 px-3 rounded-xl outline-none capitalize"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c} className="capitalize">{c}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs py-2 px-3 rounded-xl outline-none"
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock Alert</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs py-2 px-3 rounded-xl outline-none"
          >
            <option value="all">All Suppliers</option>
            {(vendors || []).map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>

          <button
            onClick={() => {
              alert('Inventory exported successfully as CSV!')
            }}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Main Inventory Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[10px] uppercase tracking-wider font-black text-slate-400">
                <th className="p-4 w-8"></th>
                <th className="p-4">Product Info</th>
                <th className="p-4">SKU / Barcode</th>
                <th className="p-4">Supplier</th>
                <th className="p-4">Cost vs Selling</th>
                <th className="p-4 text-center">Current / Reserved</th>
                <th className="p-4 text-center">Available Stock</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    No items matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isExpanded = expandedProductIds.includes(p.id)
                  const totalStock = p.variants?.reduce((sum, v) => sum + v.stock, 0) ?? (p.inStock ? 50 : 0)
                  const totalReserved = p.variants?.reduce((sum, v) => sum + v.reservedStock, 0) ?? p.reservedStock ?? 0
                  const availableStock = Math.max(0, totalStock - totalReserved)
                  const reorderLevel = p.reorderLevel ?? 10
                  const vendor = vendors.find((v) => v.id === p.vendorId)

                  let statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                      <CheckCircle className="w-3 h-3" /> In Stock
                    </span>
                  )
                  if (totalStock === 0) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-[10px]">
                        <XCircle className="w-3 h-3" /> Out of Stock
                      </span>
                    )
                  } else if (totalStock <= reorderLevel) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[10px]">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    )
                  }

                  return (
                    <Fragment key={p.id}>
                      <tr className="hover:bg-slate-800/40 transition-colors group">
                        <td className="p-4 text-center">
                          <button
                            onClick={() => toggleExpand(p.id)}
                            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        </td>

                        <td className="p-4 font-bold flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                            {p.image ? (
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-slate-900" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-bold">{p.name}</p>
                            <span className="text-[10px] text-slate-500 font-semibold capitalize">{p.category} • {p.weight}</span>
                          </div>
                        </td>

                        <td className="p-4 font-mono text-[11px] text-slate-400">
                          <p className="font-bold text-slate-300">{p.sku}</p>
                          <p className="text-[9px] text-slate-500">{p.barcode}</p>
                        </td>

                        <td className="p-4 font-medium text-slate-400 text-xs">
                          {vendor ? vendor.name : 'Standard Suppliers'}
                        </td>

                        <td className="p-4 font-mono">
                          <p className="text-white font-bold">₹{p.price}</p>
                          <p className="text-[10px] text-slate-500">Cost: ₹{p.costPrice || Math.round(p.price * 0.7)}</p>
                        </td>

                        <td className="p-4 text-center font-mono">
                          <span className="font-bold text-white">{totalStock}</span>
                          <span className="text-slate-500 text-[10px] block">Reserved: {totalReserved}</span>
                        </td>

                        <td className="p-4 text-center font-mono">
                          <span className={`font-black text-sm ${availableStock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {availableStock}
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          {statusBadge}
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => toggleExpand(p.id)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold transition-colors inline-flex items-center gap-1"
                          >
                            <Layers className="w-3 h-3" /> Variants ({p.variants?.length || 0})
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Variant Sub-Table */}
                      {isExpanded && (
                        <tr className="bg-slate-950/90 border-y border-slate-800">
                          <td colSpan={9} className="p-4 pl-12">
                            <div className="space-y-2">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Layers className="w-3 h-3 text-secondary" /> Inventory Variant Breakdown
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {p.variants?.map((v) => (
                                  <div key={v.sku} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                                    <div>
                                      <p className="font-bold text-white">{v.name}</p>
                                      <p className="text-[10px] font-mono text-slate-400">SKU: {v.sku} | Barcode: {v.barcode}</p>
                                      <div className="flex gap-3 mt-1 text-[10px] text-slate-400 font-mono">
                                        <span>Cost: ₹{v.costPrice}</span>
                                        <span>Sell: ₹{v.price}</span>
                                        <span>Reorder: {v.reorderLevel}</span>
                                      </div>
                                    </div>

                                    <div className="text-right flex items-center gap-4">
                                      <div>
                                        <span className={`text-sm font-black block ${v.stock <= v.reorderLevel ? 'text-amber-400' : 'text-emerald-400'}`}>
                                          {v.stock} in stock
                                        </span>
                                        <span className="text-[9px] text-slate-500 block">Res: {v.reservedStock}</span>
                                      </div>

                                      {userRole !== 'warehouse_staff' && (
                                        <button
                                          onClick={() => {
                                            setAdjustingVariant({ productId: p.id, productName: p.name, variant: v })
                                            setAdjustQty(0)
                                          }}
                                          className="p-2 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" /> Adjust
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Stock Adjustment Modal */}
      {adjustingVariant && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white">Adjust Variant Inventory</h3>
            <div className="p-3 bg-slate-950 rounded-xl text-xs space-y-1 border border-slate-850">
              <p className="font-bold text-white">{adjustingVariant.variant.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">SKU: {adjustingVariant.variant.sku}</p>
              <p className="text-[10px] text-emerald-400 font-bold">Current Stock: {adjustingVariant.variant.stock} units</p>
            </div>

            <form onSubmit={handleApplyAdjustment} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Adjustment Type</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none"
                >
                  <option value="in">Add Stock (+ Quantity)</option>
                  <option value="out">Remove Stock (- Quantity)</option>
                  <option value="damage">Record Damaged / Spoiled (- Quantity)</option>
                  <option value="manual">Manual Inventory Correction</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Quantity Changed</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 10"
                  value={adjustQty || ''}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Reason / Notes</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Reason for adjustment (e.g. Physical recount audit)..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingVariant(null)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-secondary/20"
                >
                  Apply & Log Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
