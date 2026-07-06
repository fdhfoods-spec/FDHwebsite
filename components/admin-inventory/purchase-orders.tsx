'use client'

import { useState } from 'react'
import { useStore, type PurchaseOrder, type PurchaseOrderItem } from '@/lib/store'
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  CheckCircle,
  Truck,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  PackageCheck,
  AlertOctagon,
  Calendar
} from 'lucide-react'
import type { UserRole } from './index'

interface PurchaseOrderManagerProps {
  userRole: UserRole
}

export function PurchaseOrderManager({ userRole }: PurchaseOrderManagerProps) {
  const { purchaseOrders: rawPOs = [], vendors: rawVendors = [], products: rawProducts = [], createPurchaseOrder, updatePurchaseOrderStatus, receivePurchaseOrder } = useStore()
  const purchaseOrders = rawPOs || []
  const vendors = rawVendors || []
  const products = rawProducts || []

  // PO Creation Drawer/Form state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0]?.id || '')
  const [expectedDate, setExpectedDate] = useState('')
  const [poNotes, setPoNotes] = useState('')
  
  // Cart for items to buy
  const [poItems, setPoItems] = useState<Omit<PurchaseOrderItem, 'totalCost'>[]>([])
  const [currentProductId, setCurrentProductId] = useState<number>(products[0]?.id || 1)
  const currentProduct = products.find(p => p.id === currentProductId)
  const [currentVariantSku, setCurrentVariantSku] = useState<string>(currentProduct?.variants?.[0]?.sku || '')
  const [itemQty, setItemQty] = useState<number>(50)
  const [itemCost, setItemCost] = useState<number>(currentProduct?.costPrice || 0)

  // Goods Receiving Sheet State
  const [receivingPo, setReceivingPo] = useState<PurchaseOrder | null>(null)
  const [receivingItems, setReceivingItems] = useState<Record<string, { received: number; damaged: number; notes: string }>>({})

  const handleAddPoItem = () => {
    if (!currentProduct || !currentVariantSku || itemQty <= 0) return
    
    // Check if variant already in items list
    const existingIdx = poItems.findIndex(i => i.variantSku === currentVariantSku)
    if (existingIdx > -1) {
      const updated = [...poItems]
      updated[existingIdx].quantity += itemQty
      setPoItems(updated)
    } else {
      const v = currentProduct.variants?.find(v => v.sku === currentVariantSku)
      setPoItems([
        ...poItems,
        {
          productId: currentProductId,
          variantSku: currentVariantSku,
          name: `${currentProduct.name} (${v?.weight || '500g'})`,
          quantity: itemQty,
          unitCost: itemCost || v?.costPrice || 0
        }
      ])
    }
  }

  const handleRemovePoItem = (sku: string) => {
    setPoItems(poItems.filter(i => i.variantSku !== sku))
  }

  const handleCreatePoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (poItems.length === 0 || !selectedVendorId) return

    const vendor = vendors.find(v => v.id === selectedVendorId)
    if (!vendor) return

    createPurchaseOrder({
      vendorId: selectedVendorId,
      vendorName: vendor.name,
      items: poItems.map(item => ({
        ...item,
        totalCost: item.quantity * item.unitCost
      })),
      expectedDeliveryDate: expectedDate || new Date(Date.now() + 3600000 * 24 * 3).toISOString().split('T')[0],
      status: 'draft',
      notes: poNotes
    })

    // Reset fields
    setIsCreateOpen(false)
    setPoItems([])
    setPoNotes('')
  }

  const handleStartReceiving = (po: PurchaseOrder) => {
    setReceivingPo(po)
    // Initialize receiving checklist
    const initialRecord: Record<string, { received: number; damaged: number; notes: string }> = {}
    po.items.forEach(item => {
      initialRecord[item.variantSku] = {
        received: item.quantity,
        damaged: 0,
        notes: ''
      }
    })
    setReceivingItems(initialRecord)
  }

  const handleSaveIntake = (e: React.FormEvent) => {
    e.preventDefault()
    if (!receivingPo) return

    const userRoleName = userRole === 'super_admin' ? 'Super Admin' : userRole === 'inventory_manager' ? 'Inventory Manager' : 'Warehouse Staff'

    // Format for receive action
    const itemsList = Object.entries(receivingItems).map(([sku, info]) => ({
      variantSku: sku,
      receivedQty: info.received,
      damagedQty: info.damaged,
      notes: info.notes
    }))

    receivePurchaseOrder(receivingPo.id, itemsList, userRoleName)
    setReceivingPo(null)
    alert(`Inventory intake completed for ${receivingPo.id}. Stock numbers updated successfully!`)
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Action Controls */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center shadow-xl">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Purchase Flow & Logistics</h3>
          <p className="text-xs text-slate-400">Order from suppliers, track inbound shipments, and process warehouse intakes.</p>
        </div>

        {userRole !== 'warehouse_staff' && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 bg-secondary hover:bg-secondary/90 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-secondary/20"
          >
            <Plus className="w-4 h-4" /> Create Purchase Order
          </button>
        )}
      </div>

      {/* PO List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] uppercase tracking-wider font-black text-slate-400">
                <th className="p-4">PO Number</th>
                <th className="p-4">Supplier</th>
                <th className="p-4">Order / Delivery Date</th>
                <th className="p-4">Items Count</th>
                <th className="p-4 text-center">Total Cost</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No purchase orders generated.
                  </td>
                </tr>
              ) : (
                purchaseOrders.map((po) => {
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      <Clock className="w-3 h-3" /> Draft
                    </span>
                  )
                  if (po.status === 'pending') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">
                        <Clock className="w-3 h-3" /> Pending Approval
                      </span>
                    )
                  } else if (po.status === 'approved') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                        <CheckCircle className="w-3 h-3" /> Approved
                      </span>
                    )
                  } else if (po.status === 'shipped') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold animate-pulse">
                        <Truck className="w-3 h-3" /> In Transit
                      </span>
                    )
                  } else if (po.status === 'delivered') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        <CheckCircle className="w-3 h-3" /> Received (Intake)
                      </span>
                    )
                  } else if (po.status === 'cancelled') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 font-bold">
                        <XCircle className="w-3 h-3" /> Cancelled
                      </span>
                    )
                  }

                  return (
                    <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-white">{po.id}</td>
                      <td className="p-4 font-semibold text-slate-300">{po.vendorName}</td>
                      <td className="p-4 text-slate-400">
                        <p>Ordered: {new Date(po.orderDate).toLocaleDateString()}</p>
                        <p className="text-[10px] text-slate-500">Exp: {new Date(po.expectedDeliveryDate).toLocaleDateString()}</p>
                      </td>
                      <td className="p-4 text-slate-400 font-bold">{po.items.length} SKUs</td>
                      <td className="p-4 text-center font-mono font-bold text-white">₹{po.totalCost.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-center">{statusBadge}</td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        {po.status === 'draft' && userRole === 'super_admin' && (
                          <button
                            onClick={() => updatePurchaseOrderStatus(po.id, 'pending')}
                            className="px-2.5 py-1.5 bg-secondary text-white font-bold rounded-lg text-[10px] hover:opacity-90"
                          >
                            Submit
                          </button>
                        )}
                        {po.status === 'pending' && userRole === 'super_admin' && (
                          <button
                            onClick={() => updatePurchaseOrderStatus(po.id, 'approved')}
                            className="px-2.5 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-[10px] hover:opacity-90"
                          >
                            Approve
                          </button>
                        )}
                        {po.status === 'approved' && userRole !== 'warehouse_staff' && (
                          <button
                            onClick={() => updatePurchaseOrderStatus(po.id, 'shipped')}
                            className="px-2.5 py-1.5 bg-indigo-600 text-white font-bold rounded-lg text-[10px] hover:opacity-90"
                          >
                            Ship Out
                          </button>
                        )}
                        {po.status === 'shipped' && (
                          <button
                            onClick={() => handleStartReceiving(po)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] inline-flex items-center gap-1 transition-all"
                          >
                            <PackageCheck className="w-3.5 h-3.5" /> Receive Intake
                          </button>
                        )}
                        {(po.status === 'draft' || po.status === 'pending') && (
                          <button
                            onClick={() => updatePurchaseOrderStatus(po.id, 'cancelled')}
                            className="px-2 py-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-[10px]"
                          >
                            Cancel
                          </button>
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

      {/* PO Creation Drawer Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-secondary" /> Draft Purchase Order Creator
            </h3>

            <form onSubmit={handleCreatePoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Vendor / Supplier</label>
                  <select
                    value={selectedVendorId}
                    onChange={(e) => setSelectedVendorId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Selector to add items */}
              <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Add Products to Purchase Order</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  <div className="sm:col-span-2">
                    <label className="text-[9px] text-slate-500 uppercase block mb-1">Product Variant</label>
                    <select
                      value={currentProductId}
                      onChange={(e) => {
                        const pId = Number(e.target.value)
                        setCurrentProductId(pId)
                        const p = products.find(prod => prod.id === pId)
                        if (p?.variants?.[0]) {
                          setCurrentVariantSku(p.variants[0].sku)
                          setItemCost(p.costPrice || 0)
                        }
                      }}
                      className="w-full bg-slate-900 border border-slate-800 text-white text-[11px] p-2 rounded-lg outline-none"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>

                    <select
                      value={currentVariantSku}
                      onChange={(e) => {
                        setCurrentVariantSku(e.target.value)
                        const v = currentProduct?.variants?.find(vr => vr.sku === e.target.value)
                        if (v) setItemCost(v.costPrice)
                      }}
                      className="w-full bg-slate-900 border border-slate-800 text-white text-[11px] p-2 rounded-lg outline-none mt-2 font-mono"
                    >
                      {currentProduct?.variants?.map(v => (
                        <option key={v.sku} value={v.sku}>{v.name} ({v.sku})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={itemQty}
                      onChange={(e) => setItemQty(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 text-white text-[11px] p-2 rounded-lg outline-none font-bold"
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleAddPoItem}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold rounded-lg transition-all"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>
              </div>

              {/* Items Cart Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Purchase Items Checklist</h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden max-h-[160px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <tr className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase text-slate-500 font-bold">
                      <th className="p-2">Item</th>
                      <th className="p-2">Variant SKU</th>
                      <th className="p-2 text-center">Unit Cost</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-center">Total</th>
                      <th className="p-2 w-8"></th>
                    </tr>
                    {poItems.map((item) => (
                      <tr key={item.variantSku} className="hover:bg-slate-800/40">
                        <td className="p-2 text-white font-bold">{item.name}</td>
                        <td className="p-2 text-slate-400 font-mono text-[10px]">{item.variantSku}</td>
                        <td className="p-2 text-center font-mono">₹{item.unitCost}</td>
                        <td className="p-2 text-center font-bold text-white">{item.quantity}</td>
                        <td className="p-2 text-center font-mono font-bold text-secondary">₹{item.quantity * item.unitCost}</td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemovePoItem(item.variantSku)}
                            className="text-red-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Purchase Order Notes</label>
                <textarea
                  rows={2}
                  placeholder="Payment details, shipping requirements, delivery instructions..."
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none"
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
                  disabled={poItems.length === 0}
                  className="flex-1 py-3 bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-secondary/20"
                >
                  Save Draft PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goods Receiving Sheet Modal */}
      {receivingPo && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-3xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest block">{receivingPo.id}</span>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-emerald-400" /> Goods Receiving Checklist Note
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Physically recount packages and record damaged items before approval.</p>
            </div>

            <form onSubmit={handleSaveIntake} className="space-y-4">
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase text-slate-400 font-bold">
                      <th className="p-3">Product Item</th>
                      <th className="p-3 text-center">Ordered Qty</th>
                      <th className="p-3 text-center">Received Qty</th>
                      <th className="p-3 text-center">Damaged Units</th>
                      <th className="p-3">Rec. Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {receivingPo.items.map((item) => {
                      const info = receivingItems[item.variantSku] || { received: item.quantity, damaged: 0, notes: '' }
                      return (
                        <tr key={item.variantSku} className="hover:bg-slate-800/40">
                          <td className="p-3">
                            <p className="font-bold text-white">{item.name}</p>
                            <p className="text-[9px] text-slate-500 font-mono">{item.variantSku}</p>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-400">{item.quantity}</td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min="0"
                              max={item.quantity * 2}
                              value={info.received}
                              onChange={(e) => setReceivingItems({
                                ...receivingItems,
                                [item.variantSku]: { ...info, received: Number(e.target.value) }
                              })}
                              className="w-16 bg-slate-950 border border-slate-800 text-white text-center p-1 rounded font-bold"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min="0"
                              value={info.damaged}
                              onChange={(e) => setReceivingItems({
                                ...receivingItems,
                                [item.variantSku]: { ...info, damaged: Number(e.target.value) }
                              })}
                              className="w-16 bg-slate-950 border border-slate-800 text-red-400 text-center p-1 rounded font-bold"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              placeholder="e.g. Good condition"
                              value={info.notes}
                              onChange={(e) => setReceivingItems({
                                ...receivingItems,
                                [item.variantSku]: { ...info, notes: e.target.value }
                              })}
                              className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-1 rounded"
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReceivingPo(null)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
                >
                  Confirm Intake & Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
