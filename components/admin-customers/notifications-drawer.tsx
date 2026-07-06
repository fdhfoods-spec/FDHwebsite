'use client'

import { useStore } from '@/lib/store'
import { Bell, X, ShieldAlert, UserPlus, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface NotificationsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsDrawer({ isOpen, onClose }: NotificationsDrawerProps) {
  const { adminNotifications, markNotificationRead } = useStore()

  if (!isOpen) return null

  const unreadCount = adminNotifications.filter((n) => !n.read).length

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex justify-end font-sans">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl overflow-hidden animate-slide-left">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base font-black text-white">Security & Audit Alerts</h2>
              <p className="text-xs text-slate-400">Admin notifications log feed</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {adminNotifications.length === 0 ? (
            <div className="text-center text-slate-500 text-xs py-12">No notifications logged.</div>
          ) : (
            adminNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all ${
                  notif.read
                    ? 'bg-slate-950/40 border-slate-850 opacity-80'
                    : 'bg-slate-950 border-amber-500/30 shadow-lg shadow-amber-500/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      {notif.type === 'new_registration' && <UserPlus className="w-4 h-4 text-emerald-400" />}
                      {notif.type === 'blocked_attempt' && <ShieldAlert className="w-4 h-4 text-red-400" />}
                      {notif.type === 'suspicious_activity' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                      <span className="text-[9px] font-mono text-slate-500 block mt-2">
                        {new Date(notif.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!notif.read && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="text-[10px] font-bold text-amber-400 hover:underline shrink-0"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Realtime System Logging Active
          </span>
        </div>

      </div>
    </div>
  )
}
