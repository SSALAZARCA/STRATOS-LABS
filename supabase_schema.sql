-- Database Schema for Stratos Labs

-- 1. Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  image_url TEXT,
  model_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Contacts Table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Settings Table
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Initial Settings
INSERT INTO settings (key, value) VALUES 
('n8n_webhook_url', 'https://n8n-psckg4osc0s0kw0o444ggwks.72.62.130.152.sslip.io/webhook-test/chat-bot'),
('n8n_api_key', '');

-- RLS Policies (Simplified for development, adjust for production)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON products FOR SELECT USING (true);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
