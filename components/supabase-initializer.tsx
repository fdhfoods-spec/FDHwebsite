'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export function SupabaseInitializer() {
  const { fetchProducts, fetchBanners, fetchOrders, fetchVendors, fetchDeliveryPartners, setUser, setAuthLoading } = useStore()

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchProducts()
      fetchBanners()
      fetchOrders()
      fetchVendors()
      fetchDeliveryPartners()
    }

    const initSession = async () => {
      setAuthLoading(true)

      let activeUser: any = null

      // 1. First check if Supabase Auth client has active session
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            const metadata = session.user.user_metadata || {}
            const userPhone = session.user.phone || metadata.phone || ''
            let userRole = 'customer'
            let userName = metadata.name || userPhone || 'Verified Customer'

            if (userPhone) {
              const { data: dbUser } = await supabase
                .from('users')
                .select('*')
                .eq('phone', userPhone)
                .maybeSingle()

              if (dbUser) {
                userRole = dbUser.role || 'customer'
                userName = dbUser.full_name || userName
              }
            }

            activeUser = {
              id: session.user.id,
              name: userName,
              phone: userPhone,
              email: session.user.email || '',
              role: userRole as any
            }
          }
        } catch (e) {
          console.warn('[Supabase Session Recovery Error]', e)
        }
      }

      // 2. If Supabase Auth session is not present, recover from persistent browser storage
      if (!activeUser && typeof window !== 'undefined') {
        try {
          const savedSession = localStorage.getItem('fdh_user_session')
          if (savedSession) {
            const parsedUser = JSON.parse(savedSession)
            if (parsedUser && (parsedUser.phone || parsedUser.username)) {
              activeUser = parsedUser

              if (isSupabaseConfigured() && supabase && parsedUser.phone) {
                const { data: dbUser } = await supabase
                  .from('users')
                  .select('*')
                  .eq('phone', parsedUser.phone)
                  .maybeSingle()

                if (dbUser) {
                  activeUser.role = dbUser.role || activeUser.role || 'customer'
                  activeUser.name = dbUser.full_name || activeUser.name
                }
              }
            }
          }
        } catch (e) {
          console.warn('[Local Storage Session Recovery Error]', e)
        }
      }

      setUser(activeUser)
      setAuthLoading(false)
    }

    initSession()

    // 3. Listen to live Auth & Database shifts (Real-time Sync)
    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const metadata = session.user.user_metadata || {}
          const userPhone = session.user.phone || metadata.phone || ''
          let userRole = 'customer'
          let userName = metadata.name || userPhone || 'Verified Customer'

          if (userPhone) {
            const { data: dbUser } = await supabase
              .from('users')
              .select('*')
              .eq('phone', userPhone)
              .maybeSingle()

            if (dbUser) {
              userRole = dbUser.role || 'customer'
              userName = dbUser.full_name || userName
            }
          }

          setUser({
            id: session.user.id,
            name: userName,
            phone: userPhone,
            email: session.user.email || '',
            role: userRole as any
          })
        }
      })

      // Real-Time Database Channel Subscriptions
      const dbChannel = supabase
        .channel('public-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
          console.log('[Real-Time Notification] Live update detected on public.orders table!')
          fetchOrders()
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'scheduled_orders' }, () => {
          console.log('[Real-Time Notification] Live update detected on public.scheduled_orders table!')
          fetchOrders()
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          console.log('[Real-Time Notification] Live update detected on public.products table!')
          fetchProducts()
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, () => {
          console.log('[Real-Time Notification] Live update detected on public.banners table!')
          fetchBanners()
        })
        .subscribe()

      return () => {
        subscription.unsubscribe()
        supabase.removeChannel(dbChannel)
      }
    }
  }, [fetchProducts, fetchBanners, fetchOrders, fetchVendors, fetchDeliveryPartners, setUser, setAuthLoading])

  return null
}
