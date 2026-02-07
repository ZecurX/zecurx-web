const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function search() {
  const schemas = ['public', 'zecurx_admin', 'seminar', 'zecurx_user'];
  for (const schema of schemas) {
    const tablesRes = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = $1", [schema]);
    for (const table of tablesRes.rows) {
      const colsRes = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2 AND data_type IN ('text', 'character varying')", [schema, table.table_name]);
      for (const col of colsRes.rows) {
        try {
          const sql = `SELECT "${col.column_name}" FROM "${schema}"."${table.table_name}" WHERE "${col.column_name}" LIKE $1 LIMIT 1`;
          const res = await pool.query(sql, ['%linodeobjects.com%']);
          if (res.rows.length > 0) {
            console.log(`Found Linode URL in ${schema}.${table.table_name}.${col.column_name}: ${res.rows[0][col.column_name]}`);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }
  pool.end();
}

search();
