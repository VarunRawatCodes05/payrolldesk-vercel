const { Sequelize } = require('sequelize');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

let storagePath = process.env.DB_STORAGE || path.resolve(__dirname, '../database.sqlite');

// Automatically handle Vercel read-only filesystem by moving DB to /tmp
if (process.env.VERCEL) {
  const tmpPath = '/tmp/database.sqlite';
  if (!fs.existsSync(tmpPath) && fs.existsSync(storagePath)) {
    fs.copyFileSync(storagePath, tmpPath);
  }
  storagePath = tmpPath;
}

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: storagePath,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

module.exports = sequelize;
