'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'

export function AuthModal() {
  const router = useRouter()
  const { isAuthModalOpen, setAuthModalOpen } = useStore()

  useEffect(() => {
    if (isAuthModalOpen) {
      setAuthModalOpen(false)
      router.push('/auth')
    }
  }, [isAuthModalOpen, setAuthModalOpen, router])

  return null
}
