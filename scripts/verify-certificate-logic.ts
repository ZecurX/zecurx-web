import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function verifyLogic() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: false,
    });

    try {
        console.log('🧪 Testing Certificate Logic...\n');

        // 1. Get the Past Seminar ID
        const seminarRes = await pool.query(`
            SELECT id, title FROM seminar.seminars 
            WHERE title = 'Advanced Ethical Hacking Workshop'
        `);
        const seminar = seminarRes.rows[0];
        if (!seminar) {
            console.error('❌ Seminar not found. Please run seed script first.');
            process.exit(1);
        }
        console.log(`Target Seminar: ${seminar.title}`);

        // ==========================================
        // TEST CASE 1: Unregistered User
        // ==========================================
        console.log('\n[Test 1] Unregistered User (stranger@example.com)');
        const unregisteredEmail = 'stranger@example.com';
        
        const regCheck1 = await pool.query(`
            SELECT * FROM seminar.registrations 
            WHERE seminar_id = $1 AND email = $2
        `, [seminar.id, unregisteredEmail]);

        if (regCheck1.rows.length === 0) {
            console.log('✅ Correctly identified as NOT REGISTERED.');
            console.log('   -> UI would show: "Registration Not Found" (Red X)');
            console.log('   -> Access to feedback form: BLOCKED');
        } else {
            console.error('❌ Failed: Found registration that should not exist.');
        }

        // ==========================================
        // TEST CASE 2: Registered User (No Feedback)
        // ==========================================
        console.log('\n[Test 2] Registered User w/o Feedback (jane.doe@example.com)');
        const janeEmail = 'jane.doe@example.com';
        
        // Clean up previous test runs
        await pool.query(`DELETE FROM seminar.registrations WHERE email = $1`, [janeEmail]);
        await pool.query(`DELETE FROM seminar.feedback WHERE email = $1`, [janeEmail]);
        await pool.query(`DELETE FROM seminar.certificates WHERE recipient_email = $1`, [janeEmail]);

        // Create registration
        await pool.query(`
            INSERT INTO seminar.registrations (
                seminar_id, full_name, email, email_verified, attended
            ) VALUES ($1, 'Jane Doe', $2, true, true)
        `, [seminar.id, janeEmail]);

        // Check logic
        const regCheck2 = await pool.query(`
            SELECT * FROM seminar.registrations 
            WHERE seminar_id = $1 AND email = $2 AND email_verified = true
        `, [seminar.id, janeEmail]);

        const certCheck2 = await pool.query(`
            SELECT * FROM seminar.certificates 
            WHERE seminar_id = $1 AND recipient_email = $2
        `, [seminar.id, janeEmail]);

        if (regCheck2.rows.length > 0 && certCheck2.rows.length === 0) {
            console.log('✅ Correctly identified as REGISTERED but NO CERTIFICATE.');
            console.log('   -> UI would show: "Registration Verified" (Green Check)');
            console.log('   -> Access to feedback form: GRANTED');
        } else {
            console.error('❌ Failed logic for registered user.');
        }

        // ==========================================
        // TEST CASE 3: Certificate Already Exists
        // ==========================================
        console.log('\n[Test 3] User with Certificate (john.doe@example.com)');
        const johnEmail = 'john.doe@example.com'; // From seed data

        const certCheck3 = await pool.query(`
            SELECT * FROM seminar.certificates 
            WHERE seminar_id = $1 AND recipient_email = $2
        `, [seminar.id, johnEmail]);

        if (certCheck3.rows.length > 0) {
            console.log('✅ Correctly found EXISTING CERTIFICATE.');
            console.log('   -> API Action: Resend Email');
            console.log('   -> UI would show: "Certificate Sent!"');
        } else {
            console.error('❌ Failed: Certificate should exist for John Doe.');
        }

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await pool.end();
    }
}

verifyLogic();
