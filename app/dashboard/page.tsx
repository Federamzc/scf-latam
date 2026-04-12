'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = window.location.origin + '/login'
        return
      }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
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

  const stats = isCorporativo ? [
    { label: 'Proveedores activos', value: '0', icon: '🏭' },
    { label: 'Facturas pendientes', value: '$0', icon: '📄' },
    { label: 'Financiado este mes', value: '$0', icon: '💰' },
    { label: 'Tasa promedio', value: '0%', icon: '📊' },
  ] : [
    { label: 'Facturas cargadas', value: '0', icon: '📄' },
    { label: 'Monto disponible', value: '$0', icon: '💵' },
    { label: 'En proceso', value: '$0', icon: '⏳' },
    { label: 'Cobrado este mes', value: '$0', icon: '✅' },
  ]

  const acciones = isCorporativo ? [
    { title: 'Agregar proveedor', desc: 'Invitá proveedores a tu red', icon: '➕', href: null },
    { title: 'Aprobar facturas', desc: 'Revisá solicitudes pendientes', icon: '✅', href: '/facturas' },
    { title: 'Ver reportes', desc: 'Análisis de financiamiento', icon: '📈', href: null },
  ] : [
    { title: 'Cargar factura', desc: 'Subí una nueva factura para financiar', icon: '📤', href: '/facturas/nueva' },
    { title: 'Ver mis facturas', desc: 'Estado de tus solicitudes', icon: '🗂️', href: '/facturas' },
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
          <p className="text-slate-400 mt-1">
            {isCorporativo ? 'Gestioná tu cadena de suministro y financiamiento' : 'Gestioná tus facturas y solicitudes de financiamiento'}
          </p>
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

        <div className={`grid ${isCorporativo ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 mb-10`}>
          {acciones.map(item => (
            item.href ? (
              <Link key={item.title} href={item.href}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer block">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold">{item.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                <span className="inline-block mt-3 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">Abrir →</span>
              </Link>
            ) : (
              <div key={item.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6 opacity-60 cursor-not-allowed">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold">{item.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                <span className="inline-block mt-3 text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">Próximamente</span>
              </div>
            )
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-white font-semibold">
              {isCorporativo ? 'Facturas pendientes' : 'Mis facturas recientes'}
            </h2>
            <Link href="/facturas" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              Ver todas →
            </Link>
          </div>
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">{isCorporativo ? '📄' : '📤'}</p>
            <p className="text-slate-400">{isCorporativo ? 'No hay facturas pendientes' : 'No hay facturas cargadas'}</p>
            {!isCorporativo && (
              <Link href="/facturas/nueva" className="inline-block mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg transition-colors text-sm">
                Cargar primera factura
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
