'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function NuevaFactura() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [datos, setDatos] = useState<any>(null)

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const texto = await file.text()

      const response = await fetch('/api/extraer-factura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: texto, tipo: file.type, nombre: file.name })
      })

      if (!response.ok) throw new Error('Error al procesar con IA')

      const datosExtraidos = await response.json()

      const { error: dbError } = await supabase.from('facturas').insert({
        proveedor_id: user.id,
        numero_factura: datosExtraidos.numero_factura,
        emisor: datosExtraidos.emisor,
        receptor: datosExtraidos.receptor,
        monto: datosExtraidos.monto,
        moneda: datosExtraidos.moneda || 'MXN',
        fecha_emision: datosExtraidos.fecha_emision,
        fecha_vencimiento: datosExtraidos.fecha_vencimiento,
        pais: datosExtraidos.pais,
        tipo_archivo: file.type,
        datos_extraidos: datosExtraidos,
        estado: 'PENDIENTE'
      })

      if (dbError) throw new Error(dbError.message)

      setDatos(datosExtraidos)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Error al procesar la factura')
    } finally {
      setLoading(false)
    }
  }

  if (success && datos) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-2xl font-bold text-white">Factura cargada</h2>
              <p className="text-slate-400 mt-1">Datos extraídos automáticamente con IA</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'N° Factura', value: datos.numero_factura },
                { label: 'Emisor', value: datos.emisor },
                { label: 'Receptor', value: datos.receptor },
                { label: 'Monto', value: `${datos.moneda} ${Number(datos.monto)?.toLocaleString()}` },
                { label: 'Fecha emisión', value: datos.fecha_emision },
                { label: 'Vencimiento', value: datos.fecha_vencimiento },
                { label: 'País', value: datos.pais },
              ].map(item => item.value && (
                <div key={item.label} className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">{item.label}</span>
                  <span className="text-white text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Link href="/dashboard" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-colors text-center">
                Ir al dashboard
              </Link>
              <button onClick={() => { setSuccess(false); setFile(null); setDatos(null) }}
                className="flex-1 border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold py-3 rounded-lg transition-colors">
                Cargar otra
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Volver al dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">Cargar factura</h1>
          <p className="text-slate-400 mt-2">XML, PDF o JSON — México y Costa Rica</p>
        </div>
        <form onSubmit={handleUpload} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>
          )}
          <div
            onClick={() => document.getElementById('file-input')?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              file ? 'border-blue-500 bg-blue-500/5' : 'border-slate-700 hover:border-slate-500'
            }`}
          >
            <input
              id="file-input"
              type="file"
              accept=".xml,.pdf,.json"
              className="hidden"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div>
                <div className="text-4xl mb-3">📄</div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-slate-400 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-3">📤</div>
                <p className="text-white font-medium">Hacé clic para subir</p>
                <p className="text-slate-400 text-sm mt-2">XML, PDF o JSON</p>
              </div>
            )}
          </div>
          <button type="submit" disabled={!file || loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors">
            {loading ? '⏳ Procesando con IA...' : 'Procesar factura'}
          </button>
        </form>
      </div>
    </div>
  )
}
