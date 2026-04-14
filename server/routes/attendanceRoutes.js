const express = require('express');
const router = express.Router();
const c = require('../controllers/attendanceController');
router.get('/', c.getAll);
router.post('/', c.upsert);
router.post('/bulk', c.bulkUpsert);
router.delete('/:id', c.remove);
module.exports = router;
