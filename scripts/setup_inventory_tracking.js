const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://zecurx:zecurxdb2026@209.38.155.227:5432/zecurx_platform?schema=zecurx_admin',
    ssl: false,
});

async function setupInventoryTracking() {
    const client = await pool.connect();
    
    try {
        const sqlPath = path.join(__dirname, 'add_inventory_tracking.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('Creating inventory tracking trigger and function...');
        await client.query(sql);
        console.log('✓ Inventory tracking enabled');
        
        await client.query('SET search_path TO zecurx_admin, public');
        const checkTrigger = await client.query(`
            SELECT trigger_name 
            FROM information_schema.triggers 
            WHERE event_object_schema = 'zecurx_admin' 
            AND event_object_table = 'shop_orders'
            AND trigger_name = 'trigger_decrement_stock'
        `);
        
        if (checkTrigger.rows.length > 0) {
            console.log('✓ Verified trigger:', checkTrigger.rows[0].trigger_name);
        }
    } catch (error) {
        console.error('Error setting up inventory tracking:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

setupInventoryTracking()
    .then(() => {
        console.log('✓ Setup complete');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Setup failed:', error);
        process.exit(1);
    });
