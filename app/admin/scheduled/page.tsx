'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { ScheduledOrdersPanel } from '@/components/admin-scheduled'

export default function DedicatedScheduledOrdersPage() {
  const router = useRouter()
  const { user, isAuthLoading } = useStore()

  useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== 'admin')) {
      router.replace('/admin/login')
    }
  }, [user, isAuthLoading, router])

  if (isAuthLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <p className="text-xs font-bold text-slate-400">Verifying session & loading scheduled orders...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <ScheduledOrdersPanel />
      </div>
    </div>
  )
}
