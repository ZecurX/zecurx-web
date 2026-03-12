import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    allowExitOnIdle: true,
});

pool.on('connect', (client) => {
    client.query('SET search_path TO zecurx_admin, seminar, public');
    client.query('SET statement_timeout = 10000');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

function isConnectionError(err: any): boolean {
    const code = err?.code || '';
    const message = err?.message || '';
    return code === 'ECONNRESET' || code === 'ETIMEDOUT' || code === 'EPIPE' ||
           code === 'ECONNREFUSED' || code === '57P01' ||
           message.includes('terminated') || message.includes('Connection terminated') ||
           message.includes('ECONNRESET');
}

async function queryWithRetry<T extends QueryResultRow>(
    text: string,
    params?: (string | number | boolean | null | undefined)[],
    retries = 2
): Promise<QueryResult<T>> {
    try {
        return await pool.query<T>(text, params);
    } catch (err: any) {
        if (retries > 0 && isConnectionError(err)) {
            console.warn(`DB connection error, retrying (${retries} left):`, err.message || err.code);
            await new Promise(r => setTimeout(r, 200));
            return queryWithRetry<T>(text, params, retries - 1);
        }
        throw err;
    }
}

export async function query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
): Promise<QueryResult<T>> {
    const castParams = params as (string | number | boolean | null | undefined)[];
    if (process.env.NODE_ENV === 'development') {
        const start = Date.now();
        const res = await queryWithRetry<T>(text, castParams);
        const duration = Date.now() - start;
        console.log('Executed query', { text: text.substring(0, 100), duration, rows: res.rowCount });
        return res;
    }
    return queryWithRetry<T>(text, castParams);
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
