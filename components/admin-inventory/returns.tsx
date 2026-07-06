'use client'

import { useState } from 'react'
import { useStore, type InventoryReturn } from '@/lib/store'
import {
  RotateCcw,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  AlertTriangle,
  FileText
} from 'lucide-react'
import type { UserRole } from './index'

interface ReturnsManagerProps {
  userRole: UserRole
}

export function ReturnsManager({ userRole }: ReturnsManagerProps) {
  const { returns: rawReturns = [], products: rawProducts = [], orders: rawOrders = [], vendors: rawVendors = [], createReturn, updateReturnStatus } = useStore()
  const returns = rawReturns || []
  const products = rawProducts || []
  const orders = rawOrders || []
  const vendors = rawVendors || []

  // New return modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [returnType, setReturnType] = useState<'customer' | 'vendor'>('customer')
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '')
  const [selectedVendorId, setSelectedVendorId] = useState<string>(vendors[0]?.id || '')
  const [selectedProductId, setSelectedProductId] = useState<number>(products[0]?.id || 1)
  const selectedProduct = products.find((p) => p.id === selectedProductId)
  const [selectedVariantSku, setSelectedVariantSku] = useState<string>(selectedProduct?.variants?.[0]?.sku || '')
  const [returnQty, setReturnQty] = useState<number>(1)
  const [returnReason, setReturnReason] = useState('')

  const handleCreateReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct || !selectedVariantSku || returnQty <= 0) return

    createReturn({
      type: returnType,
      orderId: returnType === 'customer' ? selectedOrderId : undefined,
      vendorId: returnType === 'vendor' ? selectedVendorId : undefined,
      productId: selectedProductId,
      variantSku: selectedVariantSku,
      productName: selectedProduct.name,
      quantity: returnQty,
      reason: returnReason || 'Quality check return',
      status: 'pending'
    })

    setIsCreateOpen(false)
    setReturnReason('')
  }

  const handleApproveAction = (returnId: string, restock: boolean) => {
    const userRoleName = userRole === 'super_admin' ? 'Super Admin' : userRole === 'inventory_manager' ? 'Inventory Manager' : 'Warehouse Staff'
    updateReturnStatus(returnId, 'approved', restock, userRoleName)
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center shadow-xl">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Returns & Reverse Logistics</h3>
          <p className="text-xs text-slate-400">Process customer & vendor returns with automated restocking workflows.</p>
        </div>

        {userRole !== 'warehouse_staff' && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 bg-secondary hover:bg-secondary/90 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-secondary/20"
          >
            <Plus className="w-4 h-4" /> Log New Return
          </button>
        )}
      </div>

      {/* Returns List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] uppercase tracking-wider font-black text-slate-400">
                <th className="p-4">Return ID</th>
                <th className="p-4">Type & Reference</th>
                <th className="p-4">Product / SKU</th>
                <th className="p-4 text-center">Quantity</th>
                <th className="p-4">Reason</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {returns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No returns logged.
                  </td>
                </tr>
              ) : (
                returns.map((ret) => {
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[10px]">
                      <Clock className="w-3 h-3" /> Pending Review
                    </span>
                  )
                  if (ret.status === 'approved') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                        <CheckCircle className="w-3 h-3" /> Approved {ret.restocked && '(Restocked)'}
                      </span>
                    )
                  } else if (ret.status === 'rejected') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-[10px]">
                        <XCircle className="w-3 h-3" /> Rejected
                      </span>
                    )
                  }

                  return (
                    <tr key={ret.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-white">{ret.id}</td>
                      <td className="p-4 capitalize text-slate-300 font-bold">
                        <p>{ret.type} Return</p>
                        <p className="text-[10px] text-slate-500 font-mono">Ref: {ret.orderId || ret.poId || 'N/A'}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-white">{ret.productName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{ret.variantSku}</p>
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-white">{ret.quantity} units</td>
                      <td className="p-4 text-slate-300">{ret.reason}</td>
                      <td className="p-4 text-center">{statusBadge}</td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        {ret.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveAction(ret.id, true)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] transition-all"
                            >
                              Approve & Restock
                            </button>
                            <button
                              onClick={() => handleApproveAction(ret.id, false)}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-[10px]"
                            >
                              Approve (No Restock)
                            </button>
                            <button
                              onClick={() => updateReturnStatus(ret.id, 'rejected', false, userRole)}
                              className="px-2.5 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 font-bold rounded-lg text-[10px]"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Return Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-secondary" /> Log Inventory Return Request
            </h3>

            <form onSubmit={handleCreateReturnSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Return Source</label>
                <select
                  value={returnType}
                  onChange={(e) => setReturnType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none"
                >
                  <option value="customer">Customer Return (Order ID)</option>
                  <option value="vendor">Vendor Return (PO Return)</option>
                </select>
              </div>

              {returnType === 'customer' ? (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Select Customer Order</label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none font-mono"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>{o.id} - {o.customerName}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Select Supplier Vendor</label>
                  <select
                    value={selectedVendorId}
                    onChange={(e) => setSelectedVendorId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Product & Variant</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    const pId = Number(e.target.value)
                    setSelectedProductId(pId)
                    const p = products.find((prod) => prod.id === pId)
                    if (p?.variants?.[0]) setSelectedVariantSku(p.variants[0].sku)
                  }}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none mb-2"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

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
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Quantity Returned</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={returnQty}
                  onChange={(e) => setReturnQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Reason for Return</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Damaged packaging during transit..."
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-secondary/20"
                >
                  Submit Return Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
