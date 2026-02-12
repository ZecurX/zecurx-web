const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
});

async function addTestSeminar() {
    const client = await pool.connect();
    
    try {
        // Insert test seminar
        const result = await client.query(`
            INSERT INTO seminar.seminars (
                title,
                description,
                date,
                time,
                duration,
                speaker_name,
                speaker_title,
                seminar_type,
                topic,
                location_type,
                venue_address,
                max_attendees,
                organization_name,
                contact_person,
                contact_email,
                contact_phone,
                status,
                registration_enabled,
                certificate_enabled
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
            ) RETURNING *
        `, [
            'Test Seminar - Cybersecurity Fundamentals',
            'A comprehensive introduction to cybersecurity best practices and threat mitigation strategies. This seminar covers essential security concepts for modern applications.',
            new Date('2026-03-15T10:00:00Z'),
            '10:00 AM IST',
            '2 hours',
            'John Doe',
            'Senior Security Engineer at ZecurX',
            'Technical Workshop',
            'Cybersecurity',
            'onsite',
            'ZecurX Office, Bangalore, India',
            50,
            'ZecurX Technologies',
            'Admin Team',
            'admin@zecurx.com',
            '+91 9876543210',
            'approved',
            true,
            true
        ]);
        
        console.log('✅ Test seminar added successfully!\n');
        console.log('Seminar Details:');
        console.log('ID:', result.rows[0].id);
        console.log('Title:', result.rows[0].title);
        console.log('Date:', result.rows[0].date);
        console.log('Speaker:', result.rows[0].speaker_name);
        console.log('Status:', result.rows[0].status);
        console.log('Max Attendees:', result.rows[0].max_attendees);
        
        // Verify by selecting
        const verify = await client.query(
            'SELECT COUNT(*) as count FROM seminar.seminars WHERE title LIKE $1',
            ['%Test Seminar%']
        );
        console.log('\n✅ Verification: Found', verify.rows[0].count, 'test seminar(s) in database');
        
    } catch (err) {
        console.error('❌ Error adding test seminar:');
        console.error(err.message);
        console.error(err);
    } finally {
        client.release();
        await pool.end();
    }
}

addTestSeminar();
