require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function run() {
    console.log('Connecting to DB...');
    let client;
    try {
        client = await pool.connect();

        console.log('Updating constraint...');

        // Attempt to drop and recreate constraint
        // Note: The table is in 'seminar' schema

        await client.query('BEGIN');

        await client.query(`
            ALTER TABLE seminar.otp_verifications 
            DROP CONSTRAINT IF EXISTS otp_verifications_purpose_check;
        `);

        await client.query(`
            ALTER TABLE seminar.otp_verifications 
            ADD CONSTRAINT otp_verifications_purpose_check 
            CHECK (purpose IN ('registration', 'certificate', 'admin_login'));
        `);

        await client.query('COMMIT');

        console.log('Constraint updated successfully.');

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error updating constraint:', err);
    } finally {
        if (client) client.release();
        await pool.end();
    }
}

run();
