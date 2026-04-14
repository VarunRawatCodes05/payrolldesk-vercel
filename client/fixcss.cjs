const fs = require('fs');
const cssPath = 'c:/Users/pramo/Desktop/Stitch/client/src/index.css';
const content = fs.readFileSync(cssPath, 'utf8');

// The file got corrupted with Null bytes or weird spacing near the end. Let's slice by standard line count.
// The original uncorrupted file was exactly 929 lines. 
const cleanContent = content.split('\n').slice(0, 930).join('\n');

const newCSS = `\n/* Landing Page Styles */
.landing-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 5%; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid var(--slate-200); }
.landing-logo { height: 40px; display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 1.5rem; color: var(--primary); }
.landing-logo img { height: 100%; border-radius: 8px; }
.hero-section { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%); padding: 60px 20px; }
.hero-badge { background: #e0e7ff; color: #4338ca; padding: 8px 16px; border-radius: 99px; font-weight: 600; font-size: 0.85rem; margin-bottom: 24px; display: inline-block; animation: fadeUp 0.8s ease-out; }
.hero-title { font-size: 3.5rem; font-weight: 800; color: #1e293b; margin-bottom: 24px; line-height: 1.2; max-width: 800px; animation: fadeUp 1s ease-out; }
.hero-title span { background: -webkit-linear-gradient(45deg, var(--primary), #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-subtitle { font-size: 1.25rem; color: #64748b; margin-bottom: 40px; max-width: 600px; animation: fadeUp 1.2s ease-out; }
.hero-actions { display: flex; gap: 16px; animation: fadeUp 1.4s ease-out; }
.hero-image-wrapper { margin-top: 60px; max-width: 1000px; width: 100%; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); animation: fadeUp 1.6s ease-out; border: 4px solid white; }
.hero-image-wrapper img { width: 100%; display: block; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.features-section { padding: 80px 5%; background: white; }
.features-header { text-align: center; margin-bottom: 60px; }
.features-header h2 { font-size: 2.5rem; color: #1e293b; margin-bottom: 16px; }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
.feature-card { padding: 32px; border-radius: 16px; background: #f8fafc; border: 1px solid #e2e8f0; transition: transform 0.3s ease, box-shadow 0.3s ease; }
.feature-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
.feature-icon { width: 56px; height: 56px; border-radius: 12px; background: var(--primary-100); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 24px; }
.feature-card h3 { font-size: 1.25rem; margin-bottom: 12px; color: #0f172a; }
.feature-card p { color: #64748b; line-height: 1.6; }
.landing-footer { background: #0f172a; color: white; padding: 40px 5%; text-align: center; }
`;

// Find where the weird characters start (or where normal ends)
// Or just find .spinner keyframes completion (which ends at line 929)
const spinnerEnd = content.indexOf('@keyframes spin {\r\n  to { transform: rotate(360deg); }\r\n}\r\n') + 58;

let finalContent = "";
if (spinnerEnd > 58) {
  finalContent = content.substring(0, spinnerEnd) + newCSS;
} else {
  // Fallback
  finalContent = cleanContent + newCSS;
}

fs.writeFileSync(cssPath, finalContent, 'utf8');
console.log('Fixed CSS');
