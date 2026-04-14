'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', company_name: '', role: 'PROVEEDOR' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { role: form.role, company_name: form.company_name } }
    })
    if (error) { setError(error.message); setLoading(false) }
    else window.location.href = window.location.origin + '/dashboard'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ width: 40, height: 40, border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, margin: '0 auto 24px' }}>SK</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: -1, marginBottom: 8 }}>Request Access</h1>
          <p style={{ fontSize: 13, color: '#606060' }}>Join SK's credit infrastructure platform</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div style={{ border: '1px solid #404040', color: '#909090', padding: '12px 16px', fontSize: 13 }}>{error}</div>}

          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#606060', marginBottom: 8 }}>Account type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { val: 'CORPORATIVO', label: 'Corporate' },
                { val: 'PROVEEDOR', label: 'Supplier' },
                { val: 'BANCO', label: 'Bank' },
              ].map(r => (
                <button key={r.val} type="button" onClick={() => setForm(f => ({ ...f, role: r.val }))}
                  style={{ padding: '10px 8px', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', border: form.role === r.val ? '1px solid #fff' : '1px solid #272727', background: form.role === r.val ? '#fff' : 'transparent', color: form.role === r.val ? '#000' : '#606060', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#606060', marginBottom: 8 }}>Company name</label>
            <input type="text" required value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
              style={{ width: '100%', background: '#0D0D0D', border: '1px solid #272727', color: '#fff', padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
              placeholder="Grupo Industrial S.A." />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#606060', marginBottom: 8 }}>Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              style={{ width: '100%', background: '#0D0D0D', border: '1px solid #272727', color: '#fff', padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
              placeholder="you@company.com" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#606060', marginBottom: 8 }}>Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              style={{ width: '100%', background: '#0D0D0D', border: '1px solid #272727', color: '#fff', padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
              placeholder="Min. 6 characters" />
          </div>

          <button type="submit" disabled={loading}
            style={{ background: loading ? '#272727' : '#fff', color: '#000', padding: '14px', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', border: 'none', cursor: 'pointer', marginTop: 8, fontFamily: "'DM Sans', sans-serif" }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#606060', marginTop: 8 }}>
            Already have access?{' '}
            <Link href="/login" style={{ color: '#B8B8B8', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
