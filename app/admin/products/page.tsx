'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'

export default function AdminProductsPage() {
  const router = useRouter()
  const { user, isAuthLoading } = useStore()

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user || user.role !== 'admin') {
        router.replace('/admin/login')
      } else {
        router.replace('/admin')
      }
    }
  }, [user, isAuthLoading, router])

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
      <p className="text-xs font-bold text-slate-400">Loading Admin Products Catalog...</p>
    </div>
  )
}
