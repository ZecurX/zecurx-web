import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const DATABASE_URL = 'postgresql://zecurx:ozOz8Iusvg53J91EEyB3wABWqW2qc8nG@65.21.191.184:5432/zecurx_platform?schema=zecurx_admin';

const pool = new Pool({
    connectionString: DATABASE_URL,
});

async function run() {
    const usersToUpdate = [
        { role: 'sales', password: 'Marketing@1234', emailPattern: 'marketing%' },
        { role: 'marketing', password: 'Marketing@1234', emailPattern: 'marketing%' },
        { role: 'sales', password: 'Sales@1234', emailPattern: 'sales%' }
    ];

    try {
        // 1. Marketing
        const marketingPass = 'Marketing@1234';
        const marketingHash = await bcrypt.hash(marketingPass, 10);
        const mktResult = await pool.query(
            "UPDATE zecurx_admin.admins SET password_hash = $1 WHERE email LIKE 'marketing%' AND role != 'super_admin' RETURNING email",
            [marketingHash]
        );
        console.log(`Updated Marketing users (${marketingPass}):`, mktResult.rows.map(r => r.email));

        // 2. Sales
        const salesPass = 'Sales@1234';
        const salesHash = await bcrypt.hash(salesPass, 10);
        const salesResult = await pool.query(
            "UPDATE zecurx_admin.admins SET password_hash = $1 WHERE email LIKE 'sales%' AND role != 'super_admin' RETURNING email",
            [salesHash]
        );
        console.log(`Updated Sales users (${salesPass}):`, salesResult.rows.map(r => r.email));

        // 3. Media (Assuming media exists too based on previous context, usually paired with marketing)
        const mediaPass = 'Media@1234';
        const mediaHash = await bcrypt.hash(mediaPass, 10);
        const mediaResult = await pool.query(
            "UPDATE zecurx_admin.admins SET password_hash = $1 WHERE email LIKE 'media%' AND role != 'super_admin' RETURNING email",
            [mediaHash]
        );
        console.log(`Updated Media users (${mediaPass}):`, mediaResult.rows.map(r => r.email));

        // 4. General Admin (admin@zecurx.com) - Fallback or specific
        const adminPass = 'Admin@1234';
        const adminHash = await bcrypt.hash(adminPass, 10);
        const adminResult = await pool.query(
            "UPDATE zecurx_admin.admins SET password_hash = $1 WHERE email = 'admin@zecurx.com' AND role != 'super_admin' RETURNING email",
            [adminHash]
        );
        console.log(`Updated General Admin (${adminPass}):`, adminResult.rows.map(r => r.email));

    } catch (err) {
        console.error('Update error:', err);
    } finally {
        await pool.end();
    }
}

run();
