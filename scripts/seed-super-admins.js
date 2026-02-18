require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

const superUsers = [
    { email: 'zecurxintern@gmail.com', name: 'ZecurX Intern' },
    { email: 'mohitsen.official16@gmail.com', name: 'Mohit Sen' },
    { email: 'hrshpriyam@gmail.com', name: 'Harsh Priyam' }
];

const normalUser = {
    email: 'normaladmin@zecurx.com',
    name: 'Normal Admin',
    role: 'admin',
    password: 'password123'
};

async function seed() {
    console.log('Connecting to DB...');
    let client;
    try {
        client = await pool.connect();

        // Set schema path
        await client.query('SET search_path TO zecurx_admin, seminar, public');

        // Seed Super Users
        for (const user of superUsers) {
            console.log(`Upserting super user ${user.email}...`);
            // Upsert
            await client.query(`
                INSERT INTO admins (email, name, role, is_active, password_hash, created_at, updated_at)
                VALUES ($1, $2, 'super_admin', true, 'skip_password_check', NOW(), NOW())
                ON CONFLICT (email) DO UPDATE SET role = 'super_admin', is_active = true, password_hash = 'skip_password_check';
             `, [user.email, user.name]);
        }

        // Seed Normal User
        console.log(`Upserting normal user ${normalUser.email}...`);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(normalUser.password, salt);

        await client.query(`
            INSERT INTO admins (email, name, role, is_active, password_hash, created_at, updated_at)
            VALUES ($1, $2, $3, true, $4, NOW(), NOW())
            ON CONFLICT (email) DO UPDATE SET role = $3, is_active = true, password_hash = $4;
        `, [normalUser.email, normalUser.name, normalUser.role, hash]);

        console.log('Seeding complete.');

    } catch (err) {
        console.error('Error seeding:', err);
    } finally {
        if (client) client.release();
        await pool.end();
    }
}

seed();
