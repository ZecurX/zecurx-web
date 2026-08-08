// Evolves certificate_templates into a library + adds per-seminar selection
// Usage: node scripts/run_certificate_template_v2_migration.mjs

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const migrationSQL = readFileSync(join(__dirname, '..', 'sql', 'certificate_templates_v2_library.sql'), 'utf-8');

async function runMigration() {
    console.log('🚀 Running certificate_templates library migration...');
    try {
        const client = await pool.connect();
        console.log('✅ Connected to database');

        await client.query(migrationSQL);
        console.log('✅ Migration completed successfully!');

        const cols = await client.query(`
            SELECT column_name FROM information_schema.columns
            WHERE table_schema = 'seminar' AND table_name = 'certificate_templates'
            ORDER BY ordinal_position
        `);
        console.log('\n📋 seminar.certificate_templates columns:');
        cols.rows.forEach(row => console.log(`   - ${row.column_name}`));

        const seminarCol = await client.query(`
            SELECT column_name FROM information_schema.columns
            WHERE table_schema = 'seminar' AND table_name = 'seminars' AND column_name = 'certificate_template_id'
        `);
        console.log(`\n📋 seminar.seminars.certificate_template_id: ${seminarCol.rows.length ? 'present' : 'MISSING'}`);

        client.release();
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigration();
