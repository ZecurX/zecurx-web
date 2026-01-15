-- Create shop_orders table for storing product orders
-- Schema: zecurx_admin

SET search_path TO zecurx_admin, public;

-- Create shop_orders table
CREATE TABLE IF NOT EXISTS shop_orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) UNIQUE NOT NULL,
    payment_id VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_pincode VARCHAR(20),
    total_amount DECIMAL(10, 2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create shop_order_items table for storing individual order items
CREATE TABLE IF NOT EXISTS shop_order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES shop_orders(id) ON DELETE CASCADE,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_shop_orders_order_id ON shop_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_shop_orders_customer_email ON shop_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_shop_orders_payment_id ON shop_orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_shop_order_items_order_id ON shop_order_items(order_id);

-- Add comments
COMMENT ON TABLE shop_orders IS 'Stores shop product orders from checkout';
COMMENT ON TABLE shop_order_items IS 'Stores individual items within each shop order';
COMMENT ON COLUMN shop_orders.order_status IS 'Order fulfillment status: pending, processing, shipped, delivered, cancelled';
COMMENT ON COLUMN shop_orders.payment_status IS 'Payment verification status: pending, captured, failed, refunded';
