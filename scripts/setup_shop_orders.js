const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://zecurx:zecurxdb2026@209.38.155.227:5432/zecurx_platform?schema=zecurx_admin',
    ssl: false,
});

async function setupShopOrders() {
    const client = await pool.connect();
    
    try {
        const sqlPath = path.join(__dirname, 'create_shop_orders_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('Creating shop_orders and shop_order_items tables...');
        await client.query(sql);
        console.log('✓ Tables created successfully');
        
        await client.query('SET search_path TO zecurx_admin, public');
        const checkResult = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'zecurx_admin' 
            AND table_name IN ('shop_orders', 'shop_order_items')
        `);
        
        if (checkResult.rows && checkResult.rows.length > 0) {
            console.log('✓ Verified tables:', checkResult.rows.map(r => r.table_name).join(', '));
        }
    } catch (error) {
        console.error('Error setting up shop orders:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

setupShopOrders()
    .then(() => {
        console.log('✓ Setup complete');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Setup failed:', error);
        process.exit(1);
    });
