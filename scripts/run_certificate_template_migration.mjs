// Run this script to create the seminar.certificate_templates table
// Usage: node scripts/run_certificate_template_migration.mjs

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

const migrationSQL = readFileSync(join(__dirname, '..', 'sql', 'certificate_templates.sql'), 'utf-8');

async function runMigration() {
    console.log('🚀 Running certificate_templates migration...');
    console.log('📡 Connecting to database...');

    try {
        const client = await pool.connect();
        console.log('✅ Connected to database');

        console.log('📝 Creating table...');
        await client.query(migrationSQL);
        console.log('✅ Migration completed successfully!');

        const result = await client.query(`
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'seminar'
            AND table_name = 'certificate_templates'
        `);

        console.log('\n📋 Created tables:');
        result.rows.forEach(row => console.log(`   - seminar.${row.table_name}`));

        client.release();
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigration();
