'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  Smartphone, 
  Home,
  CheckCircle,
  ShieldAlert,
  Info,
  Terminal
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const { user, setUser } = useStore()

  // Steps: 'phone' | 'otp'
  const [step, setStep] = useState<'phone' | 'otp'>('phone')

  // Form Fields
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [channel, setChannel] = useState<'sms' | 'whatsapp'>('sms')
  
  // Verification states
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']) // 6 digits for standard Supabase SMS
  const [devTestCode, setDevTestCode] = useState<string | null>(null) // Development test fallback code if Twilio returns gateway error
  
  // Progress states
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [diagnosticLog, setDiagnosticLog] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirectTo)
    }
  }, [user, router, redirectTo])

  // Get formatted E.164 phone number strictly formatted for India (+91)
  const getFormattedPhone = (rawPhone: string) => {
    const cleaned = rawPhone.replace(/\D/g, '')
    if (cleaned.length >= 10) {
      // Take the last 10 digits for Indian mobile numbers
      const last10 = cleaned.slice(-10)
      return `+91${last10}`
    }
    return `+${cleaned}`
  }

  // Trigger Sign Up / Login via Phone OTP
  const handleSendOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setDiagnosticLog(null)
    setDevTestCode(null)

    if (!phone) {
      setErrorMsg('Please enter your mobile number.')
      return
    }

    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.')
      return
    }

    const formattedPhone = getFormattedPhone(phone)
    setIsLoading(true)

    console.log('[Supabase Auth Diagnosis] Initiating SMS OTP request for:', formattedPhone)

    if (!isSupabaseConfigured() || !supabase) {
      const configErr = 'Supabase client configuration missing in .env.local. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      console.error('[Supabase Auth Diagnosis Error]', configErr)
      setErrorMsg(configErr)
      setIsLoading(false)
      return
    }

    try {
      // Direct high-reliability Twilio API call via server backend
      const apiRes = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, channel, name })
      })

      const apiData = await apiRes.json()

      if (!apiRes.ok || !apiData.success) {
        if (apiData.devCode) {
          setDevTestCode(apiData.devCode)
          setStep('otp')
          setOtpCode(apiData.devCode.split(''))
        }
        throw new Error(apiData.error || 'Failed to dispatch OTP')
      }

      setStep('otp')
      setOtpCode(['', '', '', '', '', ''])
      setSuccessMsg(`A 6-digit verification code has been dispatched via ${channel.toUpperCase()} to ${formattedPhone}. Please check your messages.`)
    } catch (err: any) {
      console.error('[Auth OTP Dispatch Error]', err)
      setErrorMsg(err.message || 'Failed to send OTP code.')
    } finally {
      setIsLoading(false)
    }
  }

  // Verify OTP & complete session setup
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    const enteredCode = otpCode.join('')

    if (enteredCode.length < 6) {
      setErrorMsg('Please enter the full 6-digit verification code.')
      return
    }

    const formattedPhone = getFormattedPhone(phone)
    setIsLoading(true)

    try {
      const apiRes = await fetch('/api/auth/send-otp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, code: enteredCode, name })
      })

      const apiData = await apiRes.json()

      if (!apiRes.ok || !apiData.success) {
        throw new Error(apiData.error || 'Invalid OTP code')
      }

      setSuccessMsg('Phone verified successfully! Logged in.')

      const loggedInUser = apiData.user || {
        id: `usr-${Math.floor(100000 + Math.random() * 900000)}`,
        name: name || 'Verified Customer',
        phone: formattedPhone,
        role: 'customer'
      }

      setUser({
        id: loggedInUser.id,
        name: loggedInUser.full_name || name || 'Verified Customer',
        phone: formattedPhone,
        email: loggedInUser.email || '',
        role: (loggedInUser.role || 'customer') as any
      })

      setTimeout(() => {
        if (loggedInUser.role === 'admin') {
          router.push('/admin')
        } else if (loggedInUser.role === 'vendor') {
          router.push('/vendor')
        } else {
          router.push(redirectTo)
        }
      }, 500)
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired verification code.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('')
      const newOtp = [...otpCode]
      pasted.forEach((char, i) => {
        newOtp[i] = char
      })
      setOtpCode(newOtp)
      return
    }

    const newOtp = [...otpCode]
    newOtp[index] = value
    setOtpCode(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-secondary selection:text-white">
      {/* Navbar Banner */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary/20">
            F
          </div>
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Fresh Delivery Hub
          </span>
        </Link>

        <Link 
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition-all hover:border-slate-700"
        >
          <Home className="w-3.5 h-3.5" /> Return Home
        </Link>
      </header>

      {/* Auth Main Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-6">
            {/* Ambient Lighting Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Header Title */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {step === 'phone' ? 'Mobile Sign In / Sign Up' : 'Enter SMS Verification Code'}
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step === 'phone'
                    ? 'Authentication powered by Supabase + Twilio SMS Gateway.'
                    : `We sent a 6-digit verification code to ${getFormattedPhone(phone)}`}
                </p>
              </div>

              {/* Status Alerts */}
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium space-y-2 animate-shake">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="font-bold">{errorMsg}</span>
                  </div>
                  {diagnosticLog && (
                    <div className="mt-2 p-3 bg-slate-950/80 rounded-xl border border-red-900/40 text-[10px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                      <div className="flex items-center gap-1 text-amber-400 font-bold mb-1">
                        <Terminal className="w-3 h-3" /> Diagnostic System Trace:
                      </div>
                      {diagnosticLog}
                    </div>
                  )}
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* STEP 1: Phone Number Input */}
              {step === 'phone' && (
                <form onSubmit={handleSendOtpSubmit} className="space-y-4">
                  
                  {/* Channel Selector */}
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setChannel('sms')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        channel === 'sms' ? 'bg-secondary text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      📱 SMS OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setChannel('whatsapp')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        channel === 'whatsapp' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      💬 WhatsApp OTP
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Full Name (Optional)</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-white text-xs py-3 pl-10 pr-4 rounded-xl outline-none focus:border-secondary transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Mobile Number (India +91)</label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number (e.g. 9876543210)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-white text-xs py-3 pl-10 pr-4 rounded-xl outline-none focus:border-secondary transition-all font-mono"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-secondary hover:bg-secondary/90 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Send Real SMS OTP Code <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                </form>
              )}

              {/* STEP 2: OTP Verification */}
              {step === 'otp' && (
                <form onSubmit={handleVerifyOtpSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block text-center">Enter 6-Digit SMS Code</label>
                    <div className="flex items-center justify-center gap-2">
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpInputChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-11 h-12 bg-slate-950 border border-slate-800 text-center text-lg font-black text-white font-mono rounded-xl outline-none focus:border-secondary transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Verify OTP & Access Account <ShieldCheck className="w-4 h-4" /></>}
                  </Button>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      className="text-slate-400 hover:text-white font-bold transition-colors"
                    >
                      Change Number
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtpSubmit}
                      className="text-secondary hover:underline font-bold"
                    >
                      Resend SMS OTP
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* Footer Banner */}
      <footer className="p-6 text-center text-xs text-slate-500 border-t border-slate-900">
        &copy; 2026 Fresh Delivery Hub. Connected to Supabase Authentication & Twilio SMS.
      </footer>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <AuthContent />
    </Suspense>
  )
}
