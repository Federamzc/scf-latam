'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-white text-lg">Cargando...</p>
    </div>
  )

  const isCorporativo = profile?.role === 'CORPORATIVO'
  const totalMonto = facturas.reduce((sum, f) => sum + (Number(f.monto) || 0), 0)
  const pendientes = facturas.filter(f => f.estado === 'PENDIENTE').length
  const aprobadas = facturas.filter(f => f.estado === 'APROBADA').length

  const stats = isCorporativo ? [
    { label: 'Facturas pendientes', value: pendientes.toString(), icon: '📄' },
    { label: 'Facturas aprobadas', value: aprobadas.toString(), icon: '✅' },
    { label: 'Monto total', value: `$${totalMonto.toLocaleString()}`, icon: '💰' },
    { label: 'Total facturas', value: facturas.length.toString(), icon: '📊' },
  ] : [
    { label: 'Facturas cargadas', value: facturas.length.toString(), icon: '📄' },
    { label: 'Pendientes', value: pendientes.toString(), icon: '⏳' },
    { label: 'Aprobadas', value: aprobadas.toString(), icon: '✅' },
    { label: 'Monto total', value: `$${totalMonto.toLocaleString()}`, icon: '💵' },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${isCorporativo ? 'bg-blue-600' : 'bg-emerald-600'} rounded-lg flex items-center justify-center`}>
              {isCorporativo ? '🏢' : '🏭'}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{profile?.company_name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isCorporativo ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {profile?.role}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-white text-sm transition-colors">
            Cerrar sesión →
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            {isCorporativo ? 'Dashboard Corporativo' : 'Dashboard Proveedor'}
          </h1>
          <p className="text-slate-400 mt-1">Bienvenido, {profile?.company_name}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(stat => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className={`grid ${isCorporativo ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-4 mb-10`}>
          {!isCorporativo && (
            <Link href="/facturas/nueva"
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors block">
              <div className="text-3xl mb-3">📤</div>
              <h3 className="text-white font-semibold">Cargar factura</h3>
              <p className="text-slate-400 text-sm mt-1">Subí una nueva factura para financiar</p>
              <span className="inline-block mt-3 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">Abrir →</span>
            </Link>
          )}
          <Link href="/facturas"
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors block">
            <div className="text-3xl mb-3">🗂️</div>
            <h3 className="text-white font-semibold">{isCorporativo ? 'Ver facturas' : 'Mis facturas'}</h3>
            <p className="text-slate-400 text-sm mt-1">{isCorporativo ? 'Revisá y aprobá solicitudes' : 'Estado de tus solicitudes'}</p>
            <span className="inline-block mt-3 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">Abrir →</span>
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-white font-semibold">Facturas recientes</h2>
            <Link href="/facturas" className="text-blue-400 hover:text-blue-300 text-sm">Ver todas →</Link>
          </div>
          {facturas.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl mb-3">📄</p>
              <p className="text-slate-400">No hay facturas aún</p>
              {!isCorporativo && (
                <Link href="/facturas/nueva" className="inline-block mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg text-sm">
                  Cargar primera factura
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {facturas.map(f => (
                <div key={f.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">{f.numero_factura}</p>
                    <p className="text-slate-400 text-xs mt-1">{f.emisor} → {f.receptor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold text-sm">{f.moneda} {Number(f.monto).toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                      f.estado === 'PENDIENTE' ? 'bg-amber-500/20 text-amber-300' :
                      f.estado === 'APROBADA' ? 'bg-emerald-500/20 text-emerald-300' :
                      f.estado === 'RECHAZADA' ? 'bg-red-500/20 text-red-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>{f.estado}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
