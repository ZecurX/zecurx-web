const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
    max: 1,
    connectionTimeoutMillis: 5000,
});

async function testConnection() {
    console.log('Testing database connection...\n');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    try {
        const client = await pool.connect();
        console.log('✅ Database connection successful!\n');
        
        // Test query
        const result = await client.query('SELECT NOW() as current_time, version() as version');
        console.log('Current time:', result.rows[0].current_time);
        console.log('PostgreSQL version:', result.rows[0].version.split(',')[0]);
        
        // Check schemas
        const schemas = await client.query(`
            SELECT schema_name 
            FROM information_schema.schemata 
            WHERE schema_name IN ('zecurx_admin', 'seminar', 'public')
            ORDER BY schema_name
        `);
        console.log('\nAvailable schemas:', schemas.rows.map(r => r.schema_name).join(', '));
        
        // Test search_path
        const searchPath = await client.query('SHOW search_path');
        console.log('Search path:', searchPath.rows[0].search_path);
        
        client.release();
        console.log('\n✅ All database checks passed!');
        
    } catch (err) {
        console.error('❌ Database connection failed:');
        console.error('Error:', err.message);
        console.error('\nFull error:', err);
    } finally {
        await pool.end();
    }
}

testConnection();
