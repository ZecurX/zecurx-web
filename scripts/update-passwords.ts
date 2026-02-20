import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const DATABASE_URL = 'postgresql://zecurx:ozOz8Iusvg53J91EEyB3wABWqW2qc8nG@65.21.191.184:5432/zecurx_platform?schema=zecurx_admin';

const pool = new Pool({
    connectionString: DATABASE_URL,
});

async function run() {
    const newPassword = 'Zecurx@Admin2026';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        const res = await pool.query(
            "UPDATE zecurx_admin.admins SET password_hash = $1 WHERE role != 'super_admin' RETURNING email, role",
            [hashedPassword]
        );
        console.log('Updated passwords for:', res.rows.map(r => r.email));
        console.log('New password for all standard admins:', newPassword);
    } catch (err) {
        console.error('Update error:', err);
    } finally {
        await pool.end();
    }
}

run();
