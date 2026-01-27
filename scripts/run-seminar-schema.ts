import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function runSchema() {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
        console.error('DATABASE_URL not found in environment');
        process.exit(1);
    }
    
    console.log('Connecting to database...');
    console.log('Host:', connectionString.split('@')[1]?.split('/')[0] || 'unknown');
    
    const pool = new Pool({
        connectionString,
        ssl: false,
    });

    try {
        const schemaPath = path.join(__dirname, '../doc/seminar-schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running seminar schema...\n');
        
        await pool.query(sql);
        
        console.log('Schema created successfully!\n');
        
        // Verify tables were created
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'seminar'
            ORDER BY table_name
        `);
        
        console.log('Created tables:');
        tables.rows.forEach((row: { table_name: string }) => {
            console.log(`  - seminar.${row.table_name}`);
        });
        
    } catch (error) {
        console.error('Error running schema:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runSchema();
