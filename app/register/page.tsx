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

  const roles = [
    { val: 'CORPORATIVO', label: 'Corporativo', desc: 'Gestioná tu red de proveedores' },
    { val: 'PROVEEDOR', label: 'Proveedor', desc: 'Financiá tus facturas' },
    { val: 'BANCO', label: 'Banco', desc: 'Aprobá solicitudes de crédito' },
  ]

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
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: -1, lineHeight: 1.1, marginBottom: 24 }}>La infraestructura<br/>que tu negocio<br/>necesita.</h2>
          <p style={{ fontSize: 13, color: '#606060', lineHeight: 1.8 }}>Tres roles. Una plataforma. Todo el ciclo de financiamiento de cadena de suministro.</p>
        </div>
        <div style={{ fontSize: 11, color: '#272727', letterSpacing: 1 }}>© 2026 SK. All rights reserved.</div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: '#000', letterSpacing: -1, marginBottom: 8 }}>Crear cuenta</h1>
          <p style={{ fontSize: 13, color: '#909090', marginBottom: 40 }}>Seleccioná tu tipo de cuenta para comenzar</p>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {error && <div style={{ background: '#FFF5F5', border: '1px solid #FFE0E0', color: '#CC0000', padding: '12px 16px', fontSize: 13 }}>{error}</div>}

            {/* Role selector */}
            <div>
              <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#909090', marginBottom: 12 }}>Tipo de cuenta</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {roles.map(r => (
                  <div key={r.val} onClick={() => setForm(f => ({ ...f, role: r.val }))}
                    style={{ padding: '16px 20px', border: form.role === r.val ? '1.5px solid #000' : '1px solid #E0E0E0', background: form.role === r.val ? '#000' : '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: form.role === r.val ? '#fff' : '#000', marginBottom: 2 }}>{r.label}</p>
                      <p style={{ fontSize: 11, color: form.role === r.val ? '#909090' : '#B0B0B0' }}>{r.desc}</p>
                    </div>
                    {form.role === r.val && <div style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%' }} />}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#909090', marginBottom: 8 }}>Empresa</label>
              <input type="text" required value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
                style={{ width: '100%', background: '#fff', border: '1px solid #E0E0E0', color: '#000', padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
                placeholder="Mi Empresa S.A." />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#909090', marginBottom: 8 }}>Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={{ width: '100%', background: '#fff', border: '1px solid #E0E0E0', color: '#000', padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
                placeholder="tu@empresa.com" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#909090', marginBottom: 8 }}>Contraseña</label>
              <input type="password" required minLength={6} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={{ width: '100%', background: '#fff', border: '1px solid #E0E0E0', color: '#000', padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
                placeholder="Mínimo 6 caracteres" />
            </div>

            <button type="submit" disabled={loading}
              style={{ background: loading ? '#E0E0E0' : '#000', color: loading ? '#909090' : '#fff', padding: '14px', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#909090' }}>
              ¿Ya tenés cuenta?{' '}
              <Link href="/login" style={{ color: '#000', textDecoration: 'none', fontWeight: 500 }}>Iniciá sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
