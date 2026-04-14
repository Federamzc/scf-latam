import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ background: '#000', color: '#fff', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --g1:#0D0D0D;--g2:#1A1A1A;--g3:#272727;--g4:#404040;--g5:#606060;--g6:#909090;--g7:#B8B8B8;--g8:#D8D8D8; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 64, padding: '0 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#000', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 0.5 }}>SK</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 4, textTransform: 'uppercase' }}>Smart Kapital</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <Link href="/login" style={{ fontSize: 11, color: '#909090', textDecoration: 'none', letterSpacing: 1.5, textTransform: 'uppercase' }}>Sign In</Link>
          <Link href="/register" style={{ fontSize: 11, letterSpacing: 1.5, border: '1px solid #404040', color: '#fff', padding: '8px 20px', textTransform: 'uppercase', textDecoration: 'none' }}>Request Access</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '160px 60px 0', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', background: '#000' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />

        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#606060', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40, position: 'relative', zIndex: 1 }}>
          <span style={{ width: 28, height: 1, background: '#404040', display: 'block' }} />
          Credit Infrastructure · LATAM
        </div>

        <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(40px, 7vw, 96px)', fontWeight: 300, lineHeight: 1.05, letterSpacing: -2, color: '#fff', maxWidth: 820, marginBottom: 48, position: 'relative', zIndex: 1 }}>
          Capital moves<br />
          <strong style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: -3 }}>when you decide.</strong>
        </h1>

        <p style={{ fontSize: 16, fontWeight: 300, color: '#909090', maxWidth: 440, lineHeight: 1.8, marginBottom: 52, borderLeft: '1px solid #272727', paddingLeft: 24, position: 'relative', zIndex: 1 }}>
          SK is the credit infrastructure layer for LATAM. Connect once. Deploy supply chain finance, credit lines, and BNPL across six markets through a single API.
        </p>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 100, position: 'relative', zIndex: 1 }}>
          <Link href="/register" style={{ background: '#fff', color: '#000', padding: '15px 36px', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none' }}>Get Started</Link>
          <Link href="/login" style={{ color: '#909090', padding: '15px 28px', fontSize: 11, fontWeight: 400, letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #272727' }}>Sign In</Link>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid #1A1A1A', position: 'relative', zIndex: 1 }}>
          {[
            { val: '$2.4B', lbl: 'Credit Facilitated' },
            { val: '6', lbl: 'Active Markets' },
            { val: '48h', lbl: 'Integration Time' },
          ].map((s, i) => (
            <div key={s.lbl} style={{ padding: '36px 0', borderRight: i < 2 ? '1px solid #1A1A1A' : 'none', paddingLeft: i > 0 ? 40 : 0, paddingRight: i < 2 ? 40 : 0 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 700, color: '#fff', letterSpacing: -2, lineHeight: 1, marginBottom: 6 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: '#606060', letterSpacing: 1, textTransform: 'uppercase' }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
