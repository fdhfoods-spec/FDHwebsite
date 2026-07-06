import { createClient } from '@supabase/supabase-js'
const { NextResponse } = require('next/server')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const getAdminSupabase = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
}

export async function POST(request: Request) {
  try {
    const productPayload = await request.json()
    const supabaseAdmin = getAdminSupabase()
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([productPayload])
      .select()
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { productId, updatedFields } = await request.json()
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }
    
    const supabaseAdmin = getAdminSupabase()
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updatedFields)
      .eq('id', productId)
      .select()
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }
    
    const supabaseAdmin = getAdminSupabase()
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId)
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
