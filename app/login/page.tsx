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
    if (error) { setError('Credenciales incorrectas'); setLoading(false) }
    else window.location.href = window.location.origin + '/dashboard'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F3', display: 'flex', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      {/* Left panel */}
      <div style={{ width: 480, background: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 48, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>SK</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: '#fff' }}>Supply Chain</span>
        </div>
        <div>
          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#404040', marginBottom: 24 }}>Credit Infrastructure · LATAM</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: -1, lineHeight: 1.1, marginBottom: 24 }}>Capital moves<br/>when you decide.</h2>
          <p style={{ fontSize: 13, color: '#606060', lineHeight: 1.8 }}>Infraestructura de crédito para LATAM. Conectá una vez. Desplegá en seis mercados.</p>
        </div>
        <div style={{ fontSize: 11, color: '#272727', letterSpacing: 1 }}>© 2026 SK. All rights reserved.</div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: '#000', letterSpacing: -1, marginBottom: 8 }}>Bienvenido</h1>
          <p style={{ fontSize: 13, color: '#909090', marginBottom: 40 }}>Iniciá sesión en tu cuenta SK</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {error && <div style={{ background: '#FFF5F5', border: '1px solid #FFE0E0', color: '#CC0000', padding: '12px 16px', fontSize: 13 }}>{error}</div>}

            <div>
              <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#909090', marginBottom: 8 }}>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', background: '#fff', border: '1px solid #E0E0E0', color: '#000', padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
                placeholder="tu@empresa.com" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#909090', marginBottom: 8 }}>Contraseña</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', background: '#fff', border: '1px solid #E0E0E0', color: '#000', padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
                placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading}
              style={{ background: loading ? '#E0E0E0' : '#000', color: loading ? '#909090' : '#fff', padding: '14px', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#909090' }}>
              ¿No tenés cuenta?{' '}
              <Link href="/register" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Registrate</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
