import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

pool.on('connect', (client) => {
    client.query('SET search_path TO zecurx_admin, public');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export async function query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
): Promise<QueryResult<T>> {
    const start = Date.now();
    const res = await pool.query<T>(text, params as any);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
        console.log('Executed query', { text: text.substring(0, 100), duration, rows: res.rowCount });
    }
    return res;
}

export async function getClient() {
    const client = await pool.connect();
    return client;
}

export { pool };

export const db = {
    query,
    pool,
    getClient,

    async select<T extends QueryResultRow>(table: string, where?: Record<string, unknown>, columns = '*'): Promise<T[]> {
        let sql = `SELECT ${columns} FROM ${table}`;
        const values: unknown[] = [];
        
        if (where && Object.keys(where).length > 0) {
            const conditions = Object.entries(where).map(([key, val], i) => {
                values.push(val);
                return `${key} = $${i + 1}`;
            });
            sql += ` WHERE ${conditions.join(' AND ')}`;
        }
        
        const result = await query<T>(sql, values as (string | number | boolean | null | undefined)[]);
        return result.rows;
    },

    async selectOne<T extends QueryResultRow>(table: string, where: Record<string, unknown>, columns = '*'): Promise<T | null> {
        const rows = await this.select<T>(table, where, columns);
        return rows[0] || null;
    },

    async insert<T extends QueryResultRow>(table: string, data: Record<string, unknown>): Promise<T | null> {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`);
        
        const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
        const result = await query<T>(sql, values as (string | number | boolean | null | undefined)[]);
        return result.rows[0] || null;
    },

    async update<T extends QueryResultRow>(table: string, data: Record<string, unknown>, where: Record<string, unknown>): Promise<T | null> {
        const dataKeys = Object.keys(data);
        const dataValues = Object.values(data);
        const whereKeys = Object.keys(where);
        const whereValues = Object.values(where);
        
        const setClause = dataKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
        const whereClause = whereKeys.map((key, i) => `${key} = $${dataKeys.length + i + 1}`).join(' AND ');
        
        const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
        const result = await query<T>(sql, [...dataValues, ...whereValues] as (string | number | boolean | null | undefined)[]);
        return result.rows[0] || null;
    },

    async delete(table: string, where: Record<string, unknown>): Promise<number> {
        const keys = Object.keys(where);
        const values = Object.values(where);
        const conditions = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
        
        const sql = `DELETE FROM ${table} WHERE ${conditions}`;
        const result = await query(sql, values as (string | number | boolean | null | undefined)[]);
        return result.rowCount || 0;
    },

    async upsert<T extends QueryResultRow>(
        table: string, 
        data: Record<string, unknown>, 
        conflictColumn: string
    ): Promise<T | null> {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`);
        const updateClause = keys
            .filter(k => k !== conflictColumn)
            .map(k => `${k} = EXCLUDED.${k}`)
            .join(', ');
        
        const sql = `
            INSERT INTO ${table} (${keys.join(', ')}) 
            VALUES (${placeholders.join(', ')}) 
            ON CONFLICT (${conflictColumn}) 
            DO UPDATE SET ${updateClause}
            RETURNING *
        `;
        const result = await query<T>(sql, values as (string | number | boolean | null | undefined)[]);
        return result.rows[0] || null;
    }
};

export default db;
