import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function seedData() {
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
        console.log('🌱 Seeding dummy data...');

        // 1. Create a Past Seminar (Approved)
        console.log('1. Creating past seminar...');
        const pastSeminarRes = await pool.query(`
            INSERT INTO seminar.seminars (
                title, description, date, time, duration, 
                speaker_name, speaker_title, seminar_type, location_type, 
                organization_name, contact_person, contact_email, contact_phone,
                status, registration_enabled, certificate_enabled, created_at
            ) VALUES (
                'Advanced Ethical Hacking Workshop', 
                'Deep dive into network exploitation and privilege escalation techniques.',
                NOW() - INTERVAL '2 days', 
                '10:00 AM EST', 
                '3 hrs',
                'Sarah Connor', 
                'Senior Security Researcher', 
                'Technical Workshop', 
                'online',
                'Tech University', 
                'Dr. Alan Grant', 
                'alan@tech.edu', 
                '+1234567890',
                'approved',
                false,
                true,
                NOW() - INTERVAL '5 days'
            ) RETURNING id, title;
        `);
        const pastSeminarId = pastSeminarRes.rows[0].id;
        console.log(`   ✅ Created: ${pastSeminarRes.rows[0].title} (ID: ${pastSeminarId})`);

        // 2. Create an Upcoming Seminar (Approved)
        console.log('2. Creating upcoming seminar...');
        const upcomingSeminarRes = await pool.query(`
            INSERT INTO seminar.seminars (
                title, description, date, time, duration, 
                speaker_name, speaker_title, seminar_type, location_type, 
                organization_name, contact_person, contact_email,
                status, registration_enabled, certificate_enabled
            ) VALUES (
                'Zero Trust Architecture Fundamentals', 
                'Understanding the core principles of Zero Trust security models.',
                NOW() + INTERVAL '5 days', 
                '2:00 PM EST', 
                '60 min',
                'Kyle Reese', 
                'Chief Security Architect', 
                'Threat Briefing', 
                'online',
                'Cyber Institute', 
                'Miles Dyson', 
                'miles@cyber.org',
                'approved',
                true,
                false
            ) RETURNING id, title;
        `);
        console.log(`   ✅ Created: ${upcomingSeminarRes.rows[0].title}`);

        // 3. Create a Pending Seminar
        console.log('3. Creating pending seminar request...');
        await pool.query(`
            INSERT INTO seminar.seminars (
                title, description, date, time, duration, 
                speaker_name, location_type, 
                organization_name, contact_person, contact_email,
                status
            ) VALUES (
                'Cloud Security Best Practices', 
                'Securing AWS and Azure environments.',
                NOW() + INTERVAL '10 days', 
                '1:00 PM EST', 
                '90 min',
                'T-800', 
                'onsite',
                'Skynet Corp', 
                'John Connor', 
                'john@resistance.org',
                'pending'
            );
        `);
        console.log('   ✅ Created pending seminar request');

        // 4. Register a student for the Past Seminar
        console.log('4. Registering student to past seminar...');
        const registrationRes = await pool.query(`
            INSERT INTO seminar.registrations (
                seminar_id, full_name, email, college_name, year, city_state,
                email_verified, attended, registered_at
            ) VALUES (
                $1, 
                'John Doe', 
                'john.doe@example.com', 
                'Tech University', 
                '3rd Year', 
                'New York, NY',
                true, 
                true,
                NOW() - INTERVAL '3 days'
            ) RETURNING id;
        `, [pastSeminarId]);
        const registrationId = registrationRes.rows[0].id;
        console.log(`   ✅ Registered John Doe (ID: ${registrationId})`);

        // 5. Submit Feedback
        console.log('5. Submitting feedback...');
        const feedbackRes = await pool.query(`
            INSERT INTO seminar.feedback (
                registration_id, seminar_id,
                full_name, email, college_name, year, city_state,
                career_interest, seminar_rating, most_valuable_part,
                certificate_name, submitted_at
            ) VALUES (
                $1, $2,
                'John Doe', 'john.doe@example.com', 'Tech University', '3rd Year', 'New York, NY',
                'Ethical Hacking & Offensive Security', 5, 'The hands-on labs were amazing.',
                'Johnathon Doe', NOW()
            ) RETURNING id;
        `, [registrationId, pastSeminarId]);
        const feedbackId = feedbackRes.rows[0].id;
        console.log(`   ✅ Feedback submitted (ID: ${feedbackId})`);

        // 6. Generate Certificate
        console.log('6. Generating certificate record...');
        const certId = `ZX-SEM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        await pool.query(`
            INSERT INTO seminar.certificates (
                registration_id, feedback_id, seminar_id, certificate_id,
                recipient_name, recipient_email, seminar_title, seminar_date,
                speaker_name, organization, download_count
            ) VALUES (
                $1, $2, $3, $4,
                'Johnathon Doe', 'john.doe@example.com', 
                'Advanced Ethical Hacking Workshop', 
                (NOW() - INTERVAL '2 days')::date,
                'Sarah Connor', 'Tech University', 0
            );
        `, [registrationId, feedbackId, pastSeminarId, certId]);
        console.log(`   ✅ Certificate generated (ID: ${certId})`);

        console.log('\n🎉 Seed completed successfully!');
        console.log('------------------------------------------------');
        console.log('You can now test the following:');
        console.log('1. Admin Dashboard: Check "Seminars" tab');
        console.log(`2. Verify Certificate: /verify/${certId}`);
        console.log('3. Student Registration: Try registering for "Zero Trust Architecture"');
        console.log('------------------------------------------------');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await pool.end();
    }
}

seedData();
