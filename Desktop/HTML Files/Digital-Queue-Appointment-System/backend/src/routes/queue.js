const express = require('express');
const { body, validationResult, param } = require('express-validator');

const { authMiddleware, staffOnly } = require('../middleware/auth');
const queueService = require('../services/queueService');
const db = require('../../config/database');

const router = express.Router();

// Validation rules
const joinQueueValidation = [
  body('serviceId').isInt({ min: 1 }).withMessage('Valid service ID is required'),
  body('priority').optional().isInt({ min: 1, max: 3 }).withMessage('Priority must be 1, 2, or 3'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
];

// Get available services for queue
router.get('/services', async (req, res) => {
  try {
    const [services] = await db.execute(
      `SELECT id, name, description, duration_minutes, category, color_code, max_daily_capacity
       FROM services 
       WHERE is_active = 1
       ORDER BY category, name`
    );

    // Get current queue counts for each service
    const today = new Date().toISOString().split('T')[0];
    for (let service of services) {
      const stats = await queueService.getQueueStats(service.id, today);
      service.currentQueueSize = stats.waiting_count + stats.called_count + stats.serving_count;
      service.totalServedToday = stats.served_count;
    }

    res.json({
      success: true,
      data: { services }
    });

  } catch (error) {
    console.error('Get queue services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Join queue (for walk-ins or users)
router.post('/join', joinQueueValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { serviceId, priority = 1, notes } = req.body;
    const userId = req.user?.id || null; // Optional for walk-ins

    // Verify service exists and is active
    const [services] = await db.execute(
      'SELECT id, name, max_daily_capacity FROM services WHERE id = ? AND is_active = 1',
      [serviceId]
    );

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or inactive'
      });
    }

    const service = services[0];

    // Check daily capacity
    const today = new Date().toISOString().split('T')[0];
    const stats = await queueService.getQueueStats(serviceId, today);
    
    if (stats.total_count >= service.max_daily_capacity) {
      return res.status(400).json({
        success: false,
        message: 'Service has reached its daily capacity'
      });
    }

    // Add to queue
    const ticket = await queueService.addToQueue(userId, serviceId, priority, true, notes);

    res.status(201).json({
      success: true,
      message: 'Successfully joined the queue',
      data: { ticket }
    });

  } catch (error) {
    console.error('Join queue error:', error);
    
    if (error.message.includes('already in the queue') || error.message.includes('Queue is full')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to join queue'
    });
  }
});

// Get current queue status for a service
router.get('/status/:serviceId', [
  param('serviceId').isInt({ min: 1 }).withMessage('Valid service ID is required')
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

    const { serviceId } = req.params;
    const { date } = req.query;

    const queueStatus = await queueService.getQueueStatus(serviceId, date);

    res.json({
      success: true,
      data: queueStatus
    });

  } catch (error) {
    console.error('Get queue status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch queue status'
    });
  }
});

// Get user's current ticket
router.get('/my-ticket', authMiddleware, async (req, res) => {
  try {
    const { serviceId } = req.query;
    
    const ticket = await queueService.getUserCurrentTicket(req.user.id, serviceId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'No active ticket found'
      });
    }

    res.json({
      success: true,
      data: { ticket }
    });

  } catch (error) {
    console.error('Get my ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your ticket'
    });
  }
});

// Cancel user's ticket
router.delete('/my-ticket/:ticketId', authMiddleware, [
  param('ticketId').isInt({ min: 1 }).withMessage('Valid ticket ID is required')
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

    const { ticketId } = req.params;

    const ticket = await queueService.cancelTicket(ticketId, req.user.id);

    res.json({
      success: true,
      message: 'Ticket cancelled successfully',
      data: { ticket }
    });

  } catch (error) {
    console.error('Cancel ticket error:', error);
    
    if (error.message.includes('not found') || error.message.includes('cannot be cancelled')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to cancel ticket'
    });
  }
});

