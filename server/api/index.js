const app = require('../server');
const sequelize = require('../config/database');

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
  await init();
  return app(req, res);
};
