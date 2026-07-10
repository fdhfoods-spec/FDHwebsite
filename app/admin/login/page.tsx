'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, User, RefreshCw, ShieldAlert, Home, ShieldCheck, ArrowRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

export default function AdminLoginPage() {
  const router = useRouter()
  const { user, setUser, isAuthLoading } = useStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!isAuthLoading && user && user.role === 'admin') {
      router.push('/admin')
    }
  }, [user, isAuthLoading, router])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!username || !password) {
      setErrorMsg('Please enter both username and password.')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid username or password')
      }

      // Set global state and persist admin session
      setUser(data.user)

      if (typeof window !== 'undefined') {
        localStorage.setItem('fdh_admin_session', JSON.stringify(data.user))
      }

      router.push('/admin')
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid username or password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-secondary animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Loading Admin Portal Security...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-secondary selection:text-white relative overflow-hidden">
      {/* Background Lighting Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary/20">
            F
          </div>
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Fresh Direct Home
          </span>
        </Link>

        <Link 
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition-all hover:border-slate-700"
        >
          <Home className="w-3.5 h-3.5" /> Customer Portal
        </Link>
      </header>

      {/* Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg mx-auto mb-3">
                FDH
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">Admin Portal Access</h1>
              <p className="text-xs text-slate-400">Enter secure administrative credentials to unlock control center.</p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2.5 animate-shake">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter username (e.g. admin)"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      if (errorMsg) setErrorMsg('')
                    }}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs py-3.5 pl-10 pr-4 rounded-xl outline-none focus:border-secondary transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errorMsg) setErrorMsg('')
                    }}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs py-3.5 pl-10 pr-4 rounded-xl outline-none focus:border-secondary transition-all font-medium"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Authenticate Admin Account <ArrowRight className="w-4 h-4" /></>}
              </Button>
            </form>

            <div className="text-center pt-2 border-t border-slate-800/60">
              <p className="text-[10px] text-slate-500 font-mono">Secured by FDH Administrative Gatekeeper</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 border-t border-slate-900 relative z-10">
        &copy; 2026 Fresh Direct Home. Internal Administrative System.
      </footer>
    </div>
  )
}
