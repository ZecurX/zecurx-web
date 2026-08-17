-- Academy "Book Your Slot" feature: admin-defined batches + deposit/balance bookings
SET search_path TO zecurx_admin, public;

-- Admin-defined batches (slots) that a course can be booked into
CREATE TABLE IF NOT EXISTS course_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  capacity INT NOT NULL DEFAULT 30,
  seats_booked INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- active | closed | cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_batches_plan_id ON course_batches(plan_id);
CREATE INDEX IF NOT EXISTS idx_course_batches_status ON course_batches(status);

-- One row per deposit-paid slot booking. Created only once the deposit payment is verified
-- (mirrors how `customers`/`transactions` are only written on verify-payment, not at order-creation).
CREATE TABLE IF NOT EXISTS course_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(), -- passwordless access key (public site has no login)
  batch_id UUID NOT NULL REFERENCES course_batches(id),
  plan_id UUID NOT NULL REFERENCES plans(id),
  customer_id UUID REFERENCES customers(id),
  customer_name TEXT,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  deposit_amount NUMERIC NOT NULL DEFAULT 2000,
  total_amount NUMERIC NOT NULL,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  deposit_order_id TEXT,
  deposit_payment_id TEXT UNIQUE,
  balance_order_id TEXT,
  balance_payment_id TEXT UNIQUE,
  -- pending_deposit | slot_booked | fully_paid | cancelled
  status TEXT NOT NULL DEFAULT 'pending_deposit',
  deposit_paid_at TIMESTAMP WITH TIME ZONE,
  -- deposit_paid_at + 15 days; the "Payment Due" badge is computed by comparing this to NOW(),
  -- not stored as a separate boolean, so it flips automatically with no cron job required.
  payment_due_at TIMESTAMP WITH TIME ZONE,
  fully_paid_at TIMESTAMP WITH TIME ZONE,
  -- Manual admin toggle for actual course-material access; the payment badge never gates this itself.
  course_access_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_bookings_batch_id ON course_bookings(batch_id);
CREATE INDEX IF NOT EXISTS idx_course_bookings_status ON course_bookings(status);
CREATE INDEX IF NOT EXISTS idx_course_bookings_customer_email ON course_bookings(customer_email);
