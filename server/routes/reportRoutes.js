const express = require('express');
const router = express.Router();
const c = require('../controllers/reportController');
router.get('/payroll-history', c.getPayrollHistory);
router.get('/export-csv', c.exportCSV);
module.exports = router;
