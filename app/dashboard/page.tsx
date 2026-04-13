'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const S = {
  page: { minHeight: '100vh', background: '#000', fontFamily: "'DM Sans', sans-serif", color: '#fff' },
  header: { borderBottom: '1px solid #1A1A1A', background: '#000', position: 'sticky' as const, top: 0, zIndex: 100 },
  headerInner: { maxWidth: 1200, margin: '0 auto', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { display: 'flex', alignItems: 'center', gap: 12 },
  logoBox: { width: 32, height: 32, border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 },
  logoName: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase' as const },
  nav: { display: 'flex', alignItems: 'center', gap: 32 },
  navLink: { fontSize: 11, color: '#606060', textDecoration: 'none', letterSpacing: 1.5, textTransform: 'uppercase' as const },
  main: { maxWidth: 1200, margin: '0 auto', padding: '60px 40px' },
  overline: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' as const, color: '#606060', marginBottom: 12 },
  h1: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: -1, marginBottom: 48 },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, border: '1px solid #1A1A1A', marginBottom: 48 },
  stat: { padding: '32px 28px', borderRight: '1px solid #1A1A1A', background: '#000' },
  statVal: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: -1, marginBottom: 6 },
  statLbl: { fontSize: 11, color: '#606060', letterSpacing: 1, textTransform: 'uppercase' as const },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, marginBottom: 48 },
  card: { padding: '36px 32px', border: '1px solid #1A1A1A', background: '#000', textDecoration: 'none', color: '#fff', display: 'block' },
  cardNum: { fontSize: 11, color: '#404040', letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 16, fontFamily: "'Syne', sans-serif" },
  cardTitle: { fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: -0.5, marginBottom: 8 },
  cardDesc: { fontSize: 13, color: '#606060', lineHeight: 1.7 },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' as const, color: '#404040', textAlign: 'left' as const, padding: '12px 0', borderBottom: '1px solid #1A1A1A' },
  td: { padding: '16px 0', borderBottom: '1px solid #0D0D0D', fontSize: 14, color: '#B8B8B8', verticalAlign: 'top' as const },
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [facturas, setFacturas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = window.location.origin + '/login'; return }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
      const { data: facts } = await supabase.from('facturas').select('*').order('created_at', { ascending: false }).limit(5)
      setFacturas(facts || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = window.location.origin + '/login'
  }

  if (loading) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#404040' }}>Loading...</p>
    </div>
  )

  const isCorporativo = profile?.role === 'CORPORATIVO'
  const isBanco = profile?.role === 'BANCO'
  const totalMonto = facturas.reduce((sum, f) => sum + (Number(f.monto) || 0), 0)
  const pendientes = facturas.filter(f => f.estado === 'PENDIENTE').length
  const aprobadas = facturas.filter(f => f.estado === 'APROBADA').length

  const stats = isBanco ? [
    { val: facturas.length.toString(), lbl: 'Total applications' },
    { val: pendientes.toString(), lbl: 'Pending review' },
    { val: aprobadas.toString(), lbl: 'Approved' },
    { val: `$${(totalMonto/1000).toFixed(0)}K`, lbl: 'Volume' },
  ] : isCorporativo ? [
    { val: pendientes.toString(), lbl: 'Pending invoices' },
    { val: aprobadas.toString(), lbl: 'Approved' },
    { val: `$${(totalMonto/1000).toFixed(0)}K`, lbl: 'Total volume' },
    { val: facturas.length.toString(), lbl: 'Total invoices' },
  ] : [
    { val: facturas.length.toString(), lbl: 'Invoices uploaded' },
    { val: pendientes.toString(), lbl: 'Pending' },
    { val: aprobadas.toString(), lbl: 'Approved' },
    { val: `$${(totalMonto/1000).toFixed(0)}K`, lbl: 'Total amount' },
  ]

  const modules = isBanco ? [
    { num: '01', title: 'Decision Engine', desc: 'Review and approve credit applications with full scoring breakdown.', href: '/banco' },
    { num: '02', title: 'Scoring Engine', desc: 'Evaluate new credit applications in real time.', href: '/scoring' },
  ] : isCorporativo ? [
    { num: '01', title: 'Invoice Pipeline', desc: 'Review and approve supplier invoices for financing.', href: '/facturas' },
    { num: '02', title: 'Scoring Engine', desc: 'Evaluate credit applications for your supplier network.', href: '/scoring' },
  ] : [
    { num: '01', title: 'Upload Invoice', desc: 'Submit a new invoice for financing. AI extracts data automatically.', href: '/facturas/nueva' },
    { num: '02', title: 'My Invoices', desc: 'Track the status of all your financing requests.', href: '/facturas' },
  ]

  return (
    <div style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <header style={S.header}>
        <div style={S.headerInner}>
          <div style={S.logo}>
            <div style={S.logoBox}>SK</div>
            <span style={S.logoName}>Supply Chain</span>
          </div>
          <nav style={S.nav}>
            <span style={{ fontSize: 11, color: '#404040', letterSpacing: 1 }}>{profile?.company_name}</span>
            <span style={{ fontSize: 11, letterSpacing: 1.5, border: '1px solid #272727', color: '#606060', padding: '4px 10px', textTransform: 'uppercase' }}>{profile?.role}</span>
            <button onClick={handleLogout} style={{ fontSize: 11, color: '#606060', letterSpacing: 1.5, textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Sign out</button>
          </nav>
        </div>
      </header>

      <main style={S.main}>
        <div style={S.overline}>Dashboard</div>
        <h1 style={S.h1}>
          {isBanco ? 'Bank Portal' : isCorporativo ? 'Corporate Hub' : 'Supplier Portal'}
        </h1>

        {/* Stats */}
        <div style={S.grid4}>
          {stats.map((s, i) => (
            <div key={s.lbl} style={{ ...S.stat, borderRight: i < 3 ? '1px solid #1A1A1A' : 'none' }}>
              <div style={S.statVal}>{s.val}</div>
              <div style={S.statLbl}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Modules */}
        <div style={{ ...S.grid2, gridTemplateColumns: modules.length === 2 ? '1fr 1fr' : '1fr 1fr' }}>
          {modules.map(m => (
            <Link key={m.num} href={m.href} style={S.card}>
              <div style={S.cardNum}>{m.num} —</div>
              <div style={S.cardTitle}>{m.title}</div>
              <div style={S.cardDesc}>{m.desc}</div>
              <div style={{ marginTop: 24, fontSize: 11, color: '#404040', letterSpacing: 1.5, textTransform: 'uppercase' }}>Open →</div>
            </Link>
          ))}
        </div>

        {/* Recent invoices */}
        <div style={{ borderTop: '1px solid #1A1A1A', paddingTop: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
            <div style={S.overline}>Recent activity</div>
            <Link href="/facturas" style={{ fontSize: 11, color: '#404040', letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'none' }}>View all →</Link>
          </div>

          {facturas.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#404040' }}>No activity yet.</p>
              {!isBanco && !isCorporativo && (
                <Link href="/facturas/nueva" style={{ display: 'inline-block', marginTop: 16, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#fff', border: '1px solid #404040', padding: '10px 24px', textDecoration: 'none' }}>Upload first invoice</Link>
              )}
            </div>
          ) : (
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Invoice</th>
                  <th style={S.th}>Issuer</th>
                  <th style={S.th}>Amount</th>
                  <th style={S.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map(f => (
                  <tr key={f.id}>
                    <td style={{ ...S.td, color: '#fff', fontFamily: "'Syne', sans-serif" }}>{f.numero_factura}</td>
                    <td style={S.td}>{f.emisor}</td>
                    <td style={{ ...S.td, fontFamily: 'monospace' }}>{f.moneda} {Number(f.monto).toLocaleString()}</td>
                    <td style={S.td}>
                      <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: f.estado === 'PENDIENTE' ? '#606060' : f.estado === 'APROBADA' ? '#B8B8B8' : '#404040', border: '1px solid #272727', padding: '3px 8px' }}>{f.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
