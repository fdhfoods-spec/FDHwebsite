'use client'

import { useStore } from '@/lib/store'
import {
  Boxes,
  Package,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  ArrowRight,
  ShoppingCart,
  ShieldAlert,
  Plus
} from 'lucide-react'
import type { InventoryTab, UserRole } from './index'

interface DashboardProps {
  userRole: UserRole
  onNavigate: (tab: InventoryTab) => void
}

export function InventoryDashboard({ userRole, onNavigate }: DashboardProps) {
  const { products = [], stockMovements = [], purchaseOrders = [] } = useStore()

  const productsList = products || []
  const movementsList = stockMovements || []
  const poList = purchaseOrders || []

  // Compute stats
  const totalProducts = productsList.length
  
  // Flatten all variants across products
  const allVariants = productsList.flatMap((p) => p.variants || [])
  const totalSkus = allVariants.length > 0 ? allVariants.length : totalProducts

  // Total Valuation
  const totalValuation = allVariants.length > 0
    ? allVariants.reduce((sum, v) => sum + (v.stock * v.costPrice), 0)
    : productsList.reduce((sum, p) => sum + (p.price * 0.7 * 50), 0)

  // Stock status counts
  const lowStockItems = allVariants.filter((v) => v.stock > 0 && v.stock <= v.reorderLevel)
  const outOfStockItems = allVariants.filter((v) => v.stock === 0)
  const inStockCount = allVariants.filter((v) => v.stock > v.reorderLevel).length
  const reservedStockTotal = allVariants.reduce((sum, v) => sum + (v.reservedStock || 0), 0)

  // Health score calculation (100 - penalties for out of stock / low stock)
  const healthScore = Math.max(
    0,
    Math.round(100 - (outOfStockItems.length * 5) - (lowStockItems.length * 2))
  )

  // Pending POs count
  const pendingPOsCount = poList.filter((p) => p.status === 'pending' || p.status === 'shipped').length

  return (
    <div className="space-y-6">
      {/* Top Banner & Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Widget */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Inventory Health
              </span>
              <Activity className="w-5 h-5 text-secondary animate-pulse" />
            </div>

            <div className="flex items-baseline gap-3">
              <span className={`text-5xl font-black tracking-tight ${
                healthScore >= 80 ? 'text-emerald-400' : healthScore >= 60 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {healthScore}%
              </span>
              <span className="text-xs text-slate-400 font-semibold">Overall Index</span>
            </div>

            <p className="text-slate-400 text-xs mt-3 leading-relaxed">
              {healthScore >= 80
                ? 'Healthy stock levels across all primary cuts. Supply chain is fully optimized.'
                : 'Attention required! Several high-velocity variants have reached critical reorder limits.'}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              {outOfStockItems.length} SKUs Out of Stock
            </span>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-secondary hover:underline text-xs font-bold flex items-center gap-1"
            >
              Resolve Issues <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Primary Metrics 2x2 Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider">Total SKUs</span>
              <Boxes className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white">{totalSkus}</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">{totalProducts} Base Cuts</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider">Stock Valuation</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">₹{totalValuation.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-emerald-500 font-semibold mt-1">Cost Valuation basis</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider">Low Stock Alerts</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400">{lowStockItems.length}</p>
            <p className="text-[10px] text-amber-500 font-semibold mt-1">Below Reorder Level</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider">Reserved Stock</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-purple-400">{reservedStockTotal} units</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Pending Dispatch</p>
          </div>
        </div>
      </div>

      {/* Action Alerts & Urgent Reorders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low & Out of Stock Urgent Reorder Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Critical Reorder Suggestions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated replenishments recommended for items hitting safety thresholds.</p>
            </div>
            <button
              onClick={() => onNavigate('purchase_orders')}
              className="px-3 py-1.5 bg-secondary/10 border border-secondary/30 text-secondary hover:bg-secondary/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Draft PO
            </button>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
            {lowStockItems.concat(outOfStockItems).length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                No stock alerts! All items have adequate inventory levels.
              </div>
            ) : (
              lowStockItems.concat(outOfStockItems).map((variant, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${variant.stock === 0 ? 'bg-red-500' : 'bg-amber-500'}`} />
                      <p className="text-xs font-bold text-white">{variant.name}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">SKU: {variant.sku} | Reorder Level: {variant.reorderLevel}</p>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className={`text-xs font-black block ${variant.stock === 0 ? 'text-red-400' : 'text-amber-400'}`}>
                        {variant.stock === 0 ? 'OUT OF STOCK' : `${variant.stock} left`}
                      </span>
                      <span className="text-[9px] text-slate-400">Rec. Order: 50 units</span>
                    </div>
                    {userRole !== 'warehouse_staff' && (
                      <button
                        onClick={() => onNavigate('purchase_orders')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold transition-colors"
                      >
                        Order
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Stock Movement Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" /> Live Stock Activity Audit Log
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Recent automated and manual stock adjustments across all warehouses.</p>
            </div>
            <button
              onClick={() => onNavigate('movements')}
              className="text-xs text-slate-400 hover:text-white font-semibold underline"
            >
              View Full Log
            </button>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
            {stockMovements.slice(0, 5).map((move) => (
              <div key={move.id} className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    move.quantityChanged > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {move.quantityChanged > 0 ? `+${move.quantityChanged}` : move.quantityChanged}
                  </div>
                  <div>
                    <p className="font-bold text-white">{move.productName}</p>
                    <p className="text-[10px] text-slate-500">{move.reason} • <span className="text-slate-400">{move.user}</span></p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(move.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
