const express = require('express');
const router = express.Router();
const c = require('../controllers/payrollController');
router.get('/', c.getAll);
router.post('/generate', c.generate);
router.delete('/:id', c.remove);
module.exports = router;
