process.env.NODE_ENV = 'production';

module.exports = async (req, res) => {
  try {
    const app = require('../server/server');
    const sequelize = require('../server/config/database');

    // Simple one-time init
    if (!global.dbInitialized) {
      await sequelize.authenticate();
      await sequelize.sync();
      global.dbInitialized = true;
    }

    return app(req, res);
  } catch (err) {
    res.status(500).json({
      error: 'BOOTSTRAP_ERROR',
      message: err.message,
      stack: err.stack
    });
  }
};
