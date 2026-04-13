'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function BancoPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [decision, setDecision] = useState({ approved_amount: '', interest_rate: '', term_months: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0, volume: 0 })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: apps } = await supabase
      .from('credit_applications')
      .select('*, scoring_results(*), bank_decisions(*)')
      .order('created_at', { ascending: false })

    const list = apps || []
    setApplications(list)

    const approved = list.filter(a => a.bank_decisions?.length > 0 && a.bank_decisions[0].decision === 'APPROVED')
    const rejected = list.filter(a => a.bank_decisions?.length > 0 && a.bank_decisions[0].decision === 'REJECTED')
    const pending = list.filter(a => !a.bank_decisions?.length)
    const volume = approved.reduce((sum: number, a: any) => sum + (a.bank_decisions[0].approved_amount || 0), 0)

    setStats({ total: list.length, approved: approved.length, rejected: rejected.length, pending: pending.length, volume })
    setLoading(false)
  }

  async function handleDecision(dec: string) {
    if (!selected) return
    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('bank_decisions').insert({
      application_id: selected.id,
      bank_user_id: user?.id,
      decision: dec,
      approved_amount: dec === 'APPROVED' ? Number(decision.approved_amount) || selected.requested_amount : null,
      interest_rate: Number(decision.interest_rate) || null,
      term_months: Number(decision.term_months) || null,
      notes: decision.notes || null
    })

    if (dec === 'APPROVED') {
      await supabase.from('credit_lines').insert({
        company_id: selected.applicant_id,
        application_id: selected.id,
        total_limit: Number(decision.approved_amount) || selected.requested_amount,
        available_limit: Number(decision.approved_amount) || selected.requested_amount,
        interest_rate: Number(decision.interest_rate) || null,
        term_months: Number(decision.term_months) || null
      })
    }

    await supabase.from('credit_applications').update({
      status: dec === 'APPROVED' ? 'APPROVED' : 'REJECTED'
    }).eq('id', selected.id)

    setSelected(null)
    setDecision({ approved_amount: '', interest_rate: '', term_months: '', notes: '' })
    await loadData()
    setSubmitting(false)
  }

  const getScoreColor = (score: number) =>
    score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444'

  const getStatusBadge = (app: any) => {
    if (!app.bank_decisions?.length) return { label: 'PENDIENTE', color: '#f59e0b', bg: '#f59e0b20' }
    const dec = app.bank_decisions[0].decision
    if (dec === 'APPROVED') return { label: 'APROBADO', color: '#10b981', bg: '#10b98120' }
    if (dec === 'REJECTED') return { label: 'RECHAZADO', color: '#ef4444', bg: '#ef444420' }
    return { label: 'MÁS INFO', color: '#3b82f6', bg: '#3b82f620' }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-white">Cargando portal...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-sm">🏦</div>
            <div>
              <p className="text-white font-semibold text-sm">Portal Banco</p>
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">DECISION ENGINE</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/scoring" className="text-slate-400 hover:text-white text-sm transition-colors">Scoring →</Link>
            <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboard →</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total solicitudes', value: stats.total, icon: '📋' },
            { label: 'Pendientes', value: stats.pending, icon: '⏳' },
            { label: 'Aprobadas', value: stats.approved, icon: '✅' },
            { label: 'Rechazadas', value: stats.rejected, icon: '❌' },
            { label: 'Volumen aprobado', value: `$${(stats.volume/1000).toFixed(0)}K`, icon: '💰' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xl mb-1">{s.icon}</div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Pipeline */}
          <div>
            <h2 className="text-white font-semibold mb-4">Pipeline de solicitudes</h2>
            <div className="space-y-3">
              {applications.length === 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                  <p className="text-slate-400">No hay solicitudes aún</p>
                  <Link href="/scoring" className="inline-block mt-3 text-blue-400 hover:text-blue-300 text-sm">
                    Crear primera solicitud →
                  </Link>
                </div>
              )}
              {applications.map(app => {
                const score = app.scoring_results?.[0]?.total_score
                const badge = getStatusBadge(app)
                const isSelected = selected?.id === app.id
                return (
                  <div key={app.id}
                    onClick={() => !app.bank_decisions?.length && setSelected(isSelected ? null : app)}
                    className={`bg-slate-900 border rounded-xl p-4 transition-all ${
                      isSelected ? 'border-blue-500' :
                      app.bank_decisions?.length ? 'border-slate-800 opacity-60' :
                      'border-slate-800 hover:border-slate-600 cursor-pointer'
                    }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-medium text-sm">{app.company_name}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: badge.bg, color: badge.color }}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>RFC: {app.tax_id || 'N/A'}</span>
                          <span>Solicita: ${Number(app.requested_amount).toLocaleString()}</span>
                        </div>
                      </div>
                      {score !== undefined && (
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold" style={{ color: getScoreColor(score) }}>{score}</p>
                          <p className="text-xs text-slate-500">score</p>
                        </div>
                      )}
                    </div>
                    {score === undefined && (
                      <p className="text-xs text-amber-400 mt-2">⚠ Sin score — ir a Scoring Engine primero</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Decision panel */}
          <div>
            <h2 className="text-white font-semibold mb-4">Panel de decisión</h2>
            {!selected ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
                <div className="text-5xl mb-3">🏦</div>
                <p className="text-slate-400 text-sm">Seleccioná una solicitud pendiente para decidir</p>
              </div>
            ) : (
              <div className="bg-slate-900 border border-blue-500/30 rounded-xl p-6 space-y-5">
                <div>
                  <h3 className="text-white font-semibold text-lg">{selected.company_name}</h3>
                  <p className="text-slate-400 text-sm">{selected.tax_id}</p>
                </div>

                {/* Score breakdown */}
                {selected.scoring_results?.[0] && (
                  <div className="bg-slate-800 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-white text-sm font-medium">Score crediticio</p>
                      <p className="text-2xl font-bold" style={{ color: getScoreColor(selected.scoring_results[0].total_score) }}>
                        {selected.scoring_results[0].total_score}/100
                      </p>
                    </div>
                    {[
                      { label: 'Ingresos vs monto', score: selected.scoring_results[0].revenue_score, max: 40 },
                      { label: 'Ratio deuda', score: selected.scoring_results[0].debt_ratio_score, max: 25 },
                      { label: 'Historial pagos', score: selected.scoring_results[0].payment_history_score, max: 25 },
                      { label: 'Años operación', score: selected.scoring_results[0].seniority_score, max: 10 },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">{item.label}</span>
                          <span className="text-white">{item.score}/{item.max}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full"
                            style={{
                              width: `${(item.score / item.max) * 100}%`,
                              backgroundColor: getScoreColor(selected.scoring_results[0].total_score)
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Decision form */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 text-xs font-medium mb-1">Monto aprobado (USD)</label>
                      <input type="number" value={decision.approved_amount}
                        onChange={e => setDecision(d => ({ ...d, approved_amount: e.target.value }))}
                        placeholder={selected.requested_amount}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-xs font-medium mb-1">Tasa anual (%)</label>
                      <input type="number" value={decision.interest_rate}
                        onChange={e => setDecision(d => ({ ...d, interest_rate: e.target.value }))}
                        placeholder="12.5"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 text-xs font-medium mb-1">Plazo (meses)</label>
                    <input type="number" value={decision.term_months}
                      onChange={e => setDecision(d => ({ ...d, term_months: e.target.value }))}
                      placeholder="12"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-xs font-medium mb-1">Notas internas</label>
                    <textarea value={decision.notes}
                      onChange={e => setDecision(d => ({ ...d, notes: e.target.value }))}
                      placeholder="Observaciones del analista..."
                      rows={2}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleDecision('APPROVED')} disabled={submitting}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm">
                    ✅ Aprobar
                  </button>
                  <button onClick={() => handleDecision('REJECTED')} disabled={submitting}
                    className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm">
                    ❌ Rechazar
                  </button>
                </div>
                <button onClick={() => handleDecision('MORE_INFO')} disabled={submitting}
                  className="w-full border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold py-2 rounded-lg transition-colors text-sm">
                  Solicitar más información
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
