import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function wipeData() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL not found');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString,
        ssl: false,
    });

    try {
        console.log('🧹 Wiping all seminar data...');

        // Delete in order of dependencies (though CASCADE should handle it, explicit is safer)
        await pool.query('DELETE FROM seminar.otp_verifications');
        console.log('   - Cleared OTPs');
        
        await pool.query('DELETE FROM seminar.certificates');
        console.log('   - Cleared Certificates');
        
        await pool.query('DELETE FROM seminar.feedback');
        console.log('   - Cleared Feedback');
        
        await pool.query('DELETE FROM seminar.registrations');
        console.log('   - Cleared Registrations');
        
        await pool.query('DELETE FROM seminar.seminars');
        console.log('   - Cleared Seminars');

        console.log('\n✨ Database is now clean.');

    } catch (error) {
        console.error('Error wiping data:', error);
    } finally {
        await pool.end();
    }
}

wipeData();
