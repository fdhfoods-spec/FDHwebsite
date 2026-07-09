import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const isSupabaseConfigured = !!supabaseUrl && 
  (!!supabaseServiceKey || !!supabaseAnonKey) && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  !supabaseUrl.includes('fdh-supabase-project.supabase.co')

const localAddressesPath = path.join(process.cwd(), 'data', 'addresses.json')

// Local JSON File Helper
function getLocalAddresses(phone: string): any[] {
  try {
    if (!fs.existsSync(localAddressesPath)) {
      const dir = path.dirname(localAddressesPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(localAddressesPath, JSON.stringify({}), 'utf8')
    }
    const data = fs.readFileSync(localAddressesPath, 'utf8')
    const db = JSON.parse(data)
    return db[phone] || []
  } catch (e) {
    console.error('Failed to read local addresses fallback:', e)
    return []
  }
}

function saveLocalAddresses(phone: string, addresses: any[]) {
  try {
    if (!fs.existsSync(localAddressesPath)) {
      const dir = path.dirname(localAddressesPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    }
    const data = fs.existsSync(localAddressesPath) ? fs.readFileSync(localAddressesPath, 'utf8') : '{}'
    const db = JSON.parse(data)
    db[phone] = addresses
    fs.writeFileSync(localAddressesPath, JSON.stringify(db, null, 2), 'utf8')
  } catch (e) {
    console.error('Failed to save local addresses fallback:', e)
  }
}

// Helper to ensure we have a valid UUID for Postgres columns
function getUuid(id: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (uuidRegex.test(id)) {
    return id
  }
  // Clean non-hex characters and pad deterministically
  const clean = id.replace(/[^0-9a-f]/gi, '').toLowerCase()
  const padded = clean.padEnd(12, '0').slice(0, 12)
  return `00000000-0000-4000-a000-${padded}`
}

// Helper to get active Supabase client (using user token if present to enforce RLS, or fallback to server key)
function getSupabaseClient(token?: string | null) {
  if (!isSupabaseConfigured) return null
  
  if (token) {
    // Create Supabase client in the context of the logged-in user
    return createClient(supabaseUrl, token)
  }
  
  // Use service key or anon key as fallback
  const key = supabaseServiceKey || supabaseAnonKey
  return createClient(supabaseUrl, key)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const phone = searchParams.get('phone')

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
  }

  // Get Auth Token from Request headers
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

  const client = getSupabaseClient(token)
  if (!client) {
    // Safe fallback when Supabase is not configured
    console.log('[GET Address API]: Supabase not configured. Using local JSON store fallback.')
    return NextResponse.json({ address: getLocalAddresses(phone) })
  }

  try {
    // 1. Get User ID
    let userId: string | null = null
    if (token) {
      const { data: { user: authUser }, error: authError } = await client.auth.getUser()
      if (authUser) {
        userId = authUser.id
      }
      if (authError) {
        console.warn('[GET Address Auth warning]:', authError.message)
      }
    }

    // Fallback to query users table by phone if token wasn't resolved
    if (!userId) {
      const fallbackClient = getSupabaseClient(null)
      if (fallbackClient) {
        const { data: dbUser, error: dbError } = await fallbackClient
          .from('users')
          .select('id')
          .eq('phone', phone)
          .maybeSingle()

        if (dbUser) {
          userId = dbUser.id
        }
        if (dbError) {
          console.warn('[GET Address Users lookup warning]:', dbError.message)
        }
      }
    }

    if (!userId) {
      console.warn('[GET Address API]: User ID not found in database. Using local JSON store fallback.')
      return NextResponse.json({ address: getLocalAddresses(phone) })
    }

    // 2. Fetch Addresses from addresses table
    const { data: addressesData, error: addressesError } = await client
      .from('addresses')
      .select('*')
      .eq('user_id', getUuid(userId))
      .order('created_at', { ascending: true })

    if (addressesError) {
      console.error('[GET Address Table Error]:', addressesError.message, addressesError.details)
      // Fallback on database error
      return NextResponse.json({ address: getLocalAddresses(phone) })
    }

    // 3. Map addresses to frontend state structure
    const mapped = (addressesData || []).map((addr: any) => ({
      id: addr.id,
      title: addr.title,
      details: addr.details,
      isDefault: addr.is_default
    }))

    return NextResponse.json({ address: mapped })
  } catch (err: any) {
    console.error('GET Address API Error (Network/DNS/Connection):', err.message || err)
    // Safe fallback on network failure
    return NextResponse.json({ address: getLocalAddresses(phone) })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const { phone, addresses } = body

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
  }

  if (!Array.isArray(addresses)) {
    return NextResponse.json({ error: 'Invalid addresses format' }, { status: 400 })
  }

  // Validate that address details are not empty
  for (const addr of addresses) {
    if (!addr.details || !addr.details.trim()) {
      return NextResponse.json({ error: 'Address details cannot be empty' }, { status: 400 })
    }
  }

  // Local Sync Helper if Supabase is unreachable/fails
  const processLocalFallback = () => {
    const local = getLocalAddresses(phone)
    const updated = addresses.map((addr: any) => {
      // Find matching local address or assign new local UUID
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      const id = (typeof addr.id === 'string' && uuidPattern.test(addr.id)) ? addr.id : randomUUID()
      return {
        id,
        title: addr.title || 'Home',
        details: addr.details,
        isDefault: !!addr.isDefault
      }
    })
    saveLocalAddresses(phone, updated)
    return updated
  }

  // Get Auth Token from Request headers
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

  const client = getSupabaseClient(token)
  if (!client) {
    // Safe fallback when Supabase is not configured
    console.log('[POST Address API]: Supabase not configured. Using local JSON store fallback.')
    return NextResponse.json({ success: true, addresses: processLocalFallback() })
  }

  try {
    // 1. Get User ID
    let userId: string | null = null
    if (token) {
      const { data: { user: authUser }, error: authError } = await client.auth.getUser()
      if (authUser) {
        userId = authUser.id
      }
      if (authError) {
        console.warn('[POST Address Auth warning]:', authError.message)
      }
    }

    // Fallback to query users table by phone if token wasn't resolved
    if (!userId) {
      const fallbackClient = getSupabaseClient(null)
      if (fallbackClient) {
        const { data: dbUser, error: dbError } = await fallbackClient
          .from('users')
          .select('id')
          .eq('phone', phone)
          .maybeSingle()

        if (dbUser) {
          userId = dbUser.id
        }
        if (dbError) {
          console.warn('[POST Address Users lookup warning]:', dbError.message)
        }
      }
    }

    if (!userId) {
      console.warn('[POST Address API]: User ID not found in database. Using local JSON store fallback.')
      return NextResponse.json({ success: true, addresses: processLocalFallback() })
    }

    const resolvedUserId = getUuid(userId)

    // 2. Perform Upsert to addresses table
    const upsertRows = addresses.map((addr: any) => ({
      // Only include id if it's a valid UUID string
      ...(typeof addr.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(addr.id) ? { id: addr.id } : {}),
      user_id: resolvedUserId,
      title: addr.title || 'Home',
      details: addr.details,
      is_default: !!addr.isDefault
    }))

    const { data: savedData, error: upsertError } = await client
      .from('addresses')
      .upsert(upsertRows, { onConflict: 'id' })
      .select()

    if (upsertError) {
      console.error('[POST Address Table Error]:', upsertError.message, upsertError.details)
      // Fallback on database error
      return NextResponse.json({ success: true, addresses: processLocalFallback() })
    }

    // 3. Map backend response back to client schema structure
    const mapped = (savedData || []).map((addr: any) => ({
      id: addr.id,
      title: addr.title,
      details: addr.details,
      isDefault: addr.is_default
    }))

    return NextResponse.json({ success: true, addresses: mapped })
  } catch (err: any) {
    console.error('POST Address API Error (Network/DNS/Connection):', err.message || err)
    // Safe fallback on network failure
    return NextResponse.json({ success: true, addresses: processLocalFallback() })
  }
}
