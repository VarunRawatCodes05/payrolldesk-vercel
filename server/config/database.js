const { Sequelize } = require('sequelize');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

let storagePath;
if (process.env.VERCEL) {
  // Database is in server/database.sqlite
  // This file is in server/config/database.js
  // So __dirname/../database.sqlite is the correct relative path in the bundle
  storagePath = path.join(__dirname, '..', 'database.sqlite');
  const tempPath = path.join('/tmp', 'database.sqlite');

  try {
    if (fs.existsSync(storagePath)) {
      if (!fs.existsSync(tempPath)) {
        fs.copyFileSync(storagePath, tempPath);
      }
      storagePath = tempPath;
    } else {
      storagePath = tempPath;
    }
  } catch (err) {
    console.error('Database setup error:', err);
  }
} else {
  storagePath = path.join(__dirname, '..', 'database.sqlite');
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

module.exports = sequelize;
