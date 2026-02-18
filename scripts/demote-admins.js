require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

const SUPER_USERS = [
    'zecurxintern@gmail.com',
    'mohitsen.official16@gmail.com',
    'hrshpriyam@gmail.com'
];

async function run() {
    console.log('Connecting to DB...');
    let client;
    try {
        client = await pool.connect();
        await client.query('SET search_path TO zecurx_admin, seminar, public');

        console.log('Demoting unauthorized super admins...');

        // Update all admins who have role 'super_admin' but are NOT in the list
        // Set them to 'admin'

        const placeholders = SUPER_USERS.map((_, i) => `$${i + 1}`).join(', ');

        const res = await client.query(`
            UPDATE admins 
            SET role = 'admin' 
            WHERE role = 'super_admin' 
            AND email NOT IN (${placeholders})
            RETURNING email, role
        `, SUPER_USERS);

        console.log('Demoted the following users:');
        console.table(res.rows);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (client) client.release();
        await pool.end();
    }
}

run();
