import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/30 min-h-screen">
      {/* TopAppBar */}
      <header className="bg-cyan-950/40 backdrop-blur-xl fixed top-0 w-full z-50 shadow-[0_8px_32px_0_rgba(6,14,32,0.3)]">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="material-symbols-outlined text-cyan-400" style={{ fontSize: '2rem' }}>payments</span>
            <span className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#c1fffe', letterSpacing: '-0.025em' }}>PayrollDesk</span>
          </div>
          <nav className="hidden md:flex" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#product" style={{ color: '#c1fffe', fontWeight: 'bold', textDecoration: 'none' }}>Product</a>
            <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none' }}>Features</a>
            <a href="#security" style={{ color: '#94a3b8', textDecoration: 'none' }}>Security</a>
          </nav>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link to="/login" style={{ color: '#c1fffe', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
            <Link to="/login" className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '9999px', textDecoration: 'none' }}>Get Started</Link>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: '6rem' }}>
        {/* Hero Section */}
        <section style={{ position: 'relative', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 2rem', maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div style={{ zIndex: 10 }}>
              <div className="hero-badge" style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(255, 81, 250, 0.15)', color: '#ff51fa', border: '1px solid rgba(255, 81, 250, 0.3)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ff51fa', marginRight: '8px', boxShadow: '0 0 10px #ff51fa' }}></span>
                System Pulse: Active
              </div>
              <h1 className="font-headline glow-text-pulse" style={{ fontSize: 'clamp(3.5rem, 10vw, 5rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                Smart <span style={{ color: 'transparent', backgroundImage: 'linear-gradient(to right, #c1fffe, #ff51fa)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>Payroll</span>
              </h1>
              <p style={{ color: '#a3aac4', fontSize: '1.4rem', maxWidth: '34rem', marginBottom: '3rem', lineHeight: 1.6, fontWeight: 500 }}>
                Beyond automation. Experience the <span style={{ color: '#c1fffe' }}>Empathic Engine</span>—where precision meets humanity.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                <Link to="/login" className="btn btn-primary" style={{ padding: '18px 40px', borderRadius: '9999px', fontSize: '1.2rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 800 }}>
                  Enter the System
                  <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>rocket_launch</span>
                </Link>
                <a href="#features" className="btn" style={{ padding: '18px 40px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '9999px', color: '#fff', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.1rem' }}>
                  Explore Pulse
                </a>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-2rem', background: 'radial-gradient(circle, rgba(0, 230, 230, 0.15), transparent 70%)', filter: 'blur(60px)', opacity: 0.6, zIndex: 0 }}></div>
              <div className="glass-panel animate-float-pulse" style={{ position: 'relative', borderRadius: '2rem', overflow: 'hidden', aspectRatio: '1/1', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 255, 255, 0.15)', zIndex: 1 }}>
                <img 
                  src="/hero-engine.png" 
                  alt="The Empathic Engine Core" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{ padding: '8rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'left', marginBottom: '5rem' }}>
            <h2 className="font-headline" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.2 }}>The Pulse of Your Workforce</h2>
            <p style={{ color: '#a3aac4', fontSize: '1.25rem', lineHeight: 1.6, maxWidth: '40rem' }}>Managing people should feel physical, responsive, and effortless.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            <div className="card" style={{ padding: '3rem 2.5rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
              <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '9999px', background: 'rgba(193, 255, 254, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <span className="material-symbols-outlined" style={{ color: '#c1fffe', fontSize: '2.5rem' }}>sync</span>
              </div>
              <h3 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Automated Payroll</h3>
              <p style={{ color: '#a3aac4', flexGrow: 1, lineHeight: 1.6 }}>Real-time global sync. Our engine processes calculations instantly, ensuring accuracy across every border and timezone.</p>
            </div>
            <div className="card" style={{ padding: '2.5rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '9999px', background: 'rgba(255, 81, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                <span className="material-symbols-outlined" style={{ color: '#ff51fa', fontSize: '2rem' }}>calendar_month</span>
              </div>
              <h3 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Leave Management</h3>
              <p style={{ color: '#a3aac4', flexGrow: 1, lineHeight: 1.6 }}>Intuitive request and track flow. Empower your team with a calendar that breathes with their personal lives.</p>
            </div>
            <div className="card" style={{ padding: '2.5rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '9999px', background: 'rgba(148, 146, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                <span className="material-symbols-outlined" style={{ color: '#9492ff', fontSize: '2rem' }}>person_play</span>
              </div>
              <h3 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Employee Self-Service</h3>
              <p style={{ color: '#a3aac4', flexGrow: 1, lineHeight: 1.6 }}>Empowerment via tactile modules. Your team deserves a portal that feels like a premium consumer app, not corporate sludge.</p>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section style={{ padding: '8rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '400px', background: 'rgba(193, 255, 254, 0.05)', borderRadius: '9999px', filter: 'blur(120px)' }}></div>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 className="font-headline" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.01em', lineHeight: 1.2 }}>Ready to Energize your Workflow?</h2>
            <p style={{ color: '#a3aac4', fontSize: '1.25rem', maxWidth: '40rem', margin: '0 auto 3rem', lineHeight: 1.6 }}>Join over 500 companies who have traded spreadsheets for a living, breathing ecosystem of human productivity.</p>
            <Link to="/login" className="btn btn-primary" style={{ padding: '20px 48px', borderRadius: '9999px', fontSize: '1.125rem', textDecoration: 'none', display: 'inline-block' }}>
              Start the Transformation
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: '#000', borderRadius: '3rem 3rem 0 0', marginTop: '5rem', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: '#c1fffe' }}>payments</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c1fffe' }}>PayrollDesk</span>
          </div>
          <nav style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem' }}>Product</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem' }}>Features</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem' }}>Security</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem' }}>Privacy Policy</a>
          </nav>
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} PayrollDesk. The Empathic Engine. Turned into reality for you.
          </p>
        </div>
      </footer>
    </div>
  );
}
