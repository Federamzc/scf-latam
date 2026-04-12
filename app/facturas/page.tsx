'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = window.location.origin + '/login'; return }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
      const { data: facts } = await supabase.from('facturas').select('*').order('created_at', { ascending: false })
      setFacturas(facts || [])
      setLoading(false)
    }
    load()
  }, [])

  async function cambiarEstado(id: string, estado: string) {
    await supabase.from('facturas').update({ estado }).eq('id', id)
    setFacturas(prev => prev.map(f => f.id === id ? { ...f, estado } : f))
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-white">Cargando...</p>
    </div>
  )

  const isCorporativo = profile?.role === 'CORPORATIVO'

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">← Dashboard</Link>
          <h1 className="text-white font-semibold">{isCorporativo ? 'Facturas para aprobar' : 'Mis facturas'}</h1>
          {!isCorporativo && (
            <Link href="/facturas/nueva" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              + Nueva
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {facturas.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📄</p>
            <p className="text-slate-400">No hay facturas aún</p>
            {!isCorporativo && (
              <Link href="/facturas/nueva" className="inline-block mt-4 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg text-sm">
                Cargar primera factura
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {facturas.map(f => (
              <div key={f.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-white font-semibold">{f.numero_factura}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        f.estado === 'PENDIENTE' ? 'bg-amber-500/20 text-amber-300' :
                        f.estado === 'APROBADA' ? 'bg-emerald-500/20 text-emerald-300' :
                        f.estado === 'RECHAZADA' ? 'bg-red-500/20 text-red-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>{f.estado}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs">Emisor</p>
                        <p className="text-slate-300">{f.emisor}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Receptor</p>
                        <p className="text-slate-300">{f.receptor}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Monto</p>
                        <p className="text-white font-semibold">{f.moneda} {Number(f.monto).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Fecha emisión</p>
                        <p className="text-slate-300">{f.fecha_emision || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  {isCorporativo && f.estado === 'PENDIENTE' && (
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => cambiarEstado(f.id, 'APROBADA')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                        Aprobar
                      </button>
                      <button onClick={() => cambiarEstado(f.id, 'RECHAZADA')}
                        className="bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
