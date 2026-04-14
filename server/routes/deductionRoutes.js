const express = require('express');
const router = express.Router();
const c = require('../controllers/deductionController');
router.get('/', c.getAll);
router.get('/employee/:employeeId', c.getByEmployee);
router.post('/', c.upsert);
router.delete('/:id', c.remove);
module.exports = router;
