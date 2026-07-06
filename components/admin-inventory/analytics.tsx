'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import {
  BarChart3,
  TrendingUp,
  Boxes,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  Info,
  Calendar
} from 'lucide-react'
import type { UserRole } from './index'

interface InventoryAnalyticsViewProps {
  userRole: UserRole
}

export function InventoryAnalyticsView({ userRole }: InventoryAnalyticsViewProps) {
  const { products: rawProducts = [], orders: rawOrders = [] } = useStore()
  const products = rawProducts || []
  const orders = rawOrders || []
  const [activeMetric, setActiveMetric] = useState<'sales' | 'value'>('sales')

  // Calculate top items based on order velocity
  const salesMap: Record<number, number> = {}
  orders.forEach((o) => {
    o.items.forEach((item) => {
      salesMap[item.id] = (salesMap[item.id] || 0) + item.qty
    })
  })

  // Fast moving products
  const fastMoving = products
    .map((p) => ({
      ...p,
      salesCount: salesMap[p.id] || 0
    }))
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5)

  // Slow moving / Dead stock products
  const slowMoving = products
    .map((p) => ({
      ...p,
      salesCount: salesMap[p.id] || 0,
      stock: p.variants?.reduce((sum, v) => sum + v.stock, 0) || 0
    }))
    .filter((p) => p.stock > 10)
    .sort((a, b) => a.salesCount - b.salesCount)
    .slice(0, 5)

  // SVG Chart Mock Data - Monthly Trends
  const trendData = [
    { month: 'Jan', value: 120000, sales: 85000 },
    { month: 'Feb', value: 145000, sales: 98000 },
    { month: 'Mar', value: 130000, sales: 110000 },
    { month: 'Apr', value: 165000, sales: 125000 },
    { month: 'May', value: 180000, sales: 140000 },
    { month: 'Jun', value: 195000, sales: 155000 }
  ]

  // Calculate layout points for SVG area line chart
  const width = 500
  const height = 180
  const maxVal = 220000
  const points = trendData
    .map((d, i) => {
      const x = (i / (trendData.length - 1)) * (width - 40) + 20
      const y = height - (d.value / maxVal) * (height - 30) - 10
      return `${x},${y}`
    })
    .join(' ')

  const fillPoints = `${trendData
    .map((d, i) => {
      const x = (i / (trendData.length - 1)) * (width - 40) + 20
      const y = height - (d.value / maxVal) * (height - 30) - 10
      return `${x},${y}`
    })
    .join(' ')} ${width - 20},${height} 20,${height}`

  // Category counts for Donut Chart
  const categoriesMap: Record<string, number> = {}
  products.forEach((p) => {
    const totalStock = p.variants?.reduce((sum, v) => sum + v.stock, 0) || 0
    categoriesMap[p.category] = (categoriesMap[p.category] || 0) + totalStock
  })

  const categoryBreakdown = Object.entries(categoriesMap).map(([name, value]) => ({ name, value }))
  const totalStockSum = categoryBreakdown.reduce((sum, c) => sum + c.value, 0)

  // Donut chart calculations
  let accumulatedPercent = 0
  const colors = ['#10B981', '#3B82F6', '#EC4899', '#F59E0B', '#8B5CF6']

  return (
    <div className="space-y-6 font-sans">
      {/* Analytics Cards Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Turnover Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">4.8x</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12% vs last quarter
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Days Sales of Inv. (DSI)</span>
            <Boxes className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">18.5 days</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-1">
            <ArrowDownRight className="w-3.5 h-3.5" /> -1.2 days speedup
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Stockout Frequency</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-black text-white">1.2%</p>
          <div className="flex items-center gap-1 text-[10px] text-red-400 font-bold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +0.3% due to high demand
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider">Dead Stock Value</span>
            <Boxes className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-black text-slate-400">₹8,400</p>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold mt-1">
            <Info className="w-3 h-3" /> Under 2% of total value
          </div>
        </div>
      </div>

      {/* SVG Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inventory Valuation Trends</h3>
              <p className="text-xs text-slate-500">6-Month historical overview of stock asset valuation.</p>
            </div>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveMetric('value')}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${activeMetric === 'value' ? 'bg-secondary text-white' : 'text-slate-500'}`}
              >
                Value
              </button>
              <button
                onClick={() => setActiveMetric('sales')}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${activeMetric === 'sales' ? 'bg-secondary text-white' : 'text-slate-500'}`}
              >
                Sales
              </button>
            </div>
          </div>

          <div className="relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line x1="20" y1="40" x2="480" y2="40" stroke="#1E293B" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="20" y1="90" x2="480" y2="90" stroke="#1E293B" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="20" y1="140" x2="480" y2="140" stroke="#1E293B" strokeWidth="1" strokeDasharray="3,3" />

              {/* Shaded Area */}
              <polygon points={fillPoints} fill="url(#chartGradient)" />

              {/* Line */}
              <polyline points={points} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

              {/* Points */}
              {trendData.map((d, i) => {
                const x = (i / (trendData.length - 1)) * (width - 40) + 20
                const y = height - (d.value / maxVal) * (height - 30) - 10
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#10B981"
                    stroke="#0F172A"
                    strokeWidth="2"
                    className="hover:scale-150 transition-transform cursor-pointer"
                  />
                )
              })}

              {/* Axis Labels */}
              {trendData.map((d, i) => {
                const x = (i / (trendData.length - 1)) * (width - 40) + 20
                return (
                  <text
                    key={i}
                    x={x}
                    y={height - 2}
                    fill="#64748B"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {d.month}
                  </text>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Donut Chart Category Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stock Category Split</h3>
            <p className="text-xs text-slate-500">Distribution of available stock units across categories.</p>
          </div>

          <div className="flex justify-center my-2">
            <svg viewBox="0 0 100 100" className="w-36 h-36">
              {categoryBreakdown.map((item, index) => {
                const percentage = (item.value / totalStockSum) * 100
                const strokeDasharray = `${percentage} ${100 - percentage}`
                const strokeDashoffset = -accumulatedPercent
                accumulatedPercent += percentage
                const color = colors[index % colors.length]

                return (
                  <circle
                    key={item.name}
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="hover:stroke-[12] transition-all cursor-pointer"
                    transform="rotate(-90 50 50)"
                  />
                )
              })}
              <circle cx="50" cy="50" r="28" fill="#0F172A" />
              <text x="50" y="47" fill="#64748B" fontSize="7" textAnchor="middle" fontWeight="black" className="uppercase tracking-widest">
                Total Stock
              </text>
              <text x="50" y="58" fill="#FFFFFF" fontSize="11" textAnchor="middle" fontWeight="black" className="font-mono">
                {totalStockSum}
              </text>
            </svg>
          </div>

          <div className="space-y-1.5">
            {categoryBreakdown.slice(0, 4).map((item, idx) => {
              const color = colors[idx % colors.length]
              const percent = totalStockSum > 0 ? Math.round((item.value / totalStockSum) * 100) : 0
              return (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-slate-300 font-bold capitalize">{item.name}</span>
                  </div>
                  <span className="font-mono text-slate-400">{item.value} units ({percent}%)</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Movement Velocity: Fast vs Slow lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fast Moving */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Fast-Moving Velocity Products</h3>
            <p className="text-xs text-slate-400">Products with highest checkout demand and stock turnover index.</p>
          </div>

          <div className="space-y-3">
            {fastMoving.map((p, idx) => (
              <div key={p.id} className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-emerald-500/10 text-emerald-400 font-black flex items-center justify-center rounded-lg">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{p.category} • {p.weight}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">{p.salesCount} sold</span>
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">High Velocity</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slow Moving / Dead Stock */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Slow-Moving & Dead Stock Alert</h3>
            <p className="text-xs text-slate-400">High remaining stock with low conversion rate over the last 30 days.</p>
          </div>

          <div className="space-y-3">
            {slowMoving.map((p, idx) => (
              <div key={p.id} className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-red-500/10 text-red-400 font-black flex items-center justify-center rounded-lg">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{p.category} • {p.weight}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-red-400 font-bold block">{p.stock} units left</span>
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Dead Stock Risk</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
