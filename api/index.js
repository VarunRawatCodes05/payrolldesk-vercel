// Force-require the DB driver to ensure Vercel bundles it correctly
try { require('sqlite3'); } catch (e) { console.error('SQLITE3 missing from bundle'); }

const app = require('../server/server');
const sequelize = require('../server/config/database');

// Initialize DB once on cold start — associations already set up in server.js
let initialized = false;

const init = async () => {
  if (initialized) return;
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    initialized = true;
    console.log('DB initialized successfully');
  } catch (err) {
    console.error('DB init error:', err.message);
  }
};

module.exports = async (req, res) => {
  try {
    await init();
    return app(req, res);
  } catch (err) {
    console.error('SERVERLESS_CRASH:', err);
    res.status(500).json({
      error: 'CRITICAL_SERVER_ERROR',
      message: err.message,
      stack: err.stack,
      hint: 'Check Vercel logs or database pathing.'
    });
  }
};
