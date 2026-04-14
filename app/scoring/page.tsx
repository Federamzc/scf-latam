'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const SK = {
  page: { minHeight: '100vh', background: '#000', fontFamily: "'DM Sans', sans-serif", color: '#fff' },
  header: { borderBottom: '1px solid #1A1A1A', background: '#000', position: 'sticky' as const, top: 0, zIndex: 100 },
  headerInner: { maxWidth: 1200, margin: '0 auto', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { display: 'flex', alignItems: 'center', gap: 12 },
  logoBox: { width: 32, height: 32, border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 },
  main: { maxWidth: 1200, margin: '0 auto', padding: '60px 40px' },
  overline: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' as const, color: '#606060', marginBottom: 12 },
  h1: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: -1, marginBottom: 8, color: '#fff' },
  label: { display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' as const, color: '#606060', marginBottom: 8 },
  input: { width: '100%', background: '#0D0D0D', border: '1px solid #272727', color: '#fff', padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" },
  btn: { background: '#fff', color: '#000', padding: '14px', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' as const, border: 'none', cursor: 'pointer', width: '100%', fontFamily: "'DM Sans', sans-serif" },
  card: { border: '1px solid #1A1A1A', padding: '32px', background: '#000' },
}

export default function ScoringPage() {
  const [form, setForm] = useState({ company_name: '', tax_id: '', annual_revenue: '', years_in_business: '', existing_debt: '', requested_amount: '', payment_history_score: '80' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')
      const { data: app, error: appError } = await supabase.from('credit_applications').insert({
        company_name: form.company_name, tax_id: form.tax_id,
        annual_revenue: Number(form.annual_revenue), years_in_business: Number(form.years_in_business),
        existing_debt: Number(form.existing_debt) || 0, requested_amount: Number(form.requested_amount),
        payment_history_score: Number(form.payment_history_score), applicant_id: user.id
      }).select().single()
      if (appError) throw new Error(appError.message)
      const response = await fetch('/api/scoring/evaluate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ application_id: app.id }) })
      const scoring = await response.json()
      setResult({ ...scoring, company_name: form.company_name })
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const getColor = (rec: string) => rec === 'APPROVE' ? '#fff' : rec === 'REVIEW' ? '#909090' : '#404040'
  const getLabel = (rec: string) => rec === 'APPROVE' ? 'APROBAR' : rec === 'REVIEW' ? 'REVISAR' : 'RECHAZAR'

  return (
    <div style={SK.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      <header style={SK.header}>
        <div style={SK.headerInner}>
          <div style={SK.logo}>
            <div style={SK.logoBox}>SK</div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase' }}>Motor de Scoring</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/banco" style={{ fontSize: 11, color: '#606060', textDecoration: 'none', letterSpacing: 1.5, textTransform: 'uppercase' }}>Portal Banco</Link>
            <Link href="/dashboard" style={{ fontSize: 11, color: '#606060', textDecoration: 'none', letterSpacing: 1.5, textTransform: 'uppercase' }}>Dashboard</Link>
          </div>
        </div>
      </header>

      <main style={SK.main}>
        <div style={SK.overline}>Sprint 1 — Scoring Engine</div>
        <h1 style={SK.h1}>Evaluación crediticia</h1>
        <p style={{ fontSize: 14, color: '#606060', marginBottom: 48 }}>Motor de reglas en tiempo real · 4 variables · respuesta en menos de 500ms</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {/* Formulario */}
          <div style={{ ...SK.card, borderRight: 'none' }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#404040', marginBottom: 28, fontFamily: "'Syne', sans-serif" }}>01 — Nueva solicitud</div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {error && <div style={{ border: '1px solid #272727', color: '#606060', padding: '12px 16px', fontSize: 13 }}>{error}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={SK.label}>Empresa</label>
                  <input type="text" required value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} style={SK.input} placeholder="Grupo Industrial S.A." />
                </div>
                <div>
                  <label style={SK.label}>RFC / Tax ID</label>
                  <input type="text" value={form.tax_id} onChange={e => setForm(f => ({ ...f, tax_id: e.target.value }))} style={SK.input} placeholder="GIS123456ABC" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={SK.label}>Ingresos anuales (USD)</label>
                  <input type="number" required value={form.annual_revenue} onChange={e => setForm(f => ({ ...f, annual_revenue: e.target.value }))} style={SK.input} placeholder="5000000" />
                </div>
                <div>
                  <label style={SK.label}>Monto solicitado (USD)</label>
                  <input type="number" required value={form.requested_amount} onChange={e => setForm(f => ({ ...f, requested_amount: e.target.value }))} style={SK.input} placeholder="500000" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={SK.label}>Deuda existente (USD)</label>
                  <input type="number" value={form.existing_debt} onChange={e => setForm(f => ({ ...f, existing_debt: e.target.value }))} style={SK.input} placeholder="100000" />
                </div>
                <div>
                  <label style={SK.label}>Años en operación</label>
                  <input type="number" required value={form.years_in_business} onChange={e => setForm(f => ({ ...f, years_in_business: e.target.value }))} style={SK.input} placeholder="7" />
                </div>
              </div>
              <div>
                <label style={SK.label}>Historial de pagos — <span style={{ color: '#fff' }}>{form.payment_history_score}/100</span></label>
                <input type="range" min="0" max="100" value={form.payment_history_score} onChange={e => setForm(f => ({ ...f, payment_history_score: e.target.value }))} style={{ width: '100%', accentColor: '#fff' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#404040', marginTop: 4 }}>
                  <span>Malo (0)</span><span>Excelente (100)</span>
                </div>
              </div>
              <button type="submit" disabled={loading} style={{ ...SK.btn, background: loading ? '#1A1A1A' : '#fff', color: loading ? '#606060' : '#000' }}>
                {loading ? 'Evaluando...' : 'Evaluar solicitud'}
              </button>
            </form>
          </div>

          {/* Resultado */}
          <div style={SK.card}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#404040', marginBottom: 28, fontFamily: "'Syne', sans-serif" }}>02 — Resultado</div>

            {!result && !loading && (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#272727' }}>Completá el formulario</div>
              </div>
            )}

            {loading && (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#404040' }}>Procesando...</div>
              </div>
            )}

            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: '#404040', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{result.company_name}</p>
                  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r="60" fill="none" stroke="#1A1A1A" strokeWidth="8"/>
                      <circle cx="80" cy="80" r="60" fill="none" stroke={getColor(result.recommendation)} strokeWidth="8"
                        strokeDasharray={`${(result.score / 100) * 376} 376`} strokeLinecap="round" transform="rotate(-90 80 80)"/>
                    </svg>
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{result.score}</div>
                      <div style={{ fontSize: 11, color: '#404040' }}>/100</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', border: '1px solid #272727', padding: '6px 16px', color: getColor(result.recommendation) }}>
                      {getLabel(result.recommendation)}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: '#272727', marginTop: 12, letterSpacing: 1 }}>{result.processing_time_ms}ms</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {Object.values(result.breakdown as Record<string, any>).map((item: any) => (
                    <div key={item.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 8 }}>
                        <span style={{ color: '#606060', letterSpacing: 1, textTransform: 'uppercase' }}>{item.label}</span>
                        <span style={{ color: '#fff', fontFamily: 'monospace' }}>{item.score}/{item.max}</span>
                      </div>
                      <div style={{ width: '100%', background: '#0D0D0D', height: 2 }}>
                        <div style={{ height: 2, background: getColor(result.recommendation), width: `${(item.score / item.max) * 100}%`, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #1A1A1A', paddingTop: 24 }}>
                  <Link href="/banco" style={{ display: 'block', textAlign: 'center', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#606060', textDecoration: 'none', border: '1px solid #272727', padding: '12px' }}>
                    Ver en portal banco →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
