-- Digital Queue & Appointment System - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  avatar_url TEXT,
  date_of_birth DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  address TEXT,
  emergency_contact VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  duration_minutes INTEGER DEFAULT 30,
  price DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  requires_appointment BOOLEAN DEFAULT false,
  max_queue_size INTEGER DEFAULT 50,
  operating_hours JSONB, -- {"monday": {"open": "09:00", "close": "17:00"}, ...}
  staff_required INTEGER DEFAULT 1,
  preparation_time INTEGER DEFAULT 0, -- minutes
  cleanup_time INTEGER DEFAULT 0, -- minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  staff_notes TEXT,
  cancellation_reason TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Queue tickets table
CREATE TABLE IF NOT EXISTS public.queue_tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  ticket_number INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'in_progress', 'completed', 'skipped', 'cancelled')),
  priority INTEGER DEFAULT 0, -- 0 = normal, 1 = high, 2 = urgent
  estimated_wait_time INTEGER, -- minutes
  actual_wait_time INTEGER, -- minutes
  service_start_time TIMESTAMP WITH TIME ZONE,
  service_end_time TIMESTAMP WITH TIME ZONE,
  queue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  called_at TIMESTAMP WITH TIME ZONE,
  served_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'appointment', 'queue', 'reminder')),
  channel VARCHAR(20) DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email', 'sms', 'push')),
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  reference_id UUID, -- appointment_id or queue_ticket_id
  reference_type VARCHAR(20), -- 'appointment' or 'queue_ticket'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Queue counters table (for managing ticket numbers)
CREATE TABLE IF NOT EXISTS public.queue_counters (
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE PRIMARY KEY,
  current_number INTEGER DEFAULT 0,
  last_called_number INTEGER DEFAULT 0,
  queue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service statistics table
CREATE TABLE IF NOT EXISTS public.service_statistics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_appointments INTEGER DEFAULT 0,
  completed_appointments INTEGER DEFAULT 0,
  cancelled_appointments INTEGER DEFAULT 0,
  total_queue_tickets INTEGER DEFAULT 0,
  completed_queue_tickets INTEGER DEFAULT 0,
  average_wait_time INTEGER DEFAULT 0, -- minutes
  average_service_time INTEGER DEFAULT 0, -- minutes
  peak_hour_start TIME,
  peak_hour_end TIME,
  customer_satisfaction_avg DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(service_id, date)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON public.appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_queue_tickets_user_id ON public.queue_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_queue_tickets_service_id ON public.queue_tickets(service_id);
CREATE INDEX IF NOT EXISTS idx_queue_tickets_status ON public.queue_tickets(status);
CREATE INDEX IF NOT EXISTS idx_queue_tickets_date ON public.queue_tickets(queue_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see and edit their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Appointments policies
CREATE POLICY "Users can view own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = user_id);

-- Staff and admin can view all appointments
CREATE POLICY "Staff can view all appointments" ON public.appointments
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.users 
      WHERE role IN ('staff', 'admin')
    )
  );

-- Queue tickets policies
CREATE POLICY "Users can view own queue tickets" ON public.queue_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own queue tickets" ON public.queue_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view all queue tickets" ON public.queue_tickets
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.users 
      WHERE role IN ('staff', 'admin')
    )
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Services are public for reading
CREATE POLICY "Anyone can view services" ON public.services
  FOR SELECT USING (true);

-- Only staff and admin can modify services
CREATE POLICY "Staff can modify services" ON public.services
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.users 
      WHERE role IN ('staff', 'admin')
    )
  );

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_queue_tickets_updated_at BEFORE UPDATE ON public.queue_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_queue_counters_updated_at BEFORE UPDATE ON public.queue_counters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate next queue ticket number
CREATE OR REPLACE FUNCTION get_next_ticket_number(service_uuid UUID, queue_date_param DATE DEFAULT CURRENT_DATE)
RETURNS INTEGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  -- Insert or update the counter for the service and date
  INSERT INTO public.queue_counters (service_id, current_number, queue_date)
  VALUES (service_uuid, 1, queue_date_param)
  ON CONFLICT (service_id) 
  DO UPDATE SET 
    current_number = CASE 
      WHEN public.queue_counters.queue_date = queue_date_param 
      THEN public.queue_counters.current_number + 1
      ELSE 1
    END,
    queue_date = queue_date_param,
    updated_at = NOW()
  RETURNING current_number INTO next_number;
  
  RETURN next_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample services
INSERT INTO public.services (name, description, category, duration_minutes, requires_appointment) VALUES
('General Consultation', 'General medical consultation', 'Medical', 30, true),
('Lab Tests', 'Laboratory testing services', 'Medical', 15, false),
('Vaccination', 'Vaccination services', 'Medical', 10, true),
('Customer Service', 'General customer service inquiries', 'Support', 20, false),
('Technical Support', 'Technical assistance and troubleshooting', 'Support', 45, true)
ON CONFLICT DO NOTHING;
