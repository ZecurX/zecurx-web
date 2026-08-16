-- Add inventory tracking trigger and function
SET search_path TO zecurx_admin, public;

-- Function to decrement product stock after order
CREATE OR REPLACE FUNCTION decrement_product_stock()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
BEGIN
    FOR item IN 
        SELECT product_id, quantity 
        FROM shop_order_items 
        WHERE order_id = NEW.id
    LOOP
        UPDATE products 
        SET stock = stock - item.quantity
        WHERE id::text = item.product_id
        AND stock >= item.quantity;
        
        IF NOT FOUND THEN
            RAISE WARNING 'Insufficient stock for product % in order %', item.product_id, NEW.order_id;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically decrement stock when order is inserted
CREATE TRIGGER trigger_decrement_stock
AFTER INSERT ON shop_orders
FOR EACH ROW
WHEN (NEW.payment_status = 'captured')
EXECUTE FUNCTION decrement_product_stock();

COMMENT ON FUNCTION decrement_product_stock IS 'Automatically decrements product stock when orders are placed';
COMMENT ON TRIGGER trigger_decrement_stock ON shop_orders IS 'Reduces inventory after successful payment';
