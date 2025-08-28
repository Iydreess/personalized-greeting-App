const express = require('express');
const { body, validationResult, param } = require('express-validator');

const { authMiddleware } = require('../middleware/auth');
const db = require('../../config/database');

const router = express.Router();

// Get all active services
router.get('/', async (req, res) => {
  try {
    const [services] = await db.execute(
      `SELECT s.*, 
              COUNT(DISTINCT ts.id) as available_time_slots,
              COUNT(DISTINCT ss.staff_id) as assigned_staff_count
       FROM services s
       LEFT JOIN time_slots ts ON s.id = ts.service_id AND ts.is_active = 1
       LEFT JOIN service_staff ss ON s.id = ss.service_id
       WHERE s.is_active = 1
       GROUP BY s.id
       ORDER BY s.category, s.name`
    );

    res.json({
      success: true,
      data: { services }
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Get service by ID
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Valid service ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;

    const [services] = await db.execute(
      'SELECT * FROM services WHERE id = ? AND is_active = 1',
      [id]
    );

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Get time slots for this service
    const [timeSlots] = await db.execute(
      `SELECT * FROM time_slots 
       WHERE service_id = ? AND is_active = 1
       ORDER BY day_of_week, start_time`,
      [id]
    );

    // Get assigned staff
    const [staff] = await db.execute(
      `SELECT u.id, u.first_name, u.last_name, u.email, ss.is_primary
       FROM service_staff ss
       JOIN users u ON ss.staff_id = u.id
       WHERE ss.service_id = ? AND u.is_active = 1
       ORDER BY ss.is_primary DESC, u.first_name`,
      [id]
    );

    const service = {
      ...services[0],
      timeSlots,
      staff
    };

    res.json({
      success: true,
      data: { service }
    });

  } catch (error) {
    console.error('Get service by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service'
    });
  }
});

// Get available time slots for a service on a specific date
router.get('/:id/available-slots', [
  param('id').isInt({ min: 1 }).withMessage('Valid service ID is required'),
  body('date').isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();

    // Get service details
    const [services] = await db.execute(
      'SELECT duration_minutes FROM services WHERE id = ? AND is_active = 1',
      [id]
    );

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const serviceDuration = services[0].duration_minutes;

    // Get time slots for this day of week
    const [timeSlots] = await db.execute(
      `SELECT start_time, end_time, slot_duration_minutes, max_concurrent_appointments
       FROM time_slots 
       WHERE service_id = ? AND day_of_week = ? AND is_active = 1`,
      [id, dayOfWeek]
    );

    if (timeSlots.length === 0) {
      return res.json({
        success: true,
        data: { availableSlots: [] },
        message: 'No time slots available for this day'
      });
    }

    // Get existing appointments for this date
    const [existingAppointments] = await db.execute(
      `SELECT appointment_time, COUNT(*) as count
       FROM appointments 
       WHERE service_id = ? AND appointment_date = ? AND status IN ('scheduled', 'confirmed', 'in_progress')
       GROUP BY appointment_time`,
      [id, date]
    );

    const appointmentCounts = {};
    existingAppointments.forEach(app => {
      appointmentCounts[app.appointment_time] = app.count;
    });

    // Generate available slots
    const availableSlots = [];
    
    for (const timeSlot of timeSlots) {
      const startTime = new Date(`2000-01-01T${timeSlot.start_time}`);
      const endTime = new Date(`2000-01-01T${timeSlot.end_time}`);
      const slotDuration = timeSlot.slot_duration_minutes || serviceDuration;
      const maxConcurrent = timeSlot.max_concurrent_appointments || 1;

      let currentTime = new Date(startTime);
      
      while (currentTime < endTime) {
        const timeString = currentTime.toTimeString().substring(0, 5);
        const currentCount = appointmentCounts[timeString] || 0;
        
        if (currentCount < maxConcurrent) {
          availableSlots.push({
            time: timeString,
            availableSpots: maxConcurrent - currentCount,
            maxSpots: maxConcurrent
          });
        }
        
        currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
      }
    }

    res.json({
      success: true,
      data: { 
        availableSlots,
        serviceDuration,
        date
      }
    });

  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots'
    });
  }
});

// Get service categories
router.get('/categories/list', async (req, res) => {
  try {
    const [categories] = await db.execute(
      `SELECT DISTINCT category, COUNT(*) as service_count
       FROM services 
       WHERE is_active = 1 AND category IS NOT NULL
       GROUP BY category
       ORDER BY category`
    );

    res.json({
      success: true,
      data: { categories }
    });

  } catch (error) {
    console.error('Get service categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service categories'
    });
  }
});

module.exports = router;
