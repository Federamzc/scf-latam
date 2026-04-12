'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', company_name: '', role: 'PROVEEDOR' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { role: form.role, company_name: form.company_name } }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = window.location.origin + '/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Crear cuenta</h1>
          <p className="text-slate-400 mt-2">Comenzá a usar SCF Latam hoy</p>
        </div>
        <form onSubmit={handleRegister} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-3">Tipo de cuenta</label>
            <div className="grid grid-cols-2 gap-3">
              {['CORPORATIVO', 'PROVEEDOR'].map(role => (
                <button key={role} type="button" onClick={() => setForm(f => ({ ...f, role }))}
                  className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${form.role === role ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                  {role === 'CORPORATIVO' ? '🏢 Corporativo' : '🏭 Proveedor'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Empresa</label>
            <input type="text" required value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Mi Empresa S.A." />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="tu@empresa.com" />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Contraseña</label>
            <input type="password" required minLength={6} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Mínimo 6 caracteres" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors">
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
          <p className="text-center text-slate-500 text-sm">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300">Iniciá sesión</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
