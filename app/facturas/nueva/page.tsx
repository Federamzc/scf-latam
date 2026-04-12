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
  const [debug, setDebug] = useState('')

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError('')
    setDebug('')

    try {
      setDebug('Verificando usuario...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw new Error('Error auth: ' + userError.message)
      if (!user) throw new Error('No autenticado')
      setDebug('Usuario OK: ' + user.id)

      const texto = await file.text()
      setDebug(prev => prev + '\nArchivo leido OK')

      const response = await fetch('/api/extraer-factura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: texto, tipo: file.type, nombre: file.name })
      })

      if (!response.ok) throw new Error('Error Gemini: ' + response.status)
      const datosExtraidos = await response.json()
      setDebug(prev => prev + '\nGemini OK')

      const { error: dbError } = await supabase.from('facturas').insert({
        proveedor_id: user.id,
        numero_factura: datosExtraidos.numero_factura || 'N/A',
        emisor: datosExtraidos.emisor || 'N/A',
        receptor: datosExtraidos.receptor || 'N/A',
        monto: Number(datosExtraidos.monto) || 0,
        moneda: datosExtraidos.moneda || 'MXN',
        fecha_emision: datosExtraidos.fecha_emision || null,
        fecha_vencimiento: datosExtraidos.fecha_vencimiento || null,
        pais: datosExtraidos.pais || 'N/A',
        tipo_archivo: file.type,
        estado: 'PENDIENTE'
      })

      if (dbError) throw new Error('Error DB: ' + JSON.stringify(dbError))
      setDebug(prev => prev + '\nDB OK')
      setDatos(datosExtraidos)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-3">✅</div>
            <h2 className="text-2xl font-bold text-white">Factura cargada</h2>
            <Link href="/dashboard" className="block mt-6 bg-blue-600 text-white font-semibold py-3 rounded-lg">
              Ir al dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-300 text-sm">Volver</Link>
          <h1 className="text-3xl font-bold text-white mt-4">Cargar factura</h1>
        </div>
        <form onSubmit={handleUpload} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>
          )}
          {debug && (
            <div className="bg-slate-800 rounded-lg px-4 py-3 text-xs text-slate-300 whitespace-pre-wrap">{debug}</div>
          )}
          <div onClick={() => document.getElementById('file-input')?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${file ? 'border-blue-500 bg-blue-500/5' : 'border-slate-700 hover:border-slate-500'}`}>
            <input id="file-input" type="file" accept=".xml,.pdf,.json" className="hidden"
              onChange={e => setFile(e.target.files?.[0] || null)} />
            {file ? (
              <div>
                <div className="text-4xl mb-3">📄</div>
                <p className="text-white font-medium">{file.name}</p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-3">📤</div>
                <p className="text-white font-medium">Clic para subir</p>
                <p className="text-slate-400 text-sm mt-2">XML, PDF o JSON</p>
              </div>
            )}
          </div>
          <button type="submit" disabled={!file || loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors">
            {loading ? 'Procesando...' : 'Procesar factura'}
          </button>
        </form>
      </div>
    </div>
  )
}
