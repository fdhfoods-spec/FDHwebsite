'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import Image from 'next/image'
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Search,
  Edit3,
  Save,
  RotateCcw,
  Package,
  Tag,
  BarChart3,
  ShieldAlert,
  Filter,
  ChevronUp,
  ChevronDown,
  ImageIcon
} from 'lucide-react'

type StockFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
type SortBy = 'name' | 'price' | 'stock' | 'category'

export function EnterpriseInventory() {
  const { products = [], updateProduct } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<StockFilter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('name')
  const [sortAsc, setSortAsc] = useState(true)
  const [editingStock, setEditingStock] = useState<Record<number, number>>({})
  const [editingId, setEditingId] = useState<number | null>(null)

  // ─── Derived Stats ────────────────────────────────
  const totalProducts = products.length
  const inStockProducts = products.filter(p => p.inStock !== false)
  const outOfStockProducts = products.filter(p => p.inStock === false)
  const lowStockProducts = products.filter(p =>
    p.inStock !== false && (p.reorderLevel !== undefined
      ? (p.reservedStock || 0) <= p.reorderLevel
      : false)
  )
  const totalStockValue = products.reduce((sum, p) => sum + (p.price * (p.reservedStock || 50)), 0)

  // Category breakdown
  const categoryMap: Record<string, number> = {}
  products.forEach(p => {
    const cat = p.category || 'Other'
    categoryMap[cat] = (categoryMap[cat] || 0) + 1
  })
  const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])

  // ─── Filter & Sort ────────────────────────────────
  let filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ? true :
      filter === 'in_stock' ? p.inStock !== false :
      filter === 'out_of_stock' ? p.inStock === false :
      filter === 'low_stock' ? (p.inStock !== false && (p.reorderLevel !== undefined ? (p.reservedStock || 0) <= p.reorderLevel : false)) :
      true
    return matchSearch && matchFilter
  })

  filtered = [...filtered].sort((a, b) => {
    let val = 0
    if (sortBy === 'name') val = a.name.localeCompare(b.name)
    else if (sortBy === 'price') val = a.price - b.price
    else if (sortBy === 'stock') val = (a.reservedStock || 0) - (b.reservedStock || 0)
    else if (sortBy === 'category') val = a.category.localeCompare(b.category)
    return sortAsc ? val : -val
  })

  const handleSortClick = (col: SortBy) => {
    if (sortBy === col) setSortAsc(!sortAsc)
    else { setSortBy(col); setSortAsc(true) }
  }

  const SortIcon = ({ col }: { col: SortBy }) =>
    sortBy === col
      ? sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
      : <ChevronUp className="w-3 h-3 opacity-20" />

  const startEdit = (p: typeof products[0]) => {
    setEditingId(p.id)
    setEditingStock(prev => ({ ...prev, [p.id]: p.reservedStock ?? 50 }))
  }

  const saveEdit = (id: number) => {
    updateProduct(id, { reservedStock: editingStock[id] ?? 0, inStock: (editingStock[id] ?? 0) > 0 })
    setEditingId(null)
  }

  const cancelEdit = (id: number) => {
    setEditingId(null)
    setEditingStock(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  const getStockStatus = (p: typeof products[0]) => {
    if (p.inStock === false) return { label: 'Out of Stock', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.15)', dot: 'bg-red-500' }
    const stock = p.reservedStock ?? 50
    if (stock <= 10) return { label: 'Low Stock', color: '#d97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.15)', dot: 'bg-amber-500' }
    return { label: 'In Stock', color: '#059669', bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.15)', dot: 'bg-emerald-500' }
  }

  return (
    <div className="space-y-5 font-sans">

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Products', value: totalProducts,
            icon: Boxes, iconColor: '#2563eb', iconBg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.12)',
            sub: `${categories.length} categories`
          },
          {
            label: 'In Stock', value: inStockProducts.length,
            icon: CheckCircle2, iconColor: '#059669', iconBg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.12)',
            sub: `${Math.round((inStockProducts.length / Math.max(totalProducts, 1)) * 100)}% availability`
          },
          {
            label: 'Low / Out of Stock', value: outOfStockProducts.length + lowStockProducts.length,
            icon: AlertTriangle, iconColor: '#d97706', iconBg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.12)',
            sub: 'Needs attention'
          },
          {
            label: 'Stock Value', value: `₹${totalStockValue.toLocaleString('en-IN')}`,
            icon: TrendingUp, iconColor: '#7c3aed', iconBg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.12)',
            sub: 'At selling price'
          }
        ].map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="rounded-2xl p-4 transition-all hover:-translate-y-0.5"
              style={{ background: '#ffffff', border: `1px solid ${card.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: card.iconBg }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: card.iconColor }} />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-none mb-1">{card.value}</h3>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{card.label}</p>
              <p className="text-[10px] text-gray-400 mt-1">{card.sub}</p>
            </div>
          )
        })}
      </div>

      {/* ── Two-column: Alerts + Category Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Low Stock Alerts */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: '#ffffff', border: '1px solid #e5e0d5', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid #f0ece4' }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.08)' }}>
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Stock Alerts</h3>
              <p className="text-[10px] text-gray-400">Needs restock</p>
            </div>
          </div>

          {outOfStockProducts.length === 0 && lowStockProducts.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
              <p className="text-xs text-gray-400 font-medium">All products are well stocked!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {outOfStockProducts.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl"
                  style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.1)' }}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-gray-800 truncate">{p.name}</p>
                      <p className="text-[9px] text-gray-400 capitalize">{p.category}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-red-600 flex-shrink-0 ml-2">OUT</span>
                </div>
              ))}
              {lowStockProducts.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl"
                  style={{ background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.1)' }}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-gray-800 truncate">{p.name}</p>
                      <p className="text-[9px] text-gray-400 capitalize">{p.category}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-amber-600 flex-shrink-0 ml-2">{p.reservedStock ?? 0} left</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: '#ffffff', border: '1px solid #e5e0d5', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-2 pb-3 mb-4" style={{ borderBottom: '1px solid #f0ece4' }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.08)' }}>
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Category Breakdown</h3>
              <p className="text-[10px] text-gray-400">Products per category</p>
            </div>
          </div>

          <div className="space-y-3">
            {categories.map(([cat, count], i) => {
              const pct = Math.round((count / Math.max(totalProducts, 1)) * 100)
              const colors = ['#991B1B', '#2563eb', '#059669', '#d97706', '#7c3aed', '#db2777']
              const color = colors[i % colors.length]
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3 h-3" style={{ color }} />
                      <span className="text-xs font-bold text-gray-700 capitalize">{cat}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-gray-800">{count}</span>
                      <span className="text-[10px] text-gray-400">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full w-full" style={{ background: '#f5f0e8' }}>
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }}
                    />
                  </div>
                </div>
              )
            })}
            {categories.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No products added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Stock Table ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e5e0d5', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

        {/* Table Header Toolbar */}
        <div className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between" style={{ borderBottom: '1px solid #f0ece4' }}>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Product Stock Ledger</h3>
            <p className="text-[10px] text-gray-400">{filtered.length} of {totalProducts} products shown</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs rounded-xl outline-none font-medium text-gray-700 w-44"
                style={{ background: '#faf8f3', border: '1px solid #e5e0d5' }}
              />
            </div>
            {/* Filter Chips */}
            <div className="flex gap-1">
              {([
                { id: 'all', label: 'All' },
                { id: 'in_stock', label: '✓ In Stock' },
                { id: 'low_stock', label: '⚠ Low' },
                { id: 'out_of_stock', label: '✕ Out' }
              ] as { id: StockFilter; label: string }[]).map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                  style={filter === f.id
                    ? { background: 'linear-gradient(135deg, #991B1B, #C2410C)', color: '#fff' }
                    : { background: '#faf8f3', border: '1px solid #e5e0d5', color: '#6b7280' }
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] uppercase font-bold text-gray-400 tracking-wider" style={{ borderBottom: '1px solid #f0ece4' }}>
                <th className="px-4 py-3">
                  <button className="flex items-center gap-1" onClick={() => handleSortClick('name')}>
                    Product <SortIcon col="name" />
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button className="flex items-center gap-1" onClick={() => handleSortClick('category')}>
                    Category <SortIcon col="category" />
                  </button>
                </th>
                <th className="px-4 py-3">Weight</th>
                <th className="px-4 py-3">
                  <button className="flex items-center gap-1" onClick={() => handleSortClick('price')}>
                    Price <SortIcon col="price" />
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button className="flex items-center gap-1" onClick={() => handleSortClick('stock')}>
                    Stock Qty <SortIcon col="stock" />
                  </button>
                </th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Edit Stock</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 font-medium">No products match your filter.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const status = getStockStatus(p)
                  const isEditing = editingId === p.id
                  const stockVal = isEditing ? (editingStock[p.id] ?? p.reservedStock ?? 50) : (p.reservedStock ?? 50)

                  return (
                    <tr key={p.id} className="transition-colors hover:bg-gray-50 group" style={{ borderBottom: '1px solid #f5f0e8' }}>
                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ border: '1px solid #e5e0d5' }}>
                            {p.image ? (
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center" style={{ background: '#f5f0e8' }}>
                                <ImageIcon className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 truncate max-w-[160px]">{p.name}</p>
                            {p.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                style={{ background: 'rgba(153,27,27,0.08)', color: '#991B1B', border: '1px solid rgba(153,27,27,0.12)' }}>
                                {p.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className="capitalize text-gray-600 font-semibold">{p.category}</span>
                      </td>

                      {/* Weight */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-gray-600">{p.weight}</span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-black text-gray-800">₹{p.price}</p>
                          {p.originalPrice > p.price && (
                            <p className="text-[9px] text-gray-400 line-through">₹{p.originalPrice}</p>
                          )}
                        </div>
                      </td>

                      {/* Stock Qty — editable */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            value={editingStock[p.id] ?? 0}
                            onChange={e => setEditingStock(prev => ({ ...prev, [p.id]: parseInt(e.target.value) || 0 }))}
                            className="w-20 px-2 py-1 text-xs font-black rounded-lg outline-none text-gray-800"
                            style={{ background: '#faf8f3', border: '1px solid #991B1B' }}
                            autoFocus
                          />
                        ) : (
                          <span className={`font-black ${stockVal === 0 ? 'text-red-600' : stockVal <= 10 ? 'text-amber-600' : 'text-gray-800'}`}>
                            {stockVal} <span className="text-[9px] font-normal text-gray-400">units</span>
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide"
                          style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>

                      {/* Edit / Save Actions */}
                      <td className="px-4 py-3 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => saveEdit(p.id)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white transition-all"
                              style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
                            >
                              <Save className="w-3 h-3" /> Save
                            </button>
                            <button
                              onClick={() => cancelEdit(p.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 transition-all"
                              style={{ background: '#f5f0e8', border: '1px solid #e5e0d5' }}
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(p)}
                            className="flex items-center gap-1 mx-auto px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-500 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-all"
                            style={{ background: '#faf8f3', border: '1px solid #e5e0d5' }}
                          >
                            <Edit3 className="w-3 h-3" /> Edit
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

        {/* Footer summary row */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between text-[10px]" style={{ borderTop: '1px solid #f0ece4' }}>
            <span className="text-gray-400">
              Showing <span className="font-bold text-gray-700">{filtered.length}</span> products
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {inStockProducts.length} In Stock
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {lowStockProducts.length} Low
              </span>
              <span className="flex items-center gap-1.5 text-red-600 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {outOfStockProducts.length} Out
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
