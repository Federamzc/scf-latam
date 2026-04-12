'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

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
      <p className="text-white">Cargando...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${profile?.role === 'CORPORATIVO' ? 'bg-blue-600' : 'bg-emerald-600'} rounded-lg flex items-center justify-center`}>
              {profile?.role === 'CORPORATIVO' ? '🏢' : '🏭'}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{profile?.company_name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${profile?.role === 'CORPORATIVO' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
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
        <h1 className="text-2xl font-bold text-white mb-2">
          {profile?.role === 'CORPORATIVO' ? 'Dashboard Corporativo' : 'Dashboard Proveedor'}
        </h1>
        <p className="text-slate-400 mb-10">Bienvenido, {profile?.company_name}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(profile?.role === 'CORPORATIVO' ? [
            { label: 'Proveedores activos', value: '0', icon: '🏭' },
            { label: 'Facturas pendientes', value: '$0', icon: '📄' },
            { label: 'Financiado este mes', value: '$0', icon: '💰' },
            { label: 'Tasa promedio', value: '0%', icon: '📊' },
          ] : [
            { label: 'Facturas cargadas', value: '0', icon: '📄' },
            { label: 'Monto disponible', value: '$0', icon: '💵' },
            { label: 'En proceso', value: '$0', icon: '⏳' },
            { label: 'Cobrado este mes', value: '$0', icon: '✅' },
          ]).map(stat => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
