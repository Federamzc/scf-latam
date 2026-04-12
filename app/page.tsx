import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="inline-block bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1 text-blue-300 text-sm mb-6">
          Supply Chain Finance · LATAM
        </div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Financia tu cadena de suministro
        </h1>
        <p className="text-slate-400 text-lg mb-10">
          Conectamos corporativos con sus proveedores para acceder a financiamiento rápido y transparente.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Crear cuenta
          </Link>
          <Link href="/login" className="border border-slate-600 hover:border-slate-400 text-slate-300 font-semibold px-6 py-3 rounded-lg transition-colors">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </main>
  )
}
