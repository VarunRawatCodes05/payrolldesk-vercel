// Force-require the DB driver to ensure Vercel bundles it correctly
try { require('sqlite3'); } catch (e) { console.error('SQLITE3 missing from bundle'); }

let initialized = false;

module.exports = async (req, res) => {
  try {
    // Lazy-load internal modules to catch 'require' errors
    const app = require('../server/server');
    const sequelize = require('../server/config/database');

    if (!initialized) {
      try {
        await sequelize.authenticate();
        await sequelize.sync();
        initialized = true;
      } catch (dbErr) {
        console.error('Initial DB Error:', dbErr);
      }
    }

    return app(req, res);
  } catch (err) {
    console.error('LAZY_LOAD_CRASH:', err);
    res.status(500).json({
      error: 'BACKEND_LOAD_FAILURE',
      message: err.message,
      stack: err.stack,
      hint: 'This usually means a dependency like sqlite3 failed to load in the cloud environment.'
    });
  }
};
