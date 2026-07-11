'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { useStore, type Order } from '@/lib/store'
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Plus,
  Download,
  User,
  Phone,
  MapPin,
  Truck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ChevronRight,
  Edit2,
  FileText,
  DollarSign,
  Layers,
  Activity,
  Bell,
  X,
  ChevronLeft,
  Calendar as CalendarIcon,
  Store,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  History
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Interfaces
interface DeliverySlot {
  id: string
  slotTime: string
  maxCapacity: number
  currentBookings: number
  isActive: boolean
}

interface ActivityEvent {
  id: string
  title: string
  timestamp: string
  performedBy: string
  type: 'creation' | 'vendor' | 'rider' | 'reschedule' | 'status' | 'completion'
}

export function ScheduledOrdersPanel() {
  const { orders: rawOrders = [], addOrder, updateOrderStatus, updateOrderDelivery, deliveryPartners: rawPartners = [], vendors: rawVendors = [], products: rawProducts = [] } = useStore()

  const orders = rawOrders || []
  const deliveryPartners = rawPartners || []
  const vendors = rawVendors || []
  const products = rawProducts || []

  // View Mode: 'list' | 'calendar' | 'slots' | 'audit'
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'slots' | 'audit'>('list')
  const [calendarScope, setCalendarScope] = useState<'month' | 'week' | 'day'>('month')

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [slotFilter, setSlotFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('')
  const [vendorFilter, setVendorFilter] = useState<string>('all')
  const [riderFilter, setRiderFilter] = useState<string>('all')
  const [assignmentFilter, setAssignmentFilter] = useState<string>('all')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Modals state
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null)
  const [reschedulingOrder, setReschedulingOrder] = useState<Order | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleSlot, setRescheduleSlot] = useState('10:00 AM - 01:00 PM')
  const [rescheduleReason, setRescheduleReason] = useState('')

  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null)
  const [assignVendorId, setAssignVendorId] = useState('')
  const [assignRiderId, setAssignRiderId] = useState('')

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newCustName, setNewCustName] = useState('')
  const [newCustPhone, setNewCustPhone] = useState('')
  const [newCustAddress, setNewCustAddress] = useState('')
  const [newProductId, setNewProductId] = useState<number>(products[0]?.id || 1)
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])
  const [newSlot, setNewSlot] = useState('10:00 AM - 01:00 PM')

  // Delivery Slots state
  const [slotsList, setSlotsList] = useState<DeliverySlot[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fdh_delivery_slots')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error(e)
        }
      }
    }
    return [
      { id: 'SLOT-1', slotTime: '07:00 AM - 10:00 AM', maxCapacity: 20, currentBookings: 8, isActive: true },
      { id: 'SLOT-2', slotTime: '10:00 AM - 01:00 PM', maxCapacity: 25, currentBookings: 14, isActive: true },
      { id: 'SLOT-3', slotTime: '01:00 PM - 04:00 PM', maxCapacity: 20, currentBookings: 5, isActive: true },
      { id: 'SLOT-4', slotTime: '04:00 PM - 07:00 PM', maxCapacity: 30, currentBookings: 19, isActive: true },
      { id: 'SLOT-5', slotTime: '07:00 PM - 10:00 PM', maxCapacity: 15, currentBookings: 12, isActive: false }
    ]
  })

  useEffect(() => {
    localStorage.setItem('fdh_delivery_slots', JSON.stringify(slotsList))
  }, [slotsList])

  // System Audit & Timeline Logs
  const [orderTimelines, setOrderTimelines] = useState<Record<string, ActivityEvent[]>>({
    'FDH-SCHED-1092': [
      { id: 'E1', title: 'Scheduled Order Created', timestamp: '2026-06-28 09:00', performedBy: 'Storefront Customer', type: 'creation' },
      { id: 'E2', title: 'Vendor Assigned (Royal Poultry)', timestamp: '2026-06-28 09:15', performedBy: 'Operations Admin', type: 'vendor' },
      { id: 'E3', title: 'Rider Assigned (Ramesh Kumar)', timestamp: '2026-06-28 10:00', performedBy: 'Auto Dispatcher', type: 'rider' }
    ]
  })

  // Helper function to get assignment status
  const getAssignmentStatus = (order: Order): 'Unassigned' | 'Partially Assigned' | 'Fully Assigned' => {
    const hasVendor = Boolean(order.assignedVendorId || (order.items && order.items[0]?.vendorId))
    const hasRider = Boolean(order.assignedRiderId || order.assignedDeliveryPartner || order.deliveryBoyName)

    if (hasVendor && hasRider) return 'Fully Assigned'
    if (hasVendor || hasRider) return 'Partially Assigned'
    return 'Unassigned'
  }

  // Master Filtered Scheduled Orders List
  const scheduledOrders = useMemo(() => {
    return orders.filter((order) => {
      const isScheduled = order.deliveryType === 'scheduled' || Boolean(order.scheduledDate) || Boolean(order.scheduledSlot)
      
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery)

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      const orderSlotStr = order.scheduledSlot || order.scheduledTime || ''
      const matchesSlot = slotFilter === 'all' || orderSlotStr.includes(slotFilter)
      const matchesDate = !dateFilter || (order.scheduledDate || '').startsWith(dateFilter)
      
      const vId = order.assignedVendorId || (order.items && order.items[0]?.vendorId) || ''
      const matchesVendor = vendorFilter === 'all' || vId === vendorFilter

      const rId = order.assignedRiderId || ''
      const matchesRider = riderFilter === 'all' || rId === riderFilter

      const assignStatus = getAssignmentStatus(order)
      const matchesAssign = assignmentFilter === 'all' || assignStatus.toLowerCase().replace(' ', '-') === assignmentFilter

      return isScheduled && matchesSearch && matchesStatus && matchesSlot && matchesDate && matchesVendor && matchesRider && matchesAssign
    })
  }, [orders, searchQuery, statusFilter, slotFilter, dateFilter, vendorFilter, riderFilter, assignmentFilter])

  // Paginated Orders
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return scheduledOrders.slice(start, start + pageSize)
  }, [scheduledOrders, currentPage])

  const totalPages = Math.ceil(scheduledOrders.length / pageSize) || 1

  // Summary Metrics calculation (8 EXACT CARDS)
  const metrics = useMemo(() => {
    const total = scheduledOrders.length
    const todayStr = new Date().toISOString().split('T')[0]
    const todayOrders = scheduledOrders.filter(o => (o.scheduledDate || '').startsWith(todayStr))
    const upcoming = scheduledOrders.filter(o => (o.scheduledDate || '') > todayStr)
    const pendingAssignments = scheduledOrders.filter(o => getAssignmentStatus(o) !== 'Fully Assigned')
    const assignedOrders = scheduledOrders.filter(o => getAssignmentStatus(o) === 'Fully Assigned')
    const rescheduled = scheduledOrders.filter(o => o.status === 'rescheduled' || o.rescheduleReason)
    const completed = scheduledOrders.filter(o => o.status === 'delivered')
    const cancelled = scheduledOrders.filter(o => o.status === 'cancelled')

    return {
      total,
      todayCount: todayOrders.length,
      upcomingCount: upcoming.length,
      pendingAssignCount: pendingAssignments.length,
      assignedCount: assignedOrders.length,
      rescheduledCount: rescheduled.length,
      completedCount: completed.length,
      cancelledCount: cancelled.length
    }
  }, [scheduledOrders])

  // Handle Reschedule Submit
  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reschedulingOrder || !rescheduleDate) return

    updateOrderDelivery(reschedulingOrder.id, {
      scheduledDate: rescheduleDate,
      scheduledSlot: rescheduleSlot,
      scheduledTime: rescheduleSlot,
      status: 'rescheduled',
      rescheduleReason
    })

    // Add Timeline Event
    const newEvent: ActivityEvent = {
      id: `EV-${Date.now()}`,
      title: `Order Rescheduled to ${rescheduleDate} (${rescheduleSlot})`,
      timestamp: new Date().toLocaleString(),
      performedBy: 'Operations Admin',
      type: 'reschedule'
    }

    setOrderTimelines(prev => ({
      ...prev,
      [reschedulingOrder.id]: [newEvent, ...(prev[reschedulingOrder.id] || [])]
    }))

    alert(`Schedule Updated & SMS Notification sent to customer ${reschedulingOrder.customerName}!`)
    setReschedulingOrder(null)
  }

  // Handle Assignment Submit
  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!assigningOrder) return

    const vendorObj = vendors.find(v => v.id === assignVendorId)
    const riderObj = deliveryPartners.find(dp => dp.id === assignRiderId)

    updateOrderDelivery(assigningOrder.id, {
      assignedVendorId: assignVendorId,
      assignedRiderId: assignRiderId,
      assignedDeliveryPartner: riderObj?.name || assigningOrder.assignedDeliveryPartner,
      deliveryBoyName: riderObj?.name || assigningOrder.deliveryBoyName,
      deliveryBoyPhone: riderObj?.phone || assigningOrder.deliveryBoyPhone,
      status: 'assigned'
    })

    // Add Timeline Events
    const events: ActivityEvent[] = []
    if (assignVendorId) {
      events.push({
        id: `EV-V-${Date.now()}`,
        title: `Vendor Assigned: ${vendorObj?.name || assignVendorId}`,
        timestamp: new Date().toLocaleString(),
        performedBy: 'Dispatch Admin',
        type: 'vendor'
      })
    }
    if (assignRiderId) {
      events.push({
        id: `EV-R-${Date.now()}`,
        title: `Delivery Partner Assigned: ${riderObj?.name || assignRiderId}`,
        timestamp: new Date().toLocaleString(),
        performedBy: 'Dispatch Admin',
        type: 'rider'
      })
    }

    setOrderTimelines(prev => ({
      ...prev,
      [assigningOrder.id]: [...events, ...(prev[assigningOrder.id] || [])]
    }))

    alert(`Vendor & Rider assignment saved for Order #${assigningOrder.id}!`)
    setAssigningOrder(null)
  }

  // Handle Create Schedule Submit
  const handleCreateScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustName || !newCustPhone) return

    const productObj = products.find(p => p.id === newProductId) || products[0]

    const newOrderObj: Order = {
      id: `FDH-SCHED-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newCustName,
      customerPhone: newCustPhone,
      address: newCustAddress || 'Default Customer Address',
      items: [
        {
          id: productObj.id,
          name: productObj.name,
          price: productObj.price,
          qty: 1,
          weight: productObj.weight,
          image: productObj.image
        }
      ],
      total: productObj.price + 40,
      status: 'scheduled',
      paymentMethod: 'cod',
      createdAt: new Date().toISOString(),
      date: new Date().toISOString(),
      deliveryType: 'scheduled',
      scheduledDate: newDate,
      scheduledSlot: newSlot,
      scheduledTime: newSlot
    }

    addOrder(newOrderObj)

    setOrderTimelines(prev => ({
      ...prev,
      [newOrderObj.id]: [
        { id: `EV-CR-${Date.now()}`, title: 'Manual Scheduled Order Created', timestamp: new Date().toLocaleString(), performedBy: 'Admin Staff', type: 'creation' }
      ]
    }))

    alert(`Notification Sent: SMS & Email confirmation sent to ${newCustPhone}!`)
    setIsCreateOpen(false)
    setNewCustName('')
    setNewCustPhone('')
  }

  // Handle CSV Export
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Address', 'Scheduled Date', 'Time Slot', 'Amount', 'Status', 'Assignment Status', 'Assigned Rider']
    const rows = scheduledOrders.map(o => [
      o.id,
      `"${o.customerName}"`,
      o.customerPhone,
      `"${o.address || o.customerAddress}"`,
      o.scheduledDate || '',
      `"${o.scheduledSlot || o.scheduledTime || ''}"`,
      o.total,
      o.status,
      getAssignmentStatus(o),
      `"${o.deliveryBoyName || o.assignedDeliveryPartner || 'Unassigned'}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Scheduled_Orders_Export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 animate-fadeIn font-sans selection:bg-secondary selection:text-white">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <span className="text-[10px] uppercase font-black text-secondary tracking-widest">Enterprise Scheduled Order Management</span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-secondary" /> Scheduled Orders Terminal
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-secondary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-secondary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewMode('slots')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'slots' ? 'bg-secondary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Time Slots
            </button>
            <button
              onClick={() => setViewMode('audit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'audit' ? 'bg-secondary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Audit Trail
            </button>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider py-5 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-secondary/20"
          >
            <Plus className="w-4 h-4" /> Create Schedule
          </Button>

          <button
            onClick={handleExportCSV}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl transition-all"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification Badges Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center gap-3">
          <Bell className="w-4 h-4 text-sky-400 shrink-0" />
          <div>
            <p className="text-[9px] font-black uppercase text-sky-400">New Scheduled Orders</p>
            <p className="text-xs font-bold text-white">{scheduledOrders.filter(o => o.status === 'scheduled' || o.status === 'pending').length} Action Required</p>
          </div>
        </div>

        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
          <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <p className="text-[9px] font-black uppercase text-emerald-400">Today's Deliveries</p>
            <p className="text-xs font-bold text-white">{metrics.todayCount} Packages Queued</p>
          </div>
        </div>

        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <p className="text-[9px] font-black uppercase text-amber-400">Pending Assignments</p>
            <p className="text-xs font-bold text-white">{metrics.pendingAssignCount} Need Dispatch</p>
          </div>
        </div>

        <div className="p-3.5 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center gap-3">
          <RefreshCw className="w-4 h-4 text-violet-400 shrink-0" />
          <div>
            <p className="text-[9px] font-black uppercase text-violet-400">Rescheduled Orders</p>
            <p className="text-xs font-bold text-white">{metrics.rescheduledCount} Customer Requests</p>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards (8 EXACT CARDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { title: 'Total Scheduled', val: metrics.total, icon: Calendar, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
          { title: "Today's Orders", val: metrics.todayCount, icon: Clock, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { title: 'Upcoming Orders', val: metrics.upcomingCount, icon: ChevronRight, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
          { title: 'Pending Assign', val: metrics.pendingAssignCount, icon: AlertTriangle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
          { title: 'Assigned Orders', val: metrics.assignedCount, icon: ShieldCheck, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
          { title: 'Rescheduled', val: metrics.rescheduledCount, icon: RefreshCw, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
          { title: 'Completed', val: metrics.completedCount, icon: CheckCircle2, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
          { title: 'Cancelled', val: metrics.cancelledCount, icon: XCircle, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' }
        ].map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className="p-3 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[8px] uppercase font-black tracking-wider text-slate-400">{card.title}</p>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${card.color} shrink-0`}>
                  <Icon className="w-3 h-3" />
                </div>
              </div>
              <h3 className="text-lg font-black text-white">{card.val}</h3>
            </div>
          )
        })}
      </div>

      {/* Search & Comprehensive Filters Bar */}
      <div className="p-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ID, Name, Mobile..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-950 border border-slate-800 text-white text-xs py-2.5 pl-9 pr-3 rounded-xl outline-none focus:border-secondary font-medium"
          />
        </div>

        {/* Date Filter */}
        <div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-950 border border-slate-800 text-white text-xs py-2.5 px-3 rounded-xl outline-none focus:border-secondary font-medium"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs py-2.5 px-3 rounded-xl outline-none focus:border-secondary font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="assigned">Assigned</option>
            <option value="ready-for-delivery">Ready for Delivery</option>
            <option value="out-for-delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Vendor Filter */}
        <div>
          <select
            value={vendorFilter}
            onChange={(e) => { setVendorFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs py-2.5 px-3 rounded-xl outline-none focus:border-secondary font-medium"
          >
            <option value="all">All Vendors</option>
            {vendors.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Delivery Partner Filter */}
        <div>
          <select
            value={riderFilter}
            onChange={(e) => { setRiderFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs py-2.5 px-3 rounded-xl outline-none focus:border-secondary font-medium"
          >
            <option value="all">All Delivery Partners</option>
            {deliveryPartners.map(dp => (
              <option key={dp.id} value={dp.id}>{dp.name}</option>
            ))}
          </select>
        </div>

        {/* Assignment Status Filter */}
        <div>
          <select
            value={assignmentFilter}
            onChange={(e) => { setAssignmentFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs py-2.5 px-3 rounded-xl outline-none focus:border-secondary font-medium"
          >
            <option value="all">All Assignment States</option>
            <option value="unassigned">Unassigned</option>
            <option value="partially-assigned">Partially Assigned</option>
            <option value="fully-assigned">Fully Assigned</option>
          </select>
        </div>
      </div>

      {/* VIEW MODE 1: Scheduled Orders List Table */}
      {viewMode === 'list' && (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/60 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Delivery Address</th>
                  <th className="p-4">Items / Value</th>
                  <th className="p-4">Scheduled Slot</th>
                  <th className="p-4">Assignment Status</th>
                  <th className="p-4">Vendor & Partner</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-slate-400 space-y-2">
                      <Calendar className="w-8 h-8 mx-auto text-slate-600 animate-bounce" />
                      <p className="font-bold text-sm text-slate-300">No scheduled orders match your filter criteria.</p>
                      <p className="text-xs text-slate-500">Try adjusting your date range, search query, or status filter.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => {
                    const assignState = getAssignmentStatus(order)
                    const vendorObj = vendors.find(v => v.id === order.assignedVendorId || (order.items && order.items[0]?.vendorId === v.id))
                    const riderName = order.deliveryBoyName || order.assignedDeliveryPartner || deliveryPartners.find(dp => dp.id === order.assignedRiderId)?.name

                    return (
                      <tr key={order.id} className="hover:bg-slate-950/60 transition-colors">
                        {/* 1. Order ID & Created Date */}
                        <td className="p-4 space-y-1">
                          <span className="font-mono font-bold text-secondary block">{order.id}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">Created: {new Date(order.createdAt || order.date).toLocaleDateString()}</span>
                        </td>

                        {/* 2. Customer Name & Mobile */}
                        <td className="p-4 space-y-1">
                          <p className="font-bold text-white leading-tight">{order.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" /> {order.customerPhone}
                          </p>
                        </td>

                        {/* 3. Delivery Address */}
                        <td className="p-4 max-w-[200px]">
                          <p className="text-[11px] text-slate-300 leading-snug truncate" title={order.address || order.customerAddress}>
                            {order.address || order.customerAddress || 'Customer Address'}
                          </p>
                        </td>

                        {/* 4. Product Count & Order Value */}
                        <td className="p-4 space-y-1">
                          <p className="font-bold text-slate-200">{order.items ? order.items.length : 1} Cut(s)</p>
                          <p className="text-xs font-black text-white">₹{order.total}</p>
                        </td>

                        {/* 5. Scheduled Date & Slot */}
                        <td className="p-4 space-y-1">
                          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                            <Calendar className="w-3.5 h-3.5" /> {order.scheduledDate || '2026-06-29'}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                            <Clock className="w-3 h-3 text-slate-500" /> {order.scheduledSlot || order.scheduledTime || '10:00 AM - 01:00 PM'}
                          </div>
                        </td>

                        {/* 6. Assignment Status Badge */}
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase border ${
                            assignState === 'Fully Assigned' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            assignState === 'Partially Assigned' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {assignState}
                          </span>
                        </td>

                        {/* 7. Assigned Vendor & Partner */}
                        <td className="p-4 space-y-1 text-[11px]">
                          <p className="text-slate-300 flex items-center gap-1 font-semibold">
                            <Store className="w-3 h-3 text-slate-500" /> {vendorObj ? vendorObj.name : 'Unassigned Vendor'}
                          </p>
                          <p className="text-slate-400 flex items-center gap-1 font-semibold">
                            <Truck className="w-3 h-3 text-slate-500" /> {riderName || 'Unassigned Rider'}
                          </p>
                        </td>

                        {/* 8. Current Status Selection (8 STATUSES) */}
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className={`text-[11px] font-extrabold py-1.5 px-2.5 rounded-xl outline-none border transition-all ${
                              order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              order.status === 'rescheduled' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                              order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            }`}
                          >
                            <option value="pending" className="bg-slate-900 text-amber-400">Pending</option>
                            <option value="scheduled" className="bg-slate-900 text-sky-400">Scheduled</option>
                            <option value="assigned" className="bg-slate-900 text-indigo-400">Assigned</option>
                            <option value="ready-for-delivery" className="bg-slate-900 text-blue-400">Ready for Delivery</option>
                            <option value="out-for-delivery" className="bg-slate-900 text-teal-400">Out for Delivery</option>
                            <option value="delivered" className="bg-slate-900 text-emerald-400">Delivered</option>
                            <option value="rescheduled" className="bg-slate-900 text-violet-400">Rescheduled</option>
                            <option value="cancelled" className="bg-slate-900 text-rose-400">Cancelled</option>
                          </select>
                        </td>

                        {/* 9. Action Controls */}
                        <td className="p-4 text-center space-x-1.5 shrink-0">
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                            title="View Details & Timeline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setAssigningOrder(order)
                              setAssignVendorId(order.assignedVendorId || (order.items && order.items[0]?.vendorId) || vendors[0]?.id || '')
                              setAssignRiderId(order.assignedRiderId || deliveryPartners[0]?.id || '')
                            }}
                            className="p-2 bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/20 rounded-xl transition-colors"
                            title="Assign Vendor / Partner"
                          >
                            <User className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setReschedulingOrder(order)
                              setRescheduleDate(order.scheduledDate || new Date().toISOString().split('T')[0])
                              setRescheduleSlot(order.scheduledSlot || order.scheduledTime || '10:00 AM - 01:00 PM')
                            }}
                            className="p-2 bg-violet-500/15 hover:bg-violet-500/25 text-violet-400 border border-violet-500/20 rounded-xl transition-colors"
                            title="Reschedule Order"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Showing Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({scheduledOrders.length} total orders)</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: Monthly / Weekly / Daily Calendar Grid */}
      {viewMode === 'calendar' && (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-black text-white uppercase tracking-wider">Schedule Calendar Grid</h3>
              <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
                <button onClick={() => setCalendarScope('month')} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${calendarScope === 'month' ? 'bg-secondary text-white' : 'text-slate-400'}`}>Monthly</button>
                <button onClick={() => setCalendarScope('week')} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${calendarScope === 'week' ? 'bg-secondary text-white' : 'text-slate-400'}`}>Weekly</button>
                <button onClick={() => setCalendarScope('day')} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${calendarScope === 'day' ? 'bg-secondary text-white' : 'text-slate-400'}`}>Daily</button>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400">June / July 2026</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div key={i} className="py-2 bg-slate-950/60 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400 border border-slate-800/60">
                {d}
              </div>
            ))}

            {Array.from({ length: 28 }).map((_, i) => {
              const dayNum = i + 1
              const dayDateStr = `2026-06-${dayNum < 10 ? '0' + dayNum : dayNum}`
              const dayOrders = scheduledOrders.filter(o => (o.scheduledDate || '').startsWith(dayDateStr))

              return (
                <div key={i} className="min-h-[100px] p-2 bg-slate-950/40 rounded-2xl border border-slate-800/60 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400">
                    <span>{dayNum}</span>
                    {dayOrders.length > 0 && (
                      <span className="w-5 h-5 rounded-full bg-secondary text-white text-[9px] flex items-center justify-center font-black">
                        {dayOrders.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 my-1 flex-1">
                    {dayOrders.slice(0, 2).map(o => (
                      <div
                        key={o.id}
                        onClick={() => setSelectedOrderDetails(o)}
                        className="p-1 rounded bg-secondary/15 border border-secondary/30 text-[9px] text-white font-bold truncate cursor-pointer hover:bg-secondary/30 transition-colors text-left"
                      >
                        {o.customerName} ({o.items[0]?.name})
                      </div>
                    ))}
                    {dayOrders.length > 2 && (
                      <p className="text-[8px] text-slate-500 font-bold">+{dayOrders.length - 2} more</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: Time Slots Manager */}
      {viewMode === 'slots' && (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800/80 pb-4">
            <h3 className="text-base font-black text-white uppercase tracking-wider">Delivery Time Slots Capacity Manager</h3>
            <p className="text-xs text-slate-400">Set booking capacity thresholds per slot to manage kitchen preparation loads</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {slotsList.map((slot) => {
              const pct = Math.round((slot.currentBookings / slot.maxCapacity) * 100)
              return (
                <div key={slot.id} className="p-5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-4 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-secondary">{slot.id}</span>
                    <button
                      onClick={() => setSlotsList(prev => prev.map(s => s.id === slot.id ? { ...s, isActive: !s.isActive } : s))}
                      className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${slot.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}
                    >
                      {slot.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white">{slot.slotTime}</h4>
                    <p className="text-xs text-slate-400 mt-1">Bookings: <span className="text-white font-bold">{slot.currentBookings}</span> / {slot.maxCapacity} Max</p>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${pct > 80 ? 'bg-rose-500' : 'bg-gradient-to-r from-primary to-secondary'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 4: Audit Trail */}
      {viewMode === 'audit' && (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">Historical Audit Trail</h3>
          <div className="space-y-3">
            {Object.entries(orderTimelines).flatMap(([orderId, events]) =>
              events.map(ev => (
                <div key={ev.id} className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-secondary/15 text-secondary border border-secondary/20 text-[9px] font-black uppercase rounded">{orderId}</span>
                    <h4 className="text-xs font-bold text-white mt-1">{ev.title}</h4>
                    <p className="text-[10px] text-slate-400">Performed by: {ev.performedBy}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{ev.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Vendor & Partner Assignment Modal */}
      {assigningOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl relative">
            <button onClick={() => setAssigningOrder(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase text-sky-400 tracking-wider">Fulfillment Assignment</span>
              <h3 className="text-xl font-black text-white mt-0.5">Assign Order #{assigningOrder.id}</h3>
              <p className="text-xs text-slate-400 mt-1">Customer: {assigningOrder.customerName}</p>
            </div>

            <form onSubmit={handleAssignmentSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400">Select Sourcing Vendor</label>
                <select
                  value={assignVendorId}
                  onChange={(e) => setAssignVendorId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary"
                >
                  <option value="">Unassigned Vendor</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.contact_person})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400">Select Delivery Partner / Rider</label>
                <select
                  value={assignRiderId}
                  onChange={(e) => setAssignRiderId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary"
                >
                  <option value="">Unassigned Rider</option>
                  {deliveryPartners.map(dp => (
                    <option key={dp.id} value={dp.id}>{dp.name} ({dp.phone})</option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full py-6 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-widest rounded-xl">
                Save Assignment Changes
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Reschedule Order Modal */}
      {reschedulingOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl relative">
            <button onClick={() => setReschedulingOrder(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase text-violet-400 tracking-wider">Reschedule Delivery</span>
              <h3 className="text-xl font-black text-white mt-0.5">Order #{reschedulingOrder.id}</h3>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400">New Delivery Date</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400">New Delivery Time Slot</label>
                <select
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary"
                >
                  {slotsList.map(s => (
                    <option key={s.id} value={s.slotTime}>{s.slotTime}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400">Reschedule Reason</label>
                <textarea
                  placeholder="Note reason for changing schedule..."
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary h-20"
                />
              </div>

              <Button type="submit" className="w-full py-6 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-widest rounded-xl">
                Save Schedule Updates
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Manual Create Schedule Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button onClick={() => setIsCreateOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase text-secondary tracking-wider">Manual Booking</span>
              <h3 className="text-xl font-black text-white mt-0.5">Create Scheduled Order</h3>
            </div>

            <form onSubmit={handleCreateScheduleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anish Sharma"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Mobile Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 9876543210"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400">Delivery Address</label>
                <input
                  type="text"
                  placeholder="Full address..."
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400">Select Product Cut</label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Time Slot</label>
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-xl outline-none focus:border-secondary"
                  >
                    {slotsList.map(s => (
                      <option key={s.id} value={s.slotTime}>{s.slotTime}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full py-6 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-widest rounded-xl">
                Book Scheduled Delivery
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Order Details Inspection & Activity Timeline */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedOrderDetails(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">Scheduled Order Sheet</span>
              <h3 className="text-xl font-black text-white mt-0.5">Order #{selectedOrderDetails.id}</h3>
            </div>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Customer Name & Phone:</span>
                <span className="font-bold text-white">{selectedOrderDetails.customerName} ({selectedOrderDetails.customerPhone})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Delivery Address:</span>
                <span className="font-bold text-slate-200 text-right max-w-xs">{selectedOrderDetails.address || selectedOrderDetails.customerAddress}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Scheduled Date & Slot:</span>
                <span className="font-bold text-emerald-400">{selectedOrderDetails.scheduledDate || '2026-06-29'} ({selectedOrderDetails.scheduledSlot || selectedOrderDetails.scheduledTime || '10:00 AM - 01:00 PM'})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Assignment State:</span>
                <span className="font-bold text-amber-400">{getAssignmentStatus(selectedOrderDetails)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Order Amount:</span>
                <span className="font-black text-white text-sm">₹{selectedOrderDetails.total}</span>
              </div>
            </div>

            {/* Activity Timeline Section */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <History className="w-4 h-4 text-secondary" /> Activity Timeline
              </h4>
              <div className="space-y-2 border-l-2 border-slate-800 pl-4 py-1">
                {(orderTimelines[selectedOrderDetails.id] || [
                  { id: 'DEF-1', title: 'Scheduled Order Created', timestamp: '2026-06-28 10:00', performedBy: 'System Auto-Register', type: 'creation' }
                ]).map((ev) => (
                  <div key={ev.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-slate-900" />
                    <p className="text-xs font-bold text-white">{ev.title}</p>
                    <p className="text-[10px] text-slate-500">{ev.timestamp} • {ev.performedBy}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => setSelectedOrderDetails(null)} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl">
              Close Inspection Sheet
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
