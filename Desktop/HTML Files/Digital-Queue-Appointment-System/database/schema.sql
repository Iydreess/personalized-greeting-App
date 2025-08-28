-- Digital Queue & Appointment Booking System Database Schema
-- Version: 1.0
-- Date: May 15, 2024

-- Create database
CREATE DATABASE IF NOT EXISTS digital_queue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE digital_queue;

-- Users table (for both customers and staff)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'staff', 'admin') DEFAULT 'customer',
    language_preference VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    profile_image VARCHAR(255),
    date_of_birth DATE,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_role (role)
);

-- Services table
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL DEFAULT 30,
    price DECIMAL(10,2) DEFAULT 0.00,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    requires_appointment BOOLEAN DEFAULT TRUE,
    max_daily_capacity INT DEFAULT 50,
    color_code VARCHAR(7) DEFAULT '#007bff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active)
);

-- Service staff assignments
CREATE TABLE service_staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    staff_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_service_staff (service_id, staff_id)
);

-- Time slots table
CREATE TABLE time_slots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    day_of_week TINYINT NOT NULL, -- 0=Sunday, 1=Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT NOT NULL DEFAULT 30,
    max_concurrent_appointments INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    INDEX idx_service_day (service_id, day_of_week),
    INDEX idx_active (is_active)
);

-- Appointments table
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    staff_id INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    notes TEXT,
    confirmation_code VARCHAR(20) UNIQUE,
    reminded_at TIMESTAMP NULL,
    checked_in_at TIMESTAMP NULL,
    served_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    rating TINYINT, -- 1-5 rating
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_date (user_id, appointment_date),
    INDEX idx_service_date (service_id, appointment_date),
    INDEX idx_status (status),
    INDEX idx_confirmation (confirmation_code)
);

-- Queue tickets table
CREATE TABLE queue_tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    service_id INT NOT NULL,
    ticket_number VARCHAR(20) NOT NULL,
    queue_date DATE NOT NULL,
    priority TINYINT DEFAULT 1, -- 1=normal, 2=priority, 3=emergency
    status ENUM('waiting', 'called', 'serving', 'served', 'skipped', 'cancelled') DEFAULT 'waiting',
    position_in_queue INT,
    estimated_wait_minutes INT,
    called_at TIMESTAMP NULL,
    served_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    notes TEXT,
    is_walk_in BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE KEY unique_ticket_date (ticket_number, queue_date),
    INDEX idx_service_date (service_id, queue_date),
    INDEX idx_status (status),
    INDEX idx_position (position_in_queue)
);

-- Notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    type ENUM('email', 'sms', 'push', 'system') NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    status ENUM('pending', 'sent', 'failed', 'delivered') DEFAULT 'pending',
    priority TINYINT DEFAULT 1, -- 1=low, 2=normal, 3=high, 4=urgent
    scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    retry_count TINYINT DEFAULT 0,
    error_message TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_type (user_id, type),
    INDEX idx_status (status),
    INDEX idx_scheduled (scheduled_at)
);

-- Analytics events table
CREATE TABLE analytics_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_type VARCHAR(100) NOT NULL,
    user_id INT,
    session_id VARCHAR(255),
    entity_type VARCHAR(50), -- 'appointment', 'queue', 'service', etc.
    entity_id INT,
    event_data JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_event_type (event_type),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
);

-- System settings table
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key)
);

-- Session tokens table (for JWT blacklisting)
CREATE TABLE session_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_blacklisted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token_hash (token_hash),
    INDEX idx_user_expires (user_id, expires_at)
);

