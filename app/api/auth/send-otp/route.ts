import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Memory store for serverless demo tokens (phone -> { code, expiresAt })
const otpStore = new Map<string, { code: string; expiresAt: number }>()

export async function POST(request: Request) {
  try {
    const { phone, channel, name } = await request.json()

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 })
    }

    // Clean phone to E.164
    const cleaned = phone.replace(/\D/g, '')
    const formattedPhone = cleaned.length >= 10 ? `+91${cleaned.slice(-10)}` : `+${cleaned}`

    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    otpStore.set(formattedPhone, { code, expiresAt: Date.now() + 10 * 60 * 1000 })

    const accountSid = process.env.TWILIO_ACCOUNT_SID || ''
    const authToken = process.env.TWILIO_AUTH_TOKEN || ''
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER || ''
    const twilioWhatsapp = process.env.TWILIO_WHATSAPP_NUMBER || ''

    const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64')
    const isWhatsapp = channel === 'whatsapp'

    const fromNumber = isWhatsapp ? `whatsapp:${twilioWhatsapp}` : twilioPhone
    const toNumber = isWhatsapp ? `whatsapp:${formattedPhone}` : formattedPhone
    const messageBody = `Your Fresh Delivery Hub verification code is: ${code}`

    const twilioParams = new URLSearchParams({
      From: fromNumber,
      To: toNumber,
      Body: messageBody
    })

    const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: twilioParams
    })

    const twilioData = await twilioRes.json()

    if (!twilioRes.ok) {
      console.warn('[Direct Twilio API Error]', twilioData)
      let friendlyError = twilioData.message || 'Failed to dispatch SMS via Twilio.'
      if (twilioData.code === 21608) {
        friendlyError = `Twilio Trial Account Restriction: ${formattedPhone} is unverified in Twilio Console. Add it under Verified Caller IDs or try WhatsApp OTP!`
      }
      return NextResponse.json({
        success: false,
        error: friendlyError,
        code: twilioData.code,
        devCode: code // Provide devCode so local test is never blocked
      }, { status: 200 })
    }

    return NextResponse.json({
      success: true,
      message: `Verification code dispatched via ${isWhatsapp ? 'WhatsApp' : 'SMS'} to ${formattedPhone}`,
      sid: twilioData.sid
    })
  } catch (err: any) {
    console.error('[Send OTP API Server Error]', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  // Verification endpoint
  try {
    const { phone, code, name } = await request.json()

    const cleaned = phone.replace(/\D/g, '')
    const formattedPhone = cleaned.length >= 10 ? `+91${cleaned.slice(-10)}` : `+${cleaned}`

    const storedData = otpStore.get(formattedPhone)

    // Allow 123456 or exact code
    const isValidCode = (storedData && storedData.code === code) || code === '123456'

    if (!isValidCode) {
      return NextResponse.json({ error: 'Invalid or expired verification code. Please try again.' }, { status: 400 })
    }

    // Success - clear OTP
    otpStore.delete(formattedPhone)

    // Designated admin numbers for quick testing
    const isAdminNumber = formattedPhone.includes('8525016352') || formattedPhone.includes('9876543210') || (name && name.toLowerCase().includes('admin'))
    const defaultRole = isAdminNumber ? 'admin' : 'customer'

    // Upsert DB user if Supabase is configured
    let userRecord: any = {
      id: `usr-${Math.floor(100000 + Math.random() * 900000)}`,
      phone: formattedPhone,
      full_name: name || (isAdminNumber ? 'Super Administrator' : 'Verified Customer'),
      role: defaultRole
    }

    if (supabase) {
      try {
        // First check if user exists in DB to preserve existing role
        const { data: existingDbUser } = await supabase
          .from('users')
          .select('*')
          .eq('phone', formattedPhone)
          .maybeSingle()

        const assignedRole = existingDbUser?.role || defaultRole
        const assignedName = existingDbUser?.full_name || name || (isAdminNumber ? 'Super Administrator' : 'Verified Customer')

        const { data: dbUser } = await supabase
          .from('users')
          .upsert([{
            phone: formattedPhone,
            full_name: assignedName,
            role: assignedRole,
            last_login: new Date().toISOString()
          }], { onConflict: 'phone' })
          .select('*')
          .single()

        if (dbUser) {
          userRecord = dbUser
        }
      } catch (e) {
        console.warn('[DB Upsert Warning]', e)
      }
    }

    return NextResponse.json({
      success: true,
      user: userRecord
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
