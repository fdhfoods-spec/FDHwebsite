'use client'

import { useState } from 'react'
import { useStore, type StockMovement } from '@/lib/store'
import {
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Search,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  Boxes
} from 'lucide-react'
import type { UserRole } from './index'

interface StockOperationsProps {
  userRole: UserRole
}

export function StockOperations({ userRole }: StockOperationsProps) {
  const { stockMovements: rawMovements = [], products: rawProducts = [], adjustStock } = useStore()
  const stockMovements = rawMovements || []
  const products = rawProducts || []

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  // Bulk / Quick Movement state
  const [selectedProductId, setSelectedProductId] = useState<number>(products[0]?.id || 1)
  const selectedProduct = products.find((p) => p.id === selectedProductId)
  const [selectedVariantSku, setSelectedVariantSku] = useState<string>(selectedProduct?.variants?.[0]?.sku || '')
  const [changeQty, setChangeQty] = useState<number>(10)
  const [movementType, setMovementType] = useState<StockMovement['type']>('in')
  const [reason, setReason] = useState('')

  const handleCreateMovement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct || !selectedVariantSku || changeQty === 0) return

    const qtyChange = movementType === 'out' || movementType === 'damage' || movementType === 'fulfillment' ? -Math.abs(changeQty) : Math.abs(changeQty)
    const userRoleName = userRole === 'super_admin' ? 'Super Admin' : userRole === 'inventory_manager' ? 'Inventory Manager' : 'Warehouse Staff'

    adjustStock(
      selectedProduct.id,
      selectedVariantSku,
      qtyChange,
      movementType,
      reason || `Manual ${movementType.toUpperCase()} Operation`,
      userRoleName
    )

    setReason('')
    alert('Stock movement logged and inventory updated!')
  }

  const filteredMovements = stockMovements.filter((m) => {
    const matchesSearch =
      m.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.variantSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.user.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === 'all' || m.type === filterType

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6 font-sans">
      {/* Quick Operation Panel & Movement Form */}
      {userRole !== 'warehouse_staff' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Boxes className="w-4 h-4 text-secondary" /> Direct Stock Movement Entry
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Quickly log warehouse intakes, damages, or stock corrections.</p>
          </div>

          <form onSubmit={handleCreateMovement} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  const pId = Number(e.target.value)
                  setSelectedProductId(pId)
                  const p = products.find((prod) => prod.id === pId)
                  if (p?.variants?.[0]) setSelectedVariantSku(p.variants[0].sku)
                }}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Variant SKU</label>
              <select
                value={selectedVariantSku}
                onChange={(e) => setSelectedVariantSku(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none font-mono"
              >
                {selectedProduct?.variants?.map((v) => (
                  <option key={v.sku} value={v.sku}>{v.name} ({v.sku})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Activity Type</label>
              <select
                value={movementType}
                onChange={(e) => setMovementType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none"
              >
                <option value="in">Stock In (Intake)</option>
                <option value="out">Stock Out (Transfer)</option>
                <option value="receipt">Purchase Receipt</option>
                <option value="damage">Damage / Spoiled</option>
                <option value="manual">Manual Adjustment</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={changeQty}
                onChange={(e) => setChangeQty(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none font-bold"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-secondary/20"
              >
                Log Movement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Historical Movement Audit Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" /> Audit Trail & Stock Movement Log
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Immutable activity history storing user, date, quantity changes, and reference IDs.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter logs by user, reason, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white text-xs py-2 pl-9 pr-3 rounded-xl outline-none"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs py-2 px-3 rounded-xl outline-none"
            >
              <option value="all">All Movement Types</option>
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
              <option value="receipt">PO Receipt</option>
              <option value="fulfillment">Order Fulfillment</option>
              <option value="damage">Damage Adjustments</option>
              <option value="return">Customer Returns</option>
            </select>
          </div>
        </div>

        {/* Audit Log Sheet Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] uppercase tracking-wider font-black text-slate-400">
                <th className="p-3.5">Ref ID</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Product & SKU</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5 text-center">Prev Stock</th>
                <th className="p-3.5 text-center">Qty Changed</th>
                <th className="p-3.5 text-center">New Stock</th>
                <th className="p-3.5">Reason / Reference</th>
                <th className="p-3.5">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500 font-sans">
                    No stock movements logged yet.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((m) => {
                  const isPositive = m.quantityChanged > 0

                  return (
                    <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-slate-400">{m.id}</td>
                      <td className="p-3.5 text-slate-400 text-[11px]">
                        {new Date(m.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="p-3.5 font-sans">
                        <p className="font-bold text-white">{m.productName}</p>
                        <p className="text-[10px] font-mono text-slate-500">{m.variantSku}</p>
                      </td>
                      <td className="p-3.5 font-sans">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          m.type === 'receipt' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          m.type === 'damage' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          m.type === 'fulfillment' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {m.type}
                        </span>
                      </td>
                      <td className="p-3.5 text-center text-slate-400">{m.previousStock}</td>
                      <td className="p-3.5 text-center font-bold">
                        <span className={isPositive ? 'text-emerald-400' : 'text-red-400'}>
                          {isPositive ? `+${m.quantityChanged}` : m.quantityChanged}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-white">{m.newStock}</td>
                      <td className="p-3.5 font-sans text-slate-300">
                        <p className="text-xs">{m.reason}</p>
                        {m.referenceNo && <p className="text-[10px] text-slate-500 font-mono">Ref: {m.referenceNo}</p>}
                      </td>
                      <td className="p-3.5 font-sans text-slate-400 text-xs font-semibold">{m.user}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
