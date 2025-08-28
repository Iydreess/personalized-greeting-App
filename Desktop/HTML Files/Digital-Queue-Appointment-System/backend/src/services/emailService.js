const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      const mailOptions = {
        from: `"Digital Queue System" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email send error:', error);
      throw error;
    }
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  async sendWelcomeEmail(email, firstName) {
    const subject = 'Welcome to Digital Queue System';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Digital Queue System</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Digital Queue System!</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Thank you for joining our Digital Queue System. We're excited to help you manage your appointments and queue experiences more efficiently.</p>
            
            <h3>What you can do now:</h3>
            <ul>
              <li>📅 Book appointments online</li>
              <li>🎫 Join virtual queues</li>
              <li>⏰ Track your position in real-time</li>
              <li>📱 Receive notifications via SMS and email</li>
              <li>⭐ Rate and provide feedback on services</li>
            </ul>

            <p>Ready to get started? Log in to your account and explore all the features!</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/login" class="button">Login to Your Account</a>
            </div>

            <p>If you have any questions or need assistance, feel free to contact our support team.</p>
            
            <p>Best regards,<br>The Digital Queue System Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${email}</p>
            <p>© 2024 Digital Queue System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(email, subject, html);
  }

  async sendAppointmentConfirmation(email, appointmentData) {
    const subject = 'Appointment Confirmation';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Appointment Confirmed</h1>
          </div>
          <div class="content">
            <h2>Hello ${appointmentData.firstName}!</h2>
            <p>Your appointment has been successfully confirmed. Please find the details below:</p>
            
            <div class="appointment-details">
              <h3>📋 Appointment Details</h3>
              <div class="detail-row">
                <span class="label">Confirmation Code:</span>
                <span class="value"><strong>${appointmentData.confirmationCode}</strong></span>
              </div>
              <div class="detail-row">
                <span class="label">Service:</span>
                <span class="value">${appointmentData.serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${appointmentData.date}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">${appointmentData.time}</span>
              </div>
              <div class="detail-row">
                <span class="label">Duration:</span>
                <span class="value">${appointmentData.duration} minutes</span>
              </div>
            </div>

            <h3>📝 Important Notes:</h3>
            <ul>
              <li>Please arrive 10 minutes before your scheduled time</li>
              <li>Bring this confirmation code: <strong>${appointmentData.confirmationCode}</strong></li>
              <li>You'll receive a reminder 24 hours before your appointment</li>
              <li>You can reschedule or cancel up to 2 hours before the appointment</li>
            </ul>

            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/appointments" class="button">Manage Appointments</a>
            </div>

            <p>Best regards,<br>The Digital Queue System Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${email}</p>
            <p>© 2024 Digital Queue System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(email, subject, html);
  }

  async sendAppointmentReminder(email, appointmentData) {
    const subject = 'Appointment Reminder - Tomorrow';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ffc107, #e0a800); color: #333; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .button { display: inline-block; background: #ffc107; color: #333; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Appointment Reminder</h1>
          </div>
          <div class="content">
            <h2>Hello ${appointmentData.firstName}!</h2>
            <p>This is a friendly reminder about your upcoming appointment tomorrow.</p>
            
            <div class="appointment-details">
              <h3>📋 Appointment Details</h3>
              <div class="detail-row">
                <span class="label">Confirmation Code:</span>
                <span class="value"><strong>${appointmentData.confirmationCode}</strong></span>
              </div>
              <div class="detail-row">
                <span class="label">Service:</span>
                <span class="value">${appointmentData.serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${appointmentData.date}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">${appointmentData.time}</span>
              </div>
            </div>

            <h3>📝 Reminders:</h3>
            <ul>
              <li>⏰ Arrive 10 minutes early</li>
              <li>🎫 Bring your confirmation code</li>
              <li>📞 Call us if you need to reschedule</li>
              <li>💼 Bring any required documents</li>
            </ul>

            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/appointments" class="button">View Appointment</a>
            </div>

            <p>We look forward to serving you!</p>
            
            <p>Best regards,<br>The Digital Queue System Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${email}</p>
            <p>© 2024 Digital Queue System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(email, subject, html);
  }

  async sendQueueNotification(email, queueData) {
    const subject = `Queue Update - You're ${queueData.position <= 3 ? 'Next!' : `#${queueData.position}`}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Queue Position Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #17a2b8, #138496); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .queue-status { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8; text-align: center; }
          .position { font-size: 3em; font-weight: bold; color: #17a2b8; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .button { display: inline-block; background: #17a2b8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎫 Queue Position Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${queueData.firstName || 'Customer'}!</h2>
            <p>Here's an update on your position in the queue:</p>
            
            <div class="queue-status">
              <h3>Your Current Position</h3>
              <div class="position">#${queueData.position}</div>
              <p>${queueData.position <= 3 ? 'You\'re almost next! Please be ready.' : `Estimated wait time: ${queueData.estimatedWait} minutes`}</p>
              
              <div class="detail-row">
                <span class="label">Ticket Number:</span>
                <span class="value"><strong>${queueData.ticketNumber}</strong></span>
              </div>
              <div class="detail-row">
                <span class="label">Service:</span>
                <span class="value">${queueData.serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Queue Date:</span>
                <span class="value">${queueData.date}</span>
              </div>
            </div>

            ${queueData.position <= 3 ? `
              <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 15px; margin: 20px 0;">
                <strong>⚠️ Important:</strong> Please make sure you're available and ready to be served soon!
              </div>
            ` : ''}

            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/queue" class="button">View Live Queue</a>
            </div>

            <p>Thank you for your patience!</p>
            
            <p>Best regards,<br>The Digital Queue System Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${email}</p>
            <p>© 2024 Digital Queue System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(email, subject, html);
  }
}

module.exports = new EmailService();
