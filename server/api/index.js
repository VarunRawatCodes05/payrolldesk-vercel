const app = require('../server');
const sequelize = require('../config/database');
const { setupAssociations } = require('../models');

// Initialize DB once on cold start
let initialized = false;

const init = async () => {
  if (initialized) return;
  try {
    setupAssociations();
    await sequelize.authenticate();
    await sequelize.sync();
    initialized = true;
    console.log('DB initialized');
  } catch (err) {
    console.error('DB init error:', err.message);
  }
};

module.exports = async (req, res) => {
  await init();
  return app(req, res);
};
