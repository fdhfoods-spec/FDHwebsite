import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(req: Request) {
  try {
    const payload = await req.json()

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase configuration is missing on the server' }, { status: 500 })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Try inserting the full payload
    const { data, error } = await supabaseAdmin.from('orders').insert([payload])

    if (error) {
      console.warn('[Supabase Insert Warning] Full schema insert failed on public.orders, running core payload fallback:', error.message || error)
      
      // Fallback: Strip out potentially missing columns
      const corePayload = {
        id: payload.id,
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        customer_address: payload.customer_address,
        items: payload.items,
        payment_method: payload.payment_method,
        subtotal: payload.subtotal,
        delivery_fee: payload.delivery_fee,
        total: payload.total,
        status: payload.status,
        date: payload.date,
        latitude: payload.latitude,
        longitude: payload.longitude,
        distance_km: payload.distance_km,
        estimated_delivery_time: payload.estimated_delivery_time,
        assigned_delivery_partner: payload.assigned_delivery_partner,
        delivery_type: payload.delivery_type,
        scheduled_date: payload.scheduled_date,
        scheduled_slot: payload.scheduled_slot,
        scheduled_time: payload.scheduled_time,
        assigned_rider_id: payload.assigned_rider_id,
        reschedule_reason: payload.reschedule_reason,
        delivery_boy_name: payload.delivery_boy_name,
        delivery_boy_phone: payload.delivery_boy_phone
      }

      // Remove undefined/missing values
      const cleanCorePayload: any = {}
      Object.keys(corePayload).forEach(k => {
        if ((corePayload as any)[k] !== undefined) {
          cleanCorePayload[k] = (corePayload as any)[k]
        }
      })

      const { error: coreErr } = await supabaseAdmin.from('orders').insert([cleanCorePayload])
      if (coreErr) {
        console.error('[Supabase Insert Error] Failed to insert into public.orders:', coreErr.message || coreErr)
        return NextResponse.json({ error: coreErr.message }, { status: 500 })
      }
    }
    
    // 2. Also insert into scheduled_orders if applicable
    if (payload.delivery_type === 'scheduled' || payload.scheduled_date || payload.scheduled_slot) {
      const schedPayload: any = {
        id: payload.id,
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        customer_address: payload.customer_address,
        items: payload.items,
        payment_method: payload.payment_method,
        total: payload.total,
        status: payload.status,
        scheduled_date: payload.scheduled_date,
        scheduled_slot: payload.scheduled_slot,
        scheduled_time: payload.scheduled_time
      }
      if (payload.assigned_rider_id) schedPayload.assigned_rider_id = payload.assigned_rider_id
      if (payload.reschedule_reason) schedPayload.reschedule_reason = payload.reschedule_reason

      const { error: schedError } = await supabaseAdmin.from('scheduled_orders').upsert([schedPayload])
      if (schedError) {
        console.warn('[Supabase scheduled_orders sync note]:', schedError.message || schedError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    const isMock = supabaseUrl?.includes('fdh-supabase-project.supabase.co')
    if (isMock && (err.message?.includes('fetch failed') || err.message?.includes('Failed to fetch') || err.message?.includes('getaddrinfo') || err.message?.includes('ENOTFOUND'))) {
      console.warn('Server warning: Skipped database insert for mock domain placeholder:', err.message || err)
    } else {
      console.error('Server error creating order:', err)
    }
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
