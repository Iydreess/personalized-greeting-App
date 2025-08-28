const db = require('../../config/database');
const moment = require('moment');

class QueueService {
  constructor() {
    this.io = null;
  }

  setIO(io) {
    this.io = io;
  }

  // Generate unique ticket number
  async generateTicketNumber(serviceId, queueDate) {
    const dateStr = moment(queueDate).format('YYMMDD');
    const serviceCode = String(serviceId).padStart(2, '0');
    
    // Get next sequence number for the day
    const [result] = await db.execute(
      'SELECT COUNT(*) as count FROM queue_tickets WHERE service_id = ? AND queue_date = ?',
      [serviceId, queueDate]
    );
    
    const sequence = (result[0].count + 1).toString().padStart(3, '0');
    return `${serviceCode}${dateStr}${sequence}`;
  }

  // Add customer to queue
  async addToQueue(userId, serviceId, priority = 1, isWalkIn = true, notes = null) {
    try {
      const queueDate = moment().format('YYYY-MM-DD');
      
      // Check if queue is full
      const [queueCount] = await db.execute(
        'SELECT COUNT(*) as count FROM queue_tickets WHERE service_id = ? AND queue_date = ? AND status IN ("waiting", "called")',
        [serviceId, queueDate]
      );

      const maxQueueSize = parseInt(process.env.MAX_QUEUE_SIZE) || 100;
      if (queueCount[0].count >= maxQueueSize) {
        throw new Error('Queue is full. Please try again later.');
      }

      // Check if user is already in queue for this service today
      if (userId) {
        const [existingTicket] = await db.execute(
          'SELECT id FROM queue_tickets WHERE user_id = ? AND service_id = ? AND queue_date = ? AND status IN ("waiting", "called")',
          [userId, serviceId, queueDate]
        );

        if (existingTicket.length > 0) {
          throw new Error('You are already in the queue for this service today.');
        }
      }

      // Generate ticket number
      const ticketNumber = await this.generateTicketNumber(serviceId, queueDate);

      // Get current queue position
      const position = await this.getNextPosition(serviceId, queueDate, priority);

      // Calculate estimated wait time
      const estimatedWait = await this.calculateEstimatedWaitTime(serviceId, position);

      // Insert ticket
      const [result] = await db.execute(
        `INSERT INTO queue_tickets (user_id, service_id, ticket_number, queue_date, priority, 
         position_in_queue, estimated_wait_minutes, notes, is_walk_in) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, serviceId, ticketNumber, queueDate, priority, position, estimatedWait, notes, isWalkIn]
      );

      const ticketId = result.insertId;

      // Update positions for tickets with lower priority
      await this.updateQueuePositions(serviceId, queueDate);

      // Get complete ticket information
      const ticket = await this.getTicketById(ticketId);

      // Emit real-time update
      if (this.io) {
        this.io.to(`queue-${serviceId}`).emit('queue-updated', {
          action: 'ticket-added',
          ticket: ticket,
          queueStats: await this.getQueueStats(serviceId, queueDate)
        });

        this.io.to('admin-room').emit('admin-update', {
          type: 'new-ticket',
          ticket: ticket
        });
      }

      return ticket;
    } catch (error) {
      console.error('Add to queue error:', error);
      throw error;
    }
  }

  // Get next position in queue based on priority
  async getNextPosition(serviceId, queueDate, priority) {
    const [result] = await db.execute(
      `SELECT COALESCE(MAX(position_in_queue), 0) + 1 as next_position 
       FROM queue_tickets 
       WHERE service_id = ? AND queue_date = ? AND priority >= ? AND status IN ("waiting", "called")`,
      [serviceId, queueDate, priority]
    );

    return result[0].next_position;
  }

  // Calculate estimated wait time
  async calculateEstimatedWaitTime(serviceId, position) {
    try {
      // Get service duration
      const [service] = await db.execute(
        'SELECT duration_minutes FROM services WHERE id = ?',
        [serviceId]
      );

      if (service.length === 0) {
        return 30; // Default 30 minutes if service not found
      }

      const serviceDuration = service[0].duration_minutes;
      
      // Calculate estimated wait time (position - 1) * service duration
      const estimatedWait = Math.max(0, (position - 1) * serviceDuration);
      
      return estimatedWait;
    } catch (error) {
      console.error('Calculate wait time error:', error);
      return 30; // Default fallback
    }
  }

  // Update queue positions
  async updateQueuePositions(serviceId, queueDate) {
    try {
      // Get all waiting tickets ordered by priority and creation time
      const [tickets] = await db.execute(
        `SELECT id FROM queue_tickets 
         WHERE service_id = ? AND queue_date = ? AND status = "waiting"
         ORDER BY priority DESC, created_at ASC`,
        [serviceId, queueDate]
      );

      // Update positions
      for (let i = 0; i < tickets.length; i++) {
        await db.execute(
          'UPDATE queue_tickets SET position_in_queue = ? WHERE id = ?',
          [i + 1, tickets[i].id]
        );
      }
    } catch (error) {
      console.error('Update queue positions error:', error);
    }
  }

  // Call next customer
  async callNextCustomer(serviceId, staffId) {
    try {
      const queueDate = moment().format('YYYY-MM-DD');

      // Get next customer in queue
      const [nextTickets] = await db.execute(
        `SELECT * FROM queue_tickets 
         WHERE service_id = ? AND queue_date = ? AND status = "waiting"
         ORDER BY priority DESC, position_in_queue ASC
         LIMIT 1`,
        [serviceId, queueDate]
      );

      if (nextTickets.length === 0) {
        throw new Error('No customers waiting in queue');
      }

      const ticket = nextTickets[0];

      // Update ticket status
      await db.execute(
        'UPDATE queue_tickets SET status = "called", called_at = NOW() WHERE id = ?',
        [ticket.id]
      );

      // Get updated ticket info
      const calledTicket = await this.getTicketById(ticket.id);

      // Emit real-time updates
      if (this.io) {
        this.io.to(`queue-${serviceId}`).emit('queue-updated', {
          action: 'customer-called',
          ticket: calledTicket,
          queueStats: await this.getQueueStats(serviceId, queueDate)
        });

        this.io.to('admin-room').emit('admin-update', {
          type: 'customer-called',
          ticket: calledTicket
        });
      }

      return calledTicket;
    } catch (error) {
      console.error('Call next customer error:', error);
      throw error;
    }
  }

  // Serve customer
  async serveCustomer(ticketId, staffId) {
    try {
      // Update ticket status
      await db.execute(
        'UPDATE queue_tickets SET status = "serving", served_at = NOW() WHERE id = ?',
        [ticketId]
      );

      const ticket = await this.getTicketById(ticketId);

      // Emit real-time updates
      if (this.io) {
        this.io.to(`queue-${ticket.service_id}`).emit('queue-updated', {
          action: 'customer-serving',
          ticket: ticket,
          queueStats: await this.getQueueStats(ticket.service_id, ticket.queue_date)
        });

        this.io.to('admin-room').emit('admin-update', {
          type: 'customer-serving',
          ticket: ticket
        });
      }

      return ticket;
    } catch (error) {
      console.error('Serve customer error:', error);
      throw error;
    }
  }

  // Complete service
  async completeService(ticketId, staffId, notes = null) {
    try {
      // Update ticket status
      await db.execute(
        'UPDATE queue_tickets SET status = "served", completed_at = NOW(), notes = ? WHERE id = ?',
        [notes, ticketId]
      );

      const ticket = await this.getTicketById(ticketId);

      // Update queue positions for remaining customers
      await this.updateQueuePositions(ticket.service_id, ticket.queue_date);

      // Emit real-time updates
      if (this.io) {
        this.io.to(`queue-${ticket.service_id}`).emit('queue-updated', {
          action: 'service-completed',
          ticket: ticket,
          queueStats: await this.getQueueStats(ticket.service_id, ticket.queue_date)
        });

        this.io.to('admin-room').emit('admin-update', {
          type: 'service-completed',
          ticket: ticket
        });
      }

      return ticket;
    } catch (error) {
      console.error('Complete service error:', error);
      throw error;
    }
  }

  // Skip customer
  async skipCustomer(ticketId, staffId, reason = null) {
    try {
      // Update ticket status
      await db.execute(
        'UPDATE queue_tickets SET status = "skipped", notes = ? WHERE id = ?',
        [reason, ticketId]
      );

      const ticket = await this.getTicketById(ticketId);

      // Update queue positions
      await this.updateQueuePositions(ticket.service_id, ticket.queue_date);

      // Emit real-time updates
      if (this.io) {
        this.io.to(`queue-${ticket.service_id}`).emit('queue-updated', {
          action: 'customer-skipped',
          ticket: ticket,
          queueStats: await this.getQueueStats(ticket.service_id, ticket.queue_date)
        });

        this.io.to('admin-room').emit('admin-update', {
          type: 'customer-skipped',
          ticket: ticket
        });
      }

      return ticket;
    } catch (error) {
      console.error('Skip customer error:', error);
      throw error;
    }
  }

  // Get queue status for a service
  async getQueueStatus(serviceId, queueDate = null) {
    try {
      if (!queueDate) {
        queueDate = moment().format('YYYY-MM-DD');
      }

      const [tickets] = await db.execute(
        `SELECT qt.*, u.first_name, u.last_name, u.phone, s.name as service_name
         FROM queue_tickets qt
         LEFT JOIN users u ON qt.user_id = u.id
         LEFT JOIN services s ON qt.service_id = s.id
         WHERE qt.service_id = ? AND qt.queue_date = ?
         ORDER BY qt.priority DESC, qt.position_in_queue ASC`,
        [serviceId, queueDate]
      );

      const stats = await this.getQueueStats(serviceId, queueDate);

      return {
        tickets,
        stats,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Get queue status error:', error);
      throw error;
    }
  }

  // Get queue statistics
  async getQueueStats(serviceId, queueDate) {
    try {
      const [stats] = await db.execute(
        `SELECT 
           COUNT(CASE WHEN status = 'waiting' THEN 1 END) as waiting_count,
           COUNT(CASE WHEN status = 'called' THEN 1 END) as called_count,
           COUNT(CASE WHEN status = 'serving' THEN 1 END) as serving_count,
           COUNT(CASE WHEN status = 'served' THEN 1 END) as served_count,
           COUNT(CASE WHEN status = 'skipped' THEN 1 END) as skipped_count,
           COUNT(*) as total_count,
           AVG(CASE WHEN status = 'served' AND served_at IS NOT NULL AND called_at IS NOT NULL 
               THEN TIMESTAMPDIFF(MINUTE, called_at, served_at) END) as avg_service_time
         FROM queue_tickets 
         WHERE service_id = ? AND queue_date = ?`,
        [serviceId, queueDate]
      );

      return stats[0] || {
        waiting_count: 0,
        called_count: 0,
        serving_count: 0,
        served_count: 0,
        skipped_count: 0,
        total_count: 0,
        avg_service_time: null
      };
    } catch (error) {
      console.error('Get queue stats error:', error);
      return {
        waiting_count: 0,
        called_count: 0,
        serving_count: 0,
        served_count: 0,
        skipped_count: 0,
        total_count: 0,
        avg_service_time: null
      };
    }
  }

  // Get ticket by ID
  async getTicketById(ticketId) {
    try {
      const [tickets] = await db.execute(
        `SELECT qt.*, u.first_name, u.last_name, u.phone, u.email, s.name as service_name
         FROM queue_tickets qt
         LEFT JOIN users u ON qt.user_id = u.id
         LEFT JOIN services s ON qt.service_id = s.id
         WHERE qt.id = ?`,
        [ticketId]
      );

      return tickets[0] || null;
    } catch (error) {
      console.error('Get ticket by ID error:', error);
      return null;
    }
  }

  // Get user's current ticket
  async getUserCurrentTicket(userId, serviceId = null) {
    try {
      const queueDate = moment().format('YYYY-MM-DD');
      let query = `
        SELECT qt.*, s.name as service_name, s.duration_minutes
        FROM queue_tickets qt
        LEFT JOIN services s ON qt.service_id = s.id
        WHERE qt.user_id = ? AND qt.queue_date = ? AND qt.status IN ('waiting', 'called', 'serving')
      `;
      let params = [userId, queueDate];

      if (serviceId) {
        query += ' AND qt.service_id = ?';
        params.push(serviceId);
      }

      query += ' ORDER BY qt.created_at DESC LIMIT 1';

      const [tickets] = await db.execute(query, params);
      return tickets[0] || null;
    } catch (error) {
      console.error('Get user current ticket error:', error);
      return null;
    }
  }

  // Cancel ticket
  async cancelTicket(ticketId, userId = null) {
    try {
      let query = 'UPDATE queue_tickets SET status = "cancelled" WHERE id = ?';
      let params = [ticketId];

      if (userId) {
        query += ' AND user_id = ?';
        params.push(userId);
      }

      const [result] = await db.execute(query, params);

      if (result.affectedRows === 0) {
        throw new Error('Ticket not found or cannot be cancelled');
      }

      const ticket = await this.getTicketById(ticketId);

      // Update queue positions
      if (ticket) {
        await this.updateQueuePositions(ticket.service_id, ticket.queue_date);

        // Emit real-time updates
        if (this.io) {
          this.io.to(`queue-${ticket.service_id}`).emit('queue-updated', {
            action: 'ticket-cancelled',
            ticket: ticket,
            queueStats: await this.getQueueStats(ticket.service_id, ticket.queue_date)
          });

          this.io.to('admin-room').emit('admin-update', {
            type: 'ticket-cancelled',
            ticket: ticket
          });
        }
      }

      return ticket;
    } catch (error) {
      console.error('Cancel ticket error:', error);
      throw error;
    }
  }
}

module.exports = new QueueService();
