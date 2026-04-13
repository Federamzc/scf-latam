'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ScoringPage() {
  const [form, setForm] = useState({
    company_name: '',
    tax_id: '',
    annual_revenue: '',
    years_in_business: '',
    existing_debt: '',
    requested_amount: '',
    payment_history_score: '80'
  })
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

      const { data: app, error: appError } = await supabase
        .from('credit_applications')
        .insert({
          company_name: form.company_name,
          tax_id: form.tax_id,
          annual_revenue: Number(form.annual_revenue),
          years_in_business: Number(form.years_in_business),
          existing_debt: Number(form.existing_debt) || 0,
          requested_amount: Number(form.requested_amount),
          payment_history_score: Number(form.payment_history_score),
          applicant_id: user.id
        })
        .select()
        .single()

      if (appError) throw new Error(appError.message)

      const response = await fetch('/api/scoring/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: app.id })
      })

      const scoring = await response.json()
      setResult({ ...scoring, company_name: form.company_name })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getColor = (rec: string) =>
    rec === 'APPROVE' ? '#10b981' : rec === 'REVIEW' ? '#f59e0b' : '#ef4444'

  const getLabel = (rec: string) =>
    rec === 'APPROVE' ? 'APROBAR' : rec === 'REVIEW' ? 'REVISAR' : 'RECHAZAR'

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">← Dashboard</Link>
          <h1 className="text-white font-semibold">Scoring Engine</h1>
          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">SK · v1.0</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Nueva solicitud de crédito</h2>
            <p className="text-slate-400 text-sm mb-6">El engine evalúa en tiempo real con 4 variables</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1">Empresa</label>
                  <input type="text" required value={form.company_name}
                    onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Grupo Industrial S.A." />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1">RFC / Tax ID</label>
                  <input type="text" value={form.tax_id}
                    onChange={e => setForm(f => ({ ...f, tax_id: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="GIS123456ABC" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1">Ingresos anuales (USD)</label>
                  <input type="number" required value={form.annual_revenue}
                    onChange={e => setForm(f => ({ ...f, annual_revenue: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="5000000" />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1">Monto solicitado (USD)</label>
                  <input type="number" required value={form.requested_amount}
                    onChange={e => setForm(f => ({ ...f, requested_amount: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="500000" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1">Deuda existente (USD)</label>
                  <input type="number" value={form.existing_debt}
                    onChange={e => setForm(f => ({ ...f, existing_debt: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="100000" />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-medium mb-1">Años en operación</label>
                  <input type="number" required value={form.years_in_business}
                    onChange={e => setForm(f => ({ ...f, years_in_business: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="7" />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-medium mb-1">
                  Historial de pagos: <span className="text-blue-400">{form.payment_history_score}/100</span>
                </label>
                <input type="range" min="0" max="100" value={form.payment_history_score}
                  onChange={e => setForm(f => ({ ...f, payment_history_score: e.target.value }))}
                  className="w-full accent-blue-500" />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Malo (0)</span>
                  <span>Excelente (100)</span>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm">
                {loading ? 'Evaluando...' : 'Evaluar solicitud'}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">Resultado del scoring</h2>
            <p className="text-slate-400 text-sm mb-6">Evaluación en tiempo real · motor de reglas v1.0</p>

            {!result && !loading && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
                <div className="text-5xl mb-4">⚡</div>
                <p className="text-slate-400">Completá el formulario para ver el score</p>
              </div>
            )}

            {loading && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
                <div className="text-5xl mb-4 animate-pulse">🧠</div>
                <p className="text-slate-400">Evaluando solicitud...</p>
              </div>
            )}

            {result && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-2">{result.company_name}</p>
                  <div className="relative inline-flex items-center justify-center">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r="60" fill="none" stroke="#1e293b" strokeWidth="12"/>
                      <circle cx="80" cy="80" r="60" fill="none"
                        stroke={getColor(result.recommendation)}
                        strokeWidth="12"
                        strokeDasharray={`${(result.score / 100) * 376} 376`}
                        strokeLinecap="round"
                        transform="rotate(-90 80 80)"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <p className="text-4xl font-bold text-white">{result.score}</p>
                      <p className="text-xs text-slate-400">/ 100</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-sm font-bold px-4 py-2 rounded-full"
                      style={{ backgroundColor: getColor(result.recommendation) + '20', color: getColor(result.recommendation) }}>
                      {getLabel(result.recommendation)}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-2">⚡ {result.processing_time_ms}ms</p>
                </div>

                <div className="space-y-3">
                  {Object.values(result.breakdown as Record<string, any>).map((item: any) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white font-medium">{item.score}/{item.max}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all duration-700"
                          style={{
                            width: `${(item.score / item.max) * 100}%`,
                            backgroundColor: getColor(result.recommendation)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-4 flex gap-3">
                  <button onClick={() => setResult(null)}
                    className="w-full border border-slate-700 hover:border-slate-500 text-slate-300 text-sm font-semibold py-2 rounded-lg transition-colors">
                    Nueva solicitud
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