-- Feedback table
CREATE TABLE feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    appointment_id INT,
    queue_ticket_id INT,
    service_id INT NOT NULL,
    rating TINYINT NOT NULL, -- 1-5
    comment TEXT,
    feedback_type ENUM('appointment', 'queue', 'general') NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (queue_ticket_id) REFERENCES queue_tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    INDEX idx_service_rating (service_id, rating),
    INDEX idx_created (created_at)
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_editable) VALUES
('system_name', 'Digital Queue System', 'string', 'Name of the system displayed to users', TRUE),
('default_language', 'en', 'string', 'Default language for the system', TRUE),
('working_hours_start', '08:00', 'string', 'Daily working hours start time', TRUE),
('working_hours_end', '17:00', 'string', 'Daily working hours end time', TRUE),
('working_days', '[1,2,3,4,5]', 'json', 'Working days (0=Sunday, 1=Monday, etc.)', TRUE),
('max_advance_booking_days', '30', 'number', 'Maximum days in advance for booking', TRUE),
('reminder_hours_before', '24', 'number', 'Hours before appointment to send reminder', TRUE),
('queue_update_interval', '30', 'number', 'Queue status update interval in seconds', TRUE),
('max_queue_size', '100', 'number', 'Maximum number of people in queue', TRUE),
('enable_sms_notifications', 'true', 'boolean', 'Enable SMS notifications', TRUE),
('enable_email_notifications', 'true', 'boolean', 'Enable email notifications', TRUE),
('auto_confirm_appointments', 'false', 'boolean', 'Automatically confirm appointments', TRUE);

-- Insert default admin user (password: admin123)
INSERT INTO users (first_name, last_name, email, phone, password_hash, role, is_active, email_verified, phone_verified) VALUES
('System', 'Administrator', 'admin@digitalqueue.com', '+1234567890', '$2b$10$rQKGH8zGJLZWJB9cGJjxWO7wVq7vMkHoLcR6cKZoGJLZWJB9cGJjxW', 'admin', TRUE, TRUE, TRUE);

-- Insert sample services
INSERT INTO services (name, description, duration_minutes, category, requires_appointment, max_daily_capacity, color_code) VALUES
('General Consultation', 'General medical consultation and checkup', 30, 'Medical', TRUE, 20, '#007bff'),
('Document Processing', 'Process official documents and certificates', 15, 'Administrative', FALSE, 50, '#28a745'),
('Payment Services', 'Bill payments and financial transactions', 10, 'Financial', FALSE, 100, '#ffc107'),
('Technical Support', 'IT and technical assistance', 45, 'Technical', TRUE, 10, '#dc3545');

-- Insert sample time slots for services (Monday to Friday, 8 AM to 5 PM)
INSERT INTO time_slots (service_id, day_of_week, start_time, end_time, slot_duration_minutes) VALUES
-- General Consultation (Service ID 1)
(1, 1, '08:00:00', '17:00:00', 30),
(1, 2, '08:00:00', '17:00:00', 30),
(1, 3, '08:00:00', '17:00:00', 30),
(1, 4, '08:00:00', '17:00:00', 30),
(1, 5, '08:00:00', '17:00:00', 30),
-- Document Processing (Service ID 2)
(2, 1, '08:00:00', '17:00:00', 15),
(2, 2, '08:00:00', '17:00:00', 15),
(2, 3, '08:00:00', '17:00:00', 15),
(2, 4, '08:00:00', '17:00:00', 15),
(2, 5, '08:00:00', '17:00:00', 15),
-- Payment Services (Service ID 3)
(3, 1, '08:00:00', '17:00:00', 10),
(3, 2, '08:00:00', '17:00:00', 10),
(3, 3, '08:00:00', '17:00:00', 10),
(3, 4, '08:00:00', '17:00:00', 10),
(3, 5, '08:00:00', '17:00:00', 10),
-- Technical Support (Service ID 4)
(4, 1, '08:00:00', '17:00:00', 45),
(4, 2, '08:00:00', '17:00:00', 45),
(4, 3, '08:00:00', '17:00:00', 45),
(4, 4, '08:00:00', '17:00:00', 45),
(4, 5, '08:00:00', '17:00:00', 45);
