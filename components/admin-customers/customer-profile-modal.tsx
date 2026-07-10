'use client'

import { useState } from 'react'
import { useStore, type CustomerAccount, type CustomerAccountStatus } from '@/lib/store'
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Ban,
  AlertTriangle,
  ShoppingBag,
  CheckCircle,
  XCircle,
  RefreshCw,
  History,
  DollarSign
} from 'lucide-react'

interface CustomerProfileModalProps {
  customer: CustomerAccount | null
  onClose: () => void
}

export function CustomerProfileModal({ customer, onClose }: CustomerProfileModalProps) {
  const { orders, updateCustomerStatus } = useStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'activity'>('overview')
  const [showControlModal, setShowControlModal] = useState<CustomerAccountStatus | null>(null)
  const [actionReason, setActionReason] = useState('')

  if (!customer) return null

  // Link customer orders by phone or name
  const customerOrders = orders.filter(
    (o) => o.customerPhone === customer.phone || o.customerName.toLowerCase() === customer.fullName.toLowerCase()
  )

  // Aggregate stats
  const totalOrdersCount = customerOrders.length
  const completedOrdersCount = customerOrders.filter((o) => o.status === 'delivered').length
  const cancelledOrdersCount = customerOrders.filter((o) => o.status === 'cancelled').length
  const pendingOrdersCount = customerOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length
  const totalSpendAmount = customerOrders.reduce((sum, o) => sum + o.total, 0)

  const handleApplyAccountControl = () => {
    if (!showControlModal) return
    updateCustomerStatus(customer.id, showControlModal, actionReason, 'Super Admin')
    setShowControlModal(null)
    setActionReason('')
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex justify-end font-sans">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-2xl h-full flex flex-col justify-between shadow-2xl overflow-hidden animate-slide-left">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary font-black text-lg">
              {customer.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">{customer.fullName}</h2>
                <span
                  className={`text-[9px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full border ${
                    customer.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : customer.status === 'blocked'
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {customer.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">ID: {customer.id}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/20 px-6 pt-2">
          {[
            { id: 'overview', label: 'Overview & Controls' },
            { id: 'orders', label: `Order History (${totalOrdersCount})` },
            { id: 'activity', label: `Activity Log (${customer.activityLogs.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-secondary text-secondary font-black'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Main Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Customer Primary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
                  <span className="text-[9px] uppercase font-extrabold text-slate-500 block">Contact Profile</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-slate-500" /> {customer.email || 'N/A'}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-500" /> {customer.phone}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
                  <span className="text-[9px] uppercase font-extrabold text-slate-500 block">Registration Stats</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> Joined {new Date(customer.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> Last Login {new Date(customer.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Spend Summary Bar */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Lifetime Spend</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-mono">₹{totalSpendAmount.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-emerald-400 font-bold">across {totalOrdersCount} orders</span>
                </div>
              </div>

              {/* Account Control Management Actions */}
              <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" /> Account Administrative Controls
                </h3>
                <p className="text-xs text-slate-400">Manage access level, block malicious checkout sessions, or suspend problematic users.</p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {customer.status !== 'active' && (
                    <button
                      onClick={() => setShowControlModal('active')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                    >
                      <ShieldCheck className="w-4 h-4" /> Reactivate / Unblock Account
                    </button>
                  )}

                  {customer.status !== 'suspended' && (
                    <button
                      onClick={() => setShowControlModal('suspended')}
                      className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-4 h-4" /> Suspend Account
                    </button>
                  )}

                  {customer.status !== 'blocked' && (
                    <button
                      onClick={() => setShowControlModal('blocked')}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Ban className="w-4 h-4" /> Permanently Block User
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center">
                  <span className="text-[9px] uppercase font-extrabold text-slate-500">Total</span>
                  <p className="text-lg font-black text-white mt-0.5">{totalOrdersCount}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center">
                  <span className="text-[9px] uppercase font-extrabold text-emerald-500">Completed</span>
                  <p className="text-lg font-black text-emerald-400 mt-0.5">{completedOrdersCount}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center">
                  <span className="text-[9px] uppercase font-extrabold text-amber-500">Pending</span>
                  <p className="text-lg font-black text-amber-400 mt-0.5">{pendingOrdersCount}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center">
                  <span className="text-[9px] uppercase font-extrabold text-red-500">Cancelled</span>
                  <p className="text-lg font-black text-red-400 mt-0.5">{cancelledOrdersCount}</p>
                </div>
              </div>

              {/* Order List Table */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden">
                {customerOrders.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">No order records found for this customer.</div>
                ) : (
                  <div className="overflow-x-auto w-full">
<table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/60 text-[10px] uppercase tracking-wider font-black text-slate-400">
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Total</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {customerOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-900/40">
                          <td className="p-3 font-mono font-bold text-white">{o.id}</td>
                          <td className="p-3 text-slate-400">{new Date(o.date).toLocaleDateString()}</td>
                          <td className="p-3 text-slate-300 max-w-[150px] truncate">
                            {o.items.map((i) => i.name).join(', ')}
                          </td>
                          <td className="p-3 font-mono font-bold text-white">₹{o.total}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-slate-800 text-slate-300">
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Historical Activity Ledger</h3>

              <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {customer.activityLogs.map((log) => (
                  <div key={log.id} className="relative flex items-start gap-4 pl-2">
                    <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0 z-10">
                      {log.type === 'login' && <Clock className="w-4 h-4 text-blue-400" />}
                      {log.type === 'order' && <ShoppingBag className="w-4 h-4 text-emerald-400" />}
                      {log.type === 'status_change' && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                      {log.type === 'security_alert' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex-1 text-xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="font-bold uppercase text-[9px] tracking-wider text-slate-500">{log.type.replace('_', ' ')}</span>
                        <span className="font-mono text-[10px]">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-white font-medium">{log.description}</p>
                      {log.ipAddress && <p className="text-[10px] font-mono text-slate-500 mt-1">IP Address: {log.ipAddress}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Modal for Account Control */}
        {showControlModal && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Confirm Account Status Shift</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to change {customer.fullName}&apos;s account status to <strong className="uppercase text-white">{showControlModal}</strong>?
              </p>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Audit Log Reason</label>
                <input
                  type="text"
                  placeholder="Enter reason for compliance..."
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl outline-none focus:border-secondary"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowControlModal(null)}
                  className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyAccountControl}
                  className="flex-1 py-2 bg-secondary text-white rounded-xl text-xs font-bold"
                >
                  Confirm Shift
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
