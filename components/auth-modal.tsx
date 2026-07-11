'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  Smartphone, 
  CheckCircle,
  ShieldAlert,
  Terminal,
  X
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export function AuthModal() {
  const router = useRouter()
  const { isAuthModalOpen, setAuthModalOpen, user, setUser } = useStore()
  const modalRef = useRef<HTMLDivElement>(null)

  // Steps: 'phone' | 'otp'
  const [step, setStep] = useState<'phone' | 'otp'>('phone')

  // Form Fields
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [channel, setChannel] = useState<'sms' | 'whatsapp'>('sms')
  
  // Verification states
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']) // 6 digits for standard Supabase SMS
  const [devTestCode, setDevTestCode] = useState<string | null>(null) // Development test fallback code
  
  // Progress states
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Reset states when modal is opened/closed
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('phone')
      setName('')
      setPhone('')
      setChannel('sms')
      setOtpCode(['', '', '', '', '', ''])
      setDevTestCode(null)
      setErrorMsg('')
      setSuccessMsg('')
    }
  }, [isAuthModalOpen])

  // Get formatted E.164 phone number strictly formatted for India (+91)
  const getFormattedPhone = (rawPhone: string) => {
    const cleaned = rawPhone.replace(/\D/g, '')
    if (cleaned.length >= 10) {
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

    try {
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
        name: name || '',
        phone: formattedPhone,
        role: 'customer'
      }

      setUser({
        id: loggedInUser.id,
        name: loggedInUser.full_name || name || '',
        phone: formattedPhone,
        email: loggedInUser.email || '',
        role: (loggedInUser.role || 'customer') as any
      })

      setTimeout(() => {
        setAuthModalOpen(false)
        if (loggedInUser.role === 'admin') {
          router.push('/admin')
        } else if (loggedInUser.role === 'vendor') {
          router.push('/vendor')
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
      const nextInput = document.getElementById(`modal-otp-input-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`modal-otp-input-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setAuthModalOpen(false)
    }
  }

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOutsideClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-md bg-white/90 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-6"
          >
            {/* Close Button */}
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-foreground/45 hover:text-foreground/80 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
              title="Close popup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 space-y-6">
              {/* Header Title */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-foreground tracking-tight">
                  {step === 'phone' ? 'Sign In / Sign Up' : 'Enter SMS Verification Code'}
                </h2>
                {step === 'otp' && (
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    We sent a 6-digit verification code to {getFormattedPhone(phone)}
                  </p>
                )}
              </div>

              {/* Status Alerts */}
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium space-y-2">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span className="font-bold">{errorMsg}</span>
                  </div>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-medium flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* STEP 1: Phone Number Input */}
              {step === 'phone' && (
                <form onSubmit={handleSendOtpSubmit} className="space-y-4">
                  
                  {/* Channel Selector */}
                  <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setChannel('sms')}
                      className="flex-1 py-2 text-xs font-bold rounded-lg transition-all bg-secondary text-white shadow-sm"
                    >
                      📱 SMS OTP
                    </button>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-foreground/50 block">Mobile Number (India +91)</label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-foreground/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number (e.g. 9876543210)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-foreground text-xs py-3 pl-10 pr-4 rounded-xl outline-none focus:border-secondary transition-all font-mono font-medium"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>SEND OTP <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                </form>
              )}

              {/* STEP 2: OTP Verification */}
              {step === 'otp' && (
                <form onSubmit={handleVerifyOtpSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-foreground/50 block text-center">Enter 6-Digit SMS Code</label>
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`modal-otp-input-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpInputChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-9 h-10 sm:w-11 sm:h-12 bg-gray-50 border border-gray-200 text-center text-base sm:text-lg font-black text-foreground font-mono rounded-xl outline-none focus:border-secondary transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Verify OTP & Access Account <ShieldCheck className="w-4 h-4" /></>}
                  </Button>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      className="text-foreground/60 hover:text-foreground font-bold transition-colors"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
