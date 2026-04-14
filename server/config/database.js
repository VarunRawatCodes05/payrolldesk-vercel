const { Sequelize } = require('sequelize');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

let storagePath;
if (process.env.VERCEL) {
  // On Vercel, we must use a relative path from the bundled function
  // or a path that Vercel guarantees.
  storagePath = path.resolve(process.cwd(), 'server', 'database.sqlite');
  const tempPath = path.join('/tmp', 'database.sqlite');

  try {
    console.log('Vercel environment detected.');
    console.log('Source DB path:', storagePath);
    console.log('Source DB exists:', fs.existsSync(storagePath));
    
    if (fs.existsSync(storagePath)) {
      if (!fs.existsSync(tempPath)) {
        fs.copyFileSync(storagePath, tempPath);
        console.log('DB copied to /tmp successfully.');
      }
      storagePath = tempPath;
    } else {
      console.warn('Source DB file not found! Falling back to /tmp/database.sqlite anyway.');
      storagePath = tempPath;
    }
  } catch (err) {
    console.error('Database migration error:', err);
  }
} else {
  storagePath = path.join(__dirname, '..', 'database.sqlite');
}

console.log('Final Database Storage Path:', storagePath);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false, // Set to console.log to see SQL queries
  define: {
    timestamps: true,
    underscored: true,
  },
});

module.exports = sequelize;
