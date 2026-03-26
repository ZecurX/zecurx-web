import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Development: accept self-signed certs
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

pool.on('connect', (client) => {
    client.query('SET search_path TO zecurx_admin, seminar, public');
    client.query('SET statement_timeout = 10000');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export async function query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
): Promise<QueryResult<T>> {
    // Query logging removed - sensitive data should not be logged
    // Use structured logging with proper PII redaction if query monitoring needed
    return pool.query<T>(text, params as (string | number | boolean | null | undefined)[]);
}

export async function getClient() {
    const client = await pool.connect();
    return client;
}

export { pool };

// Allowlist of valid table names (add new tables here as they're created)
const VALID_TABLES = new Set([
    // Core admin tables
    'admins', 'admin_sessions', 'admin_invitations',
    // Lead management
    'student_leads', 'student_lead_activities', 'student_lead_emails', 'student_lead_notes',
    'enterprise_leads', 'enterprise_lead_activities', 'enterprise_lead_emails', 'enterprise_lead_notes',
    // Blog
    'blog_posts', 'blog_labels', 'blog_post_labels',
    // Resources
    'certificates', 'whitepapers', 'case_studies',
    // Commerce
    'customers', 'plans', 'products', 'orders', 'order_items', 'transactions',
    'shop_orders', 'shop_order_items', 'shop_inventory',
    // Referrals and partners
    'referral_codes', 'referral_code_usages', 'partner_referrals', 'partner_referral_usages', 'partner_payouts',
    // Media
    'media', 'media_tags',
    // Audit
    'audit_log', 'audit_logs',
    // Public schema qualified tables
    'public.users', 'public.enrollments', 'public.internships',
    'public.referral_codes', 'public.partner_referrals', 'public.partner_referral_usages',
    'public.password_reset_tokens',
    // Seminar schema qualified tables
    'seminar.seminars', 'seminar.registrations', 'seminar.attendance',
    'seminar.certificates', 'seminar.certificate_name_requests', 'seminar.otp_verifications', 'seminar.feedback',
    // zecurx_admin schema qualified tables
    'zecurx_admin.plans', 'zecurx_admin.promo_prices', 'zecurx_admin.settings', 'zecurx_admin.course_mapping',
]);

// Validate identifiers (table names, column names) to prevent SQL injection
const VALID_IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_.]*$/;

function validateIdentifier(value: string, type: 'table' | 'column'): string {
    if (!VALID_IDENTIFIER.test(value)) {
        throw new Error(`Invalid ${type} name: ${value}`);
    }
    if (type === 'table' && !VALID_TABLES.has(value)) {
        throw new Error(`Table not in allowlist: ${value}`);
    }
    return value;
}

export const db = {
    query,
    pool,
    getClient,

    async select<T extends QueryResultRow>(table: string, where?: Record<string, unknown>, columns = '*'): Promise<T[]> {
        validateIdentifier(table, 'table');
        const safeColumns = columns === '*' ? '*' : columns.split(',').map(c => validateIdentifier(c.trim(), 'column')).join(', ');
        let sql = `SELECT ${safeColumns} FROM ${table}`;
        const values: unknown[] = [];

        if (where && Object.keys(where).length > 0) {
            const conditions = Object.entries(where).map(([key, val], i) => {
                validateIdentifier(key, 'column');
                values.push(val);
                return `${key} = $${i + 1}`;
            });
            sql += ` WHERE ${conditions.join(' AND ')}`;
        }

        const result = await query<T>(sql, values as (string | number | boolean | null | undefined)[]);
        return result.rows;
    },

    async selectOne<T extends QueryResultRow>(table: string, where: Record<string, unknown>, columns = '*'): Promise<T | null> {
        validateIdentifier(table, 'table');
        const rows = await this.select<T>(table, where, columns);
        return rows[0] || null;
    },

    async insert<T extends QueryResultRow>(table: string, data: Record<string, unknown>): Promise<T | null> {
        validateIdentifier(table, 'table');
        const keys = Object.keys(data);
        keys.forEach(key => validateIdentifier(key, 'column'));
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`);

        const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
        const result = await query<T>(sql, values as (string | number | boolean | null | undefined)[]);
        return result.rows[0] || null;
    },

    async update<T extends QueryResultRow>(table: string, data: Record<string, unknown>, where: Record<string, unknown>): Promise<T | null> {
        validateIdentifier(table, 'table');
        const dataKeys = Object.keys(data);
        dataKeys.forEach(key => validateIdentifier(key, 'column'));
        const dataValues = Object.values(data);
        const whereKeys = Object.keys(where);
        whereKeys.forEach(key => validateIdentifier(key, 'column'));
        const whereValues = Object.values(where);

        const setClause = dataKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
        const whereClause = whereKeys.map((key, i) => `${key} = $${dataKeys.length + i + 1}`).join(' AND ');

        const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
        const result = await query<T>(sql, [...dataValues, ...whereValues] as (string | number | boolean | null | undefined)[]);
        return result.rows[0] || null;
    },

    async delete(table: string, where: Record<string, unknown>): Promise<number> {
        validateIdentifier(table, 'table');
        const keys = Object.keys(where);
        keys.forEach(key => validateIdentifier(key, 'column'));
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
        validateIdentifier(table, 'table');
        validateIdentifier(conflictColumn, 'column');
        const keys = Object.keys(data);
        keys.forEach(key => validateIdentifier(key, 'column'));
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