// Staff/Admin routes for queue management

// Call next customer
router.post('/call-next/:serviceId', staffOnly, [
  param('serviceId').isInt({ min: 1 }).withMessage('Valid service ID is required')
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

    const { serviceId } = req.params;

    const ticket = await queueService.callNextCustomer(serviceId, req.user.id);

    res.json({
      success: true,
      message: 'Next customer called',
      data: { ticket }
    });

  } catch (error) {
    console.error('Call next customer error:', error);
    
    if (error.message.includes('No customers waiting')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to call next customer'
    });
  }
});

// Serve customer
router.put('/serve/:ticketId', staffOnly, [
  param('ticketId').isInt({ min: 1 }).withMessage('Valid ticket ID is required')
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

    const { ticketId } = req.params;

    const ticket = await queueService.serveCustomer(ticketId, req.user.id);

    res.json({
      success: true,
      message: 'Customer is being served',
      data: { ticket }
    });

  } catch (error) {
    console.error('Serve customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve customer'
    });
  }
});

// Complete service
router.put('/complete/:ticketId', staffOnly, [
  param('ticketId').isInt({ min: 1 }).withMessage('Valid ticket ID is required'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
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

    const { ticketId } = req.params;
    const { notes } = req.body;

    const ticket = await queueService.completeService(ticketId, req.user.id, notes);

    res.json({
      success: true,
      message: 'Service completed successfully',
      data: { ticket }
    });

  } catch (error) {
    console.error('Complete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete service'
    });
  }
});

// Skip customer
router.put('/skip/:ticketId', staffOnly, [
  param('ticketId').isInt({ min: 1 }).withMessage('Valid ticket ID is required'),
  body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason must be less than 500 characters')
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

    const { ticketId } = req.params;
    const { reason } = req.body;

    const ticket = await queueService.skipCustomer(ticketId, req.user.id, reason);

    res.json({
      success: true,
      message: 'Customer skipped',
      data: { ticket }
    });

  } catch (error) {
    console.error('Skip customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to skip customer'
    });
  }
});

// Get detailed queue analytics for staff
router.get('/analytics/:serviceId', staffOnly, [
  param('serviceId').isInt({ min: 1 }).withMessage('Valid service ID is required')
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

    const { serviceId } = req.params;
    const { startDate, endDate } = req.query;

    const start = startDate || new Date().toISOString().split('T')[0];
    const end = endDate || start;

    // Get daily statistics
    const [dailyStats] = await db.execute(
      `SELECT 
         queue_date,
         COUNT(*) as total_tickets,
         COUNT(CASE WHEN status = 'served' THEN 1 END) as served_count,
         COUNT(CASE WHEN status = 'skipped' THEN 1 END) as skipped_count,
         COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count,
         AVG(CASE WHEN status = 'served' AND served_at IS NOT NULL AND called_at IS NOT NULL 
             THEN TIMESTAMPDIFF(MINUTE, called_at, served_at) END) as avg_service_time,
         AVG(estimated_wait_minutes) as avg_estimated_wait
       FROM queue_tickets 
       WHERE service_id = ? AND queue_date BETWEEN ? AND ?
       GROUP BY queue_date
       ORDER BY queue_date DESC`,
      [serviceId, start, end]
    );

    // Get hourly distribution for today
    const today = new Date().toISOString().split('T')[0];
    const [hourlyStats] = await db.execute(
      `SELECT 
         HOUR(created_at) as hour,
         COUNT(*) as ticket_count
       FROM queue_tickets 
       WHERE service_id = ? AND queue_date = ?
       GROUP BY HOUR(created_at)
       ORDER BY hour`,
      [serviceId, today]
    );

    res.json({
      success: true,
      data: {
        dailyStats,
        hourlyStats,
        period: { startDate: start, endDate: end }
      }
    });

  } catch (error) {
    console.error('Get queue analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch queue analytics'
    });
  }
});

module.exports = router;
