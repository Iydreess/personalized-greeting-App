const express = require('express');
const { adminOnly } = require('../middleware/auth');
const db = require('../../config/database');

const router = express.Router();

// Get dashboard overview
router.get('/dashboard', adminOnly, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's statistics
    const [todayStats] = await db.execute(`
      SELECT 
        (SELECT COUNT(*) FROM appointments WHERE appointment_date = ?) as today_appointments,
        (SELECT COUNT(*) FROM queue_tickets WHERE queue_date = ?) as today_queue_tickets,
        (SELECT COUNT(*) FROM users WHERE role = 'customer' AND DATE(created_at) = ?) as new_customers_today,
        (SELECT COUNT(*) FROM appointments WHERE status = 'completed' AND appointment_date = ?) as completed_appointments
    `, [today, today, today, today]);

    res.json({
      success: true,
      data: {
        stats: todayStats[0],
        date: today
      }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

module.exports = router;
