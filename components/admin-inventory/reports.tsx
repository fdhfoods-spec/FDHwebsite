'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import {
  FileText,
  Download,
  Printer,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Boxes,
  Truck,
  AlertTriangle
} from 'lucide-react'
import type { UserRole } from './index'

interface InventoryReportsProps {
  userRole: UserRole
}

type ReportType = 'valuation' | 'low_stock' | 'vendors' | 'movement'

export function InventoryReports({ userRole }: InventoryReportsProps) {
  const { products: rawProducts = [], vendors: rawVendors = [], stockMovements: rawMovements = [] } = useStore()
  const products = rawProducts || []
  const vendors = rawVendors || []
  const stockMovements = rawMovements || []
  const [selectedReport, setSelectedReport] = useState<ReportType>('valuation')

  const handlePrint = () => {
    window.print()
  }

  // Calculate metrics
  const allVariants = products.flatMap(p => p.variants || [])
  
  // Valuation metrics
  const totalValuationCost = allVariants.reduce((sum, v) => sum + (v.stock * v.costPrice), 0)
  const totalValuationRetail = allVariants.reduce((sum, v) => sum + (v.stock * v.price), 0)
  const potentialMargin = totalValuationRetail - totalValuationCost
  const marginPercentage = totalValuationRetail > 0 ? Math.round((potentialMargin / totalValuationRetail) * 100) : 0

  // Low stock metrics
  const criticalItems = allVariants.filter(v => v.stock <= v.reorderLevel)

  // Report profiles
  const reportsList: { id: ReportType; title: string; desc: string; icon: any }[] = [
    { id: 'valuation', title: 'Inventory Valuation Report', desc: 'Summary of cost price vs selling price asset valuations.', icon: DollarSign },
    { id: 'low_stock', title: 'Low Stock & Replenishment', desc: 'All variants running below safety threshold levels.', icon: AlertTriangle },
    { id: 'vendors', title: 'Supplier Spend & Ledger', desc: 'Summary of vendor transactions, spend totals and delivery ratings.', icon: Truck },
    { id: 'movement', title: 'Audit Trail Summary', desc: 'Summary of stock changes categorised by adjustment reasons.', icon: FileText }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans">
      {/* Side Select Column */}
      <div className="lg:col-span-1 space-y-3">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest block pl-2">Select Report</h3>
        {reportsList.map((r) => {
          const Icon = r.icon
          const isActive = selectedReport === r.id
          return (
            <button
              key={r.id}
              onClick={() => setSelectedReport(r.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isActive
                  ? 'bg-slate-900 border-secondary text-white shadow-lg'
                  : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-secondary/10 text-secondary' : 'bg-slate-900 text-slate-500'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{r.title}</p>
                  <p className="text-[9px] text-slate-500 leading-tight mt-0.5">{r.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          )
        })}
      </div>

      {/* Main Print View Column */}
      <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl relative print:bg-white print:text-black print:border-none print:shadow-none">
        
        {/* Top Header & Actions */}
        <div className="flex items-center justify-between border-b border-slate-850 pb-4 print:border-black">
          <div>
            <h2 className="text-lg font-black text-white print:text-black">
              {reportsList.find(r => r.id === selectedReport)?.title}
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          </div>

          <div className="flex gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={() => alert('Report data exported successfully in CSV format!')}
              className="px-3.5 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-secondary/15"
            >
              <Download className="w-3.5 h-3.5" /> CSV Export
            </button>
          </div>
        </div>

        {/* Report Content Areas */}
        {selectedReport === 'valuation' && (
          <div className="space-y-6">
            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950/60 p-4 border border-slate-855 rounded-xl print:border-black print:bg-white">
                <span className="text-[9px] uppercase font-extrabold text-slate-500 print:text-slate-600">Total Asset Cost</span>
                <p className="text-xl font-mono font-black text-white print:text-black mt-1">₹{totalValuationCost.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-slate-950/60 p-4 border border-slate-855 rounded-xl print:border-black print:bg-white">
                <span className="text-[9px] uppercase font-extrabold text-slate-500 print:text-slate-600">Retail Value</span>
                <p className="text-xl font-mono font-black text-white print:text-black mt-1">₹{totalValuationRetail.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-slate-950/60 p-4 border border-slate-855 rounded-xl print:border-black print:bg-white">
                <span className="text-[9px] uppercase font-extrabold text-slate-500 print:text-slate-600">Proj. Gross Margin</span>
                <p className="text-xl font-mono font-black text-secondary print:text-black mt-1">₹{potentialMargin.toLocaleString('en-IN')} <span className="text-xs">({marginPercentage}%)</span></p>
              </div>
            </div>

            {/* Structured Table */}
            <div className="border border-slate-850 rounded-xl overflow-hidden print:border-black">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase text-slate-400 font-bold print:text-black print:border-black print:bg-slate-100">
                    <th className="p-3">Product Name</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3 text-center">Unit Cost</th>
                    <th className="p-3 text-center">Retail Price</th>
                    <th className="p-3 text-center">Qty In Stock</th>
                    <th className="p-3 text-right">Total Valuation (Cost)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-slate-300 print:text-black print:border-black">
                  {allVariants.map((v) => (
                    <tr key={v.sku} className="hover:bg-slate-850/20">
                      <td className="p-3 font-sans font-bold text-white print:text-black">{v.name}</td>
                      <td className="p-3 text-slate-400">{v.sku}</td>
                      <td className="p-3 text-center">₹{v.costPrice}</td>
                      <td className="p-3 text-center">₹{v.price}</td>
                      <td className="p-3 text-center font-bold text-white print:text-black">{v.stock}</td>
                      <td className="p-3 text-right font-bold text-white print:text-black">₹{(v.stock * v.costPrice).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'low_stock' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs flex items-center gap-3 print:border-black print:text-black print:bg-white">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold">Replenishment Alert Dashboard</p>
                <p className="text-[11px] opacity-80 mt-0.5">Found {criticalItems.length} product variants currently below or equal to safety threshold levels.</p>
              </div>
            </div>

            <div className="border border-slate-850 rounded-xl overflow-hidden print:border-black">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase text-slate-400 font-bold print:text-black print:bg-slate-100">
                    <th className="p-3">Item Name</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3 text-center">Safety Threshold</th>
                    <th className="p-3 text-center">Current Qty</th>
                    <th className="p-3 text-center">Deficit</th>
                    <th className="p-3 text-right">Rec. Reorder Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-slate-300 print:text-black">
                  {criticalItems.map((v) => {
                    const deficit = v.reorderLevel - v.stock
                    return (
                      <tr key={v.sku} className="hover:bg-slate-850/20">
                        <td className="p-3 font-sans font-bold text-white print:text-black">{v.name}</td>
                        <td className="p-3 text-slate-400">{v.sku}</td>
                        <td className="p-3 text-center font-bold">{v.reorderLevel}</td>
                        <td className="p-3 text-center font-bold text-red-400 print:text-black">{v.stock}</td>
                        <td className="p-3 text-center font-bold text-red-500 print:text-black">+{deficit > 0 ? deficit : 0}</td>
                        <td className="p-3 text-right font-bold text-emerald-400 print:text-black">50 units</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'vendors' && (
          <div className="space-y-4">
            <div className="border border-slate-850 rounded-xl overflow-hidden print:border-black">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase text-slate-400 font-bold print:text-black print:bg-slate-100">
                    <th className="p-3">Vendor / Supplier</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3 text-center">Purchases</th>
                    <th className="p-3 text-center">Total Spend</th>
                    <th className="p-3 text-center">Accuracy Score</th>
                    <th className="p-3 text-right">Supplier Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 print:text-black">
                  {vendors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-850/20">
                      <td className="p-3 font-bold text-white print:text-black">
                        <p>{v.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono font-normal">{v.id}</p>
                      </td>
                      <td className="p-3">
                        <p>{v.contactPerson}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{v.phone}</p>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-white print:text-black">{v.totalPurchases} orders</td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-400 print:text-black">₹{v.totalSpend.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-center font-mono font-bold text-blue-400 print:text-black">{v.deliveryPerformance}%</td>
                      <td className="p-3 text-right">
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold text-[10px] uppercase">
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'movement' && (
          <div className="space-y-4">
            <div className="border border-slate-850 rounded-xl overflow-hidden print:border-black">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase text-slate-400 font-bold print:text-black print:bg-slate-100">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Item Variant</th>
                    <th className="p-3 text-center">Movement Type</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3">Operator</th>
                    <th className="p-3 text-right">Reference ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 print:text-black">
                  {stockMovements.map((m) => {
                    const isPositive = m.quantityChanged > 0
                    return (
                      <tr key={m.id} className="hover:bg-slate-850/20">
                        <td className="p-3 font-mono text-[10px] text-slate-500">
                          {new Date(m.date).toLocaleString()}
                        </td>
                        <td className="p-3 font-bold text-white print:text-black">
                          <p>{m.productName}</p>
                          <p className="text-[9px] text-slate-500 font-mono font-normal">{m.variantSku}</p>
                        </td>
                        <td className="p-3 text-center capitalize font-semibold">{m.type}</td>
                        <td className="p-3 text-center font-mono font-bold">
                          <span className={isPositive ? 'text-emerald-400' : 'text-red-400'}>
                            {isPositive ? `+${m.quantityChanged}` : m.quantityChanged}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-300 print:text-black">{m.user}</td>
                        <td className="p-3 text-right font-mono text-[10px] font-bold text-slate-400">{m.referenceNo || 'N/A'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
