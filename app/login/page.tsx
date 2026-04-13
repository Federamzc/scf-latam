'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Invalid credentials'); setLoading(false) }
    else window.location.href = window.location.origin + '/dashboard'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ width: 40, height: 40, border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, margin: '0 auto 24px' }}>SK</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: '#606060' }}>Sign in to your SK account</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div style={{ border: '1px solid #404040', color: '#909090', padding: '12px 16px', fontSize: 13 }}>{error}</div>}

          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#606060', marginBottom: 8 }}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', background: '#0D0D0D', border: '1px solid #272727', color: '#fff', padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
              placeholder="you@company.com" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#606060', marginBottom: 8 }}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', background: '#0D0D0D', border: '1px solid #272727', color: '#fff', padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
              placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            style={{ background: loading ? '#272727' : '#fff', color: '#000', padding: '14px', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', border: 'none', cursor: 'pointer', marginTop: 8, fontFamily: "'DM Sans', sans-serif" }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#606060', marginTop: 8 }}>
            No account?{' '}
            <Link href="/register" style={{ color: '#B8B8B8', textDecoration: 'none' }}>Request access</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
