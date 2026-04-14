const fs = require('fs');
const file = 'c:/Users/pramo/Desktop/Stitch/client/src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Remove previously injected liquid overrides if they exist
const splitIdx1 = content.indexOf('/* ======================================== */\n/* LIQUID PULSE OVERRIDES');
const splitIdx2 = content.indexOf('/* ======================================== */\r\n/* LIQUID PULSE OVERRIDES');
let splitIdx = Math.max(splitIdx1, splitIdx2);

if (splitIdx !== -1) {
  content = content.substring(0, splitIdx);
}

const stitchPulse = `
/* ======================================== */
/* STITCH PULSE OVERRIDES (2026 TREND)      */
/* ======================================== */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap');

body {
  background: #060e20 !important;
  background-image: radial-gradient(circle at 15% 50%, rgba(0, 230, 230, 0.08), transparent 25%),
                    radial-gradient(circle at 85% 30%, rgba(255, 81, 250, 0.08), transparent 25%) !important;
  color: #dee5ff !important;
  font-family: 'Manrope', sans-serif !important;
}

h1, h2, h3, h4, h5, .sidebar-brand h2, .summary-info .value {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  color: #c1fffe !important;
}

p, span, td, .form-control {
  color: #dee5ff !important;
}

.text-on-surface-variant { color: #a3aac4 !important; }
.card-header h3 { color: #dee5ff !important; }
.form-group label { color: #a3aac4 !important; }

/* Base Glassmorphism utility */
.glass-panel, .sidebar, .topbar, .card, .summary-card, .login-card, .modal {
  background: rgba(15, 25, 48, 0.4) !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1) !important;
}

.summary-icon {
  background: rgba(0, 230, 230, 0.1) !important; color: #00e6e6 !important;
}

.sidebar-nav a { color: #a3aac4 !important; }
.sidebar-nav a:hover { background: rgba(0, 230, 230, 0.1) !important; color: #c1fffe !important; }
.sidebar-nav a.active { 
  background: rgba(0, 230, 230, 0.15) !important; 
  color: #c1fffe !important; 
  box-shadow: inset 0 0 10px rgba(0,230,230,0.2) !important; 
  border-right: 2px solid #00e6e6 !important;
}

.topbar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important; 
}
.topbar-admin-name { color: #dee5ff !important; }
.topbar-admin-role { color: #a3aac4 !important; }

/* Tables */
table thead th {
  background: rgba(15, 25, 48, 0.6) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #a3aac4 !important;
}
table tbody td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
table tbody tr:hover { background: rgba(0, 230, 230, 0.05) !important; }

/* Buttons */
.btn {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #c1fffe !important;
  border-radius: 12px !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.btn-primary {
  background: linear-gradient(90deg, #00e6e6, #00f5f5) !important;
  color: #060e20 !important;
  border: none !important;
  box-shadow: 0 0 20px rgba(0, 230, 230, 0.3) !important;
}
.btn-primary:active {
  transform: translateY(2px) scale(0.95);
}
.btn-primary:hover:not(:disabled) {
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.5) !important;
  transform: translateY(-2px) !important;
  cursor: pointer;
}

/* Modals and Forms */
.form-control {
  background: rgba(6, 14, 32, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}
.form-control:focus {
  border: 1px solid #00e6e6 !important;
  box-shadow: 0 0 10px rgba(0, 230, 230, 0.2) !important;
  outline: none;
}
.modal-overlay { background: rgba(6, 14, 32, 0.8) !important; backdrop-filter: blur(8px) !important; }
.modal-header { border-bottom: 1px solid rgba(255,255,255,0.1) !important; }
.modal-footer { border-top: 1px solid rgba(255,255,255,0.1) !important; }

/* Landing Page Overrides */
.landing-header { background: rgba(15, 25, 48, 0.4) !important; border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important; }
.hero-title, .features-header h2 { color: #dee5ff !important; }
.hero-subtitle, .feature-card p { color: #a3aac4 !important; }
.hero-badge { background: rgba(255, 81, 250, 0.1) !important; color: #ff51fa !important; border: 1px solid rgba(255, 81, 250, 0.2) !important; }
#features { background: #060e20 !important; }
.landing-footer { background: #000 !important; }
.feature-card { background: rgba(15, 25, 48, 0.4) !important; border: 1px solid rgba(255,255,255,0.1) !important; }
`;

fs.writeFileSync(file, content + stitchPulse, 'utf8');
console.log('Stitch Pulse Deployed Successfully!');
