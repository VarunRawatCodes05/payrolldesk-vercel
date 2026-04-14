const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const c = require('../controllers/employeeSelfController');

// All routes require employee authentication
router.use(auth);

router.get('/dashboard', c.getMyDashboard);
router.get('/profile', c.getMyProfile);
router.get('/attendance', c.getMyAttendance);
router.get('/payroll', c.getMyPayroll);
router.get('/leaves', c.getMyLeaves);
router.post('/leaves', c.requestLeave);

module.exports = router;
