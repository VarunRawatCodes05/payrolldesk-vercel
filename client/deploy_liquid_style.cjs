const fs = require('fs');
const cssPath = 'c:/Users/pramo/Desktop/Stitch/client/src/index.css';

const liquidOverrides = `
/* ======================================== */
/* LIQUID PULSE OVERRIDES (2026 TREND)      */
/* ======================================== */

/* 1. Animated Liquid Pulse Background */
body {
  background: linear-gradient(-45deg, #e0c3fc, #8ec5fc, #f0f4ff, #e2e8f0) !important;
  background-size: 400% 400% !important;
  animation: liquidPulse 15s ease infinite !important;
  color: #1e293b !important;
}

@keyframes liquidPulse {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Base Glassmorphism utility */
.glass-panel {
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(24px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07) !important;
}

/* 2. Structural components */
.sidebar {
  background: rgba(255, 255, 255, 0.3) !important;
  backdrop-filter: blur(30px) saturate(200%) !important;
  -webkit-backdrop-filter: blur(30px) saturate(200%) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.5) !important;
  color: #0f172a !important;
}
.sidebar-brand { border-bottom: 1px solid rgba(255, 255, 255, 0.4) !important; }
.sidebar-brand h2, .sidebar-brand span { color: #0f172a !important; }
.sidebar-nav a { color: #334155 !important; }
.sidebar-nav a:hover { background: rgba(255, 255, 255, 0.5) !important; color: var(--primary-700) !important; }
.sidebar-nav a.active { 
  background: rgba(255, 255, 255, 0.8) !important; 
  color: var(--primary-700) !important; 
  font-weight: 600 !important; 
  box-shadow: inset 0 0 10px rgba(255,255,255,0.5) !important; 
}

.topbar {
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03) !important;
}

.card, .summary-card, .login-card {
  background: rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(20px) saturate(150%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(150%) !important;
  border: 1px solid rgba(255, 255, 255, 0.7) !important;
  border-radius: 20px !important;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255,255,255,0.8) !important;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease !important;
}
.card:hover, .summary-card:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,1) !important;
}

.card-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.4) !important;
}

/* 3. Liquid Tables */
table thead th {
  background: rgba(255, 255, 255, 0.3) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6) !important;
  color: #334155 !important;
}
table tbody td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3) !important;
}
table tbody tr:hover {
  background: rgba(255, 255, 255, 0.5) !important;
}

/* 4. Squishy Tactile Buttons */
.btn {
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  color: #1e293b !important;
  border-radius: 14px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05), inset 0 2px 4px rgba(255,255,255,0.6) !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  font-weight: 600 !important;
}
.btn-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600)) !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3), inset 0 2px 4px rgba(255,255,255,0.3) !important;
}
.btn:hover, .btn-primary:hover {
  cursor: pointer;
}
.btn:active, .btn-primary:active {
  transform: scale(0.92) translateY(2px) !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
}
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-400), var(--primary-500)) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4), inset 0 2px 4px rgba(255,255,255,0.4) !important;
}

/* 5. Inputs and Forms */
.form-control {
  background: rgba(255, 255, 255, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.6) !important;
  border-radius: 12px !important;
  backdrop-filter: blur(8px) !important;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02) !important;
}
.form-control:focus {
  background: rgba(255, 255, 255, 0.7) !important;
  border-color: rgba(255, 255, 255, 0.9) !important;
  box-shadow: 0 0 0 4px rgba(255,255,255,0.4), inset 0 1px 2px rgba(0,0,0,0.02) !important;
  outline: none !important;
}

/* 6. Modals (Glassy inline feel) */
.modal-overlay {
  background: rgba(15, 23, 42, 0.2) !important;
  backdrop-filter: blur(8px) !important;
}
.modal {
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(32px) saturate(200%) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 28px !important;
  box-shadow: 0 24px 48px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9) !important;
}

/* 7. Landing Page Fixes */
.landing-header { 
  background: rgba(255,255,255,0.3) !important; 
  border-bottom: 1px solid rgba(255,255,255,0.4) !important; 
}
.hero-section { background: transparent !important; }
.features-section { background: transparent !important; }
.feature-card { 
  background: rgba(255,255,255,0.5) !important; 
  backdrop-filter: blur(16px) !important; 
  -webkit-backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(255,255,255,0.6) !important; 
}
.login-page { background: transparent !important; }
`;

fs.appendFileSync(cssPath, liquidOverrides, 'utf8');
console.log('Successfully applied Liquid Pulse to ' + cssPath);
