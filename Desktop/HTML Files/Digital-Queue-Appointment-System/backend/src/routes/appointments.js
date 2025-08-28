const express = require('express');
const { body, validationResult, param } = require('express-validator');

const { authMiddleware } = require('../middleware/auth');
const emailService = require('../services/emailService');
const db = require('../../config/database');

const router = express.Router();

// Generate unique confirmation code
const generateConfirmationCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Validation rules
const bookAppointmentValidation = [
  body('serviceId').isInt({ min: 1 }).withMessage('Valid service ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid appointment time is required (HH:MM format)'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
];

// Book new appointment
router.post('/book', authMiddleware, bookAppointmentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { serviceId, appointmentDate, appointmentTime, notes } = req.body;
    const userId = req.user.id;

    // Verify service exists and is active
    const [services] = await db.execute(
      'SELECT id, name, duration_minutes, requires_appointment FROM services WHERE id = ? AND is_active = 1',
      [serviceId]
    );

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or inactive'
      });
    }

    const service = services[0];

    if (!service.requires_appointment) {
      return res.status(400).json({
        success: false,
        message: 'This service does not require appointments. Please join the queue instead.'
      });
    }

    // Check if user already has an appointment for this service on this date
    const [existingAppointments] = await db.execute(
      'SELECT id FROM appointments WHERE user_id = ? AND service_id = ? AND appointment_date = ? AND status IN ("scheduled", "confirmed")',
      [userId, serviceId, appointmentDate]
    );

    if (existingAppointments.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You already have an appointment for this service on this date'
      });
    }

    // Check if the time slot is available
    const requestedDate = new Date(appointmentDate);
    const dayOfWeek = requestedDate.getDay();

    const [timeSlots] = await db.execute(
      `SELECT max_concurrent_appointments FROM time_slots 
       WHERE service_id = ? AND day_of_week = ? AND ? BETWEEN start_time AND end_time AND is_active = 1`,
      [serviceId, dayOfWeek, appointmentTime]
    );

    if (timeSlots.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is not available for this service'
      });
    }

    const maxConcurrent = timeSlots[0].max_concurrent_appointments || 1;

    // Check current bookings for this time slot
    const [currentBookings] = await db.execute(
      'SELECT COUNT(*) as count FROM appointments WHERE service_id = ? AND appointment_date = ? AND appointment_time = ? AND status IN ("scheduled", "confirmed")',
      [serviceId, appointmentDate, appointmentTime]
    );

    if (currentBookings[0].count >= maxConcurrent) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is fully booked'
      });
    }

    // Generate confirmation code
    let confirmationCode;
    let codeExists = true;
    
    while (codeExists) {
      confirmationCode = generateConfirmationCode();
      const [existingCodes] = await db.execute(
        'SELECT id FROM appointments WHERE confirmation_code = ?',
        [confirmationCode]
      );
      codeExists = existingCodes.length > 0;
    }

    // Create appointment
    const [result] = await db.execute(
      `INSERT INTO appointments (user_id, service_id, appointment_date, appointment_time, notes, confirmation_code) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, serviceId, appointmentDate, appointmentTime, notes, confirmationCode]
    );

    const appointmentId = result.insertId;

    // Get complete appointment details
    const [appointments] = await db.execute(
      `SELECT a.*, s.name as service_name, s.duration_minutes, u.first_name, u.last_name, u.email
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       JOIN users u ON a.user_id = u.id
       WHERE a.id = ?`,
      [appointmentId]
    );

    const appointment = appointments[0];

    // Send confirmation email
    try {
      await emailService.sendAppointmentConfirmation(appointment.email, {
        firstName: appointment.first_name,
        serviceName: appointment.service_name,
        date: new Date(appointment.appointment_date).toLocaleDateString(),
        time: appointment.appointment_time,
        duration: appointment.duration_minutes,
        confirmationCode: appointment.confirmation_code
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: {
        appointment: {
          id: appointment.id,
          serviceId: appointment.service_id,
          serviceName: appointment.service_name,
          appointmentDate: appointment.appointment_date,
          appointmentTime: appointment.appointment_time,
          status: appointment.status,
          confirmationCode: appointment.confirmation_code,
          notes: appointment.notes,
          duration: appointment.duration_minutes,
          createdAt: appointment.created_at
        }
      }
    });

  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment'
    });
  }
});

// Get user's appointments
router.get('/my-appointments', authMiddleware, async (req, res) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;
    
    let query = `
      SELECT a.*, s.name as service_name, s.duration_minutes, s.category
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE a.user_id = ?
    `;
    
    const params = [req.user.id];

    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }

    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [appointments] = await db.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM appointments WHERE user_id = ?';
    let countParams = [req.user.id];
    
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        appointments,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + appointments.length < total
        }
      }
    });

  } catch (error) {
    console.error('Get user appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments'
    });
  }
});

// Get appointment by ID
router.get('/:id', authMiddleware, [
  param('id').isInt({ min: 1 }).withMessage('Valid appointment ID is required')
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

    const [appointments] = await db.execute(
      `SELECT a.*, s.name as service_name, s.duration_minutes, s.category, s.description
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE a.id = ? AND a.user_id = ?`,
      [id, req.user.id]
    );

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: { appointment: appointments[0] }
    });

  } catch (error) {
    console.error('Get appointment by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment'
    });
  }
});

// Cancel appointment
router.delete('/:id', authMiddleware, [
  param('id').isInt({ min: 1 }).withMessage('Valid appointment ID is required')
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

    // Check if appointment exists and belongs to user
    const [appointments] = await db.execute(
      'SELECT id, appointment_date, appointment_time, status FROM appointments WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const appointment = appointments[0];

    // Check if appointment can be cancelled
    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: 'This appointment cannot be cancelled'
      });
    }

    // Check if cancellation is within allowed time (2 hours before appointment)
    const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    const now = new Date();
    const timeDifference = appointmentDateTime.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference < 2) {
      return res.status(400).json({
        success: false,
        message: 'Appointments can only be cancelled at least 2 hours in advance'
      });
    }

    // Cancel the appointment
    await db.execute(
      'UPDATE appointments SET status = "cancelled", updated_at = NOW() WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment'
    });
  }
});

// Reschedule appointment
router.put('/:id/reschedule', authMiddleware, [
  param('id').isInt({ min: 1 }).withMessage('Valid appointment ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid appointment time is required (HH:MM format)')
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
    const { appointmentDate, appointmentTime } = req.body;

    // Check if appointment exists and belongs to user
    const [appointments] = await db.execute(
      `SELECT a.*, s.id as service_id FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE a.id = ? AND a.user_id = ?`,
      [id, req.user.id]
    );

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const appointment = appointments[0];

    // Check if appointment can be rescheduled
    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: 'This appointment cannot be rescheduled'
      });
    }

    // Check if rescheduling is within allowed time (2 hours before appointment)
    const originalDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    const now = new Date();
    const timeDifference = originalDateTime.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference < 2) {
      return res.status(400).json({
        success: false,
        message: 'Appointments can only be rescheduled at least 2 hours in advance'
      });
    }

    // Check if the new time slot is available
    const requestedDate = new Date(appointmentDate);
    const dayOfWeek = requestedDate.getDay();

    const [timeSlots] = await db.execute(
      `SELECT max_concurrent_appointments FROM time_slots 
       WHERE service_id = ? AND day_of_week = ? AND ? BETWEEN start_time AND end_time AND is_active = 1`,
      [appointment.service_id, dayOfWeek, appointmentTime]
    );

    if (timeSlots.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is not available for this service'
      });
    }

    const maxConcurrent = timeSlots[0].max_concurrent_appointments || 1;

    // Check current bookings for this time slot (excluding current appointment)
    const [currentBookings] = await db.execute(
      'SELECT COUNT(*) as count FROM appointments WHERE service_id = ? AND appointment_date = ? AND appointment_time = ? AND status IN ("scheduled", "confirmed") AND id != ?',
      [appointment.service_id, appointmentDate, appointmentTime, id]
    );

    if (currentBookings[0].count >= maxConcurrent) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is fully booked'
      });
    }

    // Update the appointment
    await db.execute(
      'UPDATE appointments SET appointment_date = ?, appointment_time = ?, updated_at = NOW() WHERE id = ?',
      [appointmentDate, appointmentTime, id]
    );

    res.json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: {
        appointmentId: id,
        newDate: appointmentDate,
        newTime: appointmentTime
      }
    });

  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reschedule appointment'
    });
  }
});

// Rate and provide feedback for completed appointment
router.post('/:id/feedback', authMiddleware, [
  param('id').isInt({ min: 1 }).withMessage('Valid appointment ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 1000 }).withMessage('Comment must be less than 1000 characters')
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
    const { rating, comment } = req.body;

    // Check if appointment exists, belongs to user, and is completed
    const [appointments] = await db.execute(
      'SELECT id, service_id, status, rating FROM appointments WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const appointment = appointments[0];

    if (appointment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only rate completed appointments'
      });
    }

    if (appointment.rating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this appointment'
      });
    }

    // Update appointment rating
    await db.execute(
      'UPDATE appointments SET rating = ?, feedback = ?, updated_at = NOW() WHERE id = ?',
      [rating, comment, id]
    );

    // Insert into feedback table
    await db.execute(
      'INSERT INTO feedback (user_id, appointment_id, service_id, rating, comment, feedback_type) VALUES (?, ?, ?, ?, ?, "appointment")',
      [req.user.id, id, appointment.service_id, rating, comment]
    );

    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

module.exports = router;
