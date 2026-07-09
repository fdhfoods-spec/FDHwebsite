import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json({ data: db.products })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const db = readDb()
    
    // Check if bulk insert (array) or single
    if (Array.isArray(payload)) {
      payload.forEach(item => {
        if (!db.products.find(p => String(p.id) === String(item.id))) {
          db.products.push(item)
        }
      })
      writeDb(db)
      return NextResponse.json({ data: payload })
    } else {
      if (!db.products.find(p => String(p.id) === String(payload.id))) {
        db.products.push(payload)
      } else {
        // Update existing if ID match
        const index = db.products.findIndex(p => String(p.id) === String(payload.id))
        db.products[index] = { ...db.products[index], ...payload }
      }
      writeDb(db)
      return NextResponse.json({ data: [payload] })
    }
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
    
    const db = readDb()
    const index = db.products.findIndex(p => String(p.id) === String(productId))
    
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...updatedFields }
      writeDb(db)
      return NextResponse.json({ data: [db.products[index]] })
    } else {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawId = searchParams.get('id')
    
    // Strict validation for missing, undefined, null, or empty string
    if (!rawId || rawId === 'undefined' || rawId === 'null' || rawId.trim() === '') {
      return NextResponse.json({ error: 'Invalid or missing product ID' }, { status: 400 })
    }
    
    // Check if it's a valid numeric ID or UUID format
    const isNumeric = !isNaN(Number(rawId))
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId)
    
    if (!isNumeric && !isUUID) {
      return NextResponse.json({ error: 'Malformed product ID format' }, { status: 400 })
    }
    
    const db = readDb()
    
    // Fetch/lookup the product first to confirm it exists
    const foundProduct = db.products.find(p => String(p.id) === rawId)
    
    if (!foundProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Product exists, now attempt deletion
    try {
      const index = db.products.findIndex(p => String(p.id) === rawId)
      db.products.splice(index, 1)
      writeDb(db)
      return NextResponse.json({ success: true, deletedId: foundProduct.id })
    } catch (dbError: any) {
      return NextResponse.json({ error: `Database deletion failed: ${dbError.message || dbError}` }, { status: 500 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
