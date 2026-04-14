// Force-require the DB driver to ensure Vercel bundles it correctly
try { require('sqlite3'); } catch (e) { console.error('SQLITE3 missing from bundle'); }

process.env.NODE_ENV = 'production';

module.exports = async (req, res) => {
  console.log('Function triggered:', req.url);
  try {
    // Basic dependency check
    const express = require('express');
    const { Sequelize } = require('sequelize');

    // Load server
    const app = require('../server/server');
    const sequelize = require('../server/config/database');

    // Authenticate DB
    await sequelize.authenticate();
    
    // Pass to Express
    return app(req, res);
  } catch (err) {
    console.error('SERVERLESS_FATAL:', err);
    res.status(500).json({
      error: 'SERVERLESS_BOOSTRAP_FAILED',
      message: err.message,
      stack: err.stack,
      hint: 'Check if sqlite3 is correctly installed for the Linux environment.'
    });
  }
};
