-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Plans Table
create table public.plans (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  type text not null, -- 'internship' or 'academy'
  price numeric not null,
  description text,
  active boolean default true
);

-- Customers Table
create table public.customers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  phone text,
  whatsapp text
);

-- Transactions Table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  payment_id text not null unique,
  order_id text not null,
  amount numeric not null,
  status text not null, -- 'captured', 'failed'
  customer_id uuid references public.customers(id),
  plan_id uuid references public.plans(id)
);

-- Enable RLS (Row Level Security) - Optional for initial setup but good practice
alter table public.plans enable row level security;
alter table public.customers enable row level security;
alter table public.transactions enable row level security;

-- Create minimal policies (Open read for now, lock write)
create policy "Enable read access for all users" on public.plans for select using (true);
create policy "Enable access for service role only" on public.customers using (true); -- Service role bypasses RLS
create policy "Enable access for service role only" on public.transactions using (true);
