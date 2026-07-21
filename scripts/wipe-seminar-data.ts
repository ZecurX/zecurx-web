import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const CONFIRMATION_PHRASE = 'WIPE SEMINAR DATA';
const TABLES_TO_WIPE = [
    'seminar.otp_verifications',
    'seminar.certificates',
    'seminar.feedback',
    'seminar.registrations',
    'seminar.seminars',
] as const;

function hasFlag(flag: string): boolean {
    return process.argv.includes(flag);
}

function parseDatabaseTarget(connectionString: string) {
    try {
        const url = new URL(connectionString);
        return {
            host: url.hostname || 'unknown-host',
            port: url.port || 'default',
            database: url.pathname.replace(/^\//, '') || 'unknown-database',
            user: decodeURIComponent(url.username || 'unknown-user'),
        };
    } catch {
        return {
            host: 'unparseable',
            port: 'unparseable',
            database: 'unparseable',
            user: 'unparseable',
        };
    }
}

function looksLikeProduction(connectionString: string): boolean {
    const target = parseDatabaseTarget(connectionString);
    const combined = [
        process.env.NODE_ENV,
        process.env.VERCEL_ENV,
        target.host,
        target.database,
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    return /\b(prod|production)\b/.test(combined);
}

async function confirmWipe(connectionString: string): Promise<boolean> {
    if (hasFlag('--yes')) {
        return true;
    }

    const target = parseDatabaseTarget(connectionString);
    console.log('\nDANGER: This script permanently deletes seminar data.');
    console.log(`Target host: ${target.host}`);
    console.log(`Target port: ${target.port}`);
    console.log(`Target database: ${target.database}`);
    console.log(`Target user: ${target.user}`);
    console.log('Tables:');
    for (const table of TABLES_TO_WIPE) {
        console.log(`   - ${table}`);
    }

    const readline = createInterface({ input, output });
    try {
        const answer = await readline.question(`\nType "${CONFIRMATION_PHRASE}" to continue: `);
        return answer === CONFIRMATION_PHRASE;
    } finally {
        readline.close();
    }
}

async function wipeData() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL not found');
        process.exit(1);
    }

    const isDryRun = hasFlag('--dry-run');
    const allowProductionWipe = process.env.ALLOW_DATABASE_WIPE === 'true';

    if (looksLikeProduction(connectionString) && !allowProductionWipe) {
        console.error('Refusing to wipe a production-looking database.');
        console.error('Set ALLOW_DATABASE_WIPE=true only if you are certain this is intentional.');
        process.exit(1);
    }

    const confirmed = isDryRun || await confirmWipe(connectionString);
    if (!confirmed) {
        console.log('Confirmation did not match. No data was deleted.');
        process.exit(0);
    }

    const pool = new Pool({
        connectionString,
        ssl: false,
    });

    try {
        if (isDryRun) {
            console.log('Dry run only. No data will be deleted.');
            for (const table of TABLES_TO_WIPE) {
                const result = await pool.query(`SELECT COUNT(*)::int AS count FROM ${table}`);
                console.log(`   - ${table}: ${result.rows[0].count} rows would be deleted`);
            }
            return;
        }

        console.log('Wiping all seminar data...');
        await pool.query('BEGIN');

        // Delete in order of dependencies (though CASCADE should handle it, explicit is safer)
        for (const table of TABLES_TO_WIPE) {
            const result = await pool.query(`DELETE FROM ${table}`);
            console.log(`   - Cleared ${table} (${result.rowCount ?? 0} rows)`);
        }

        await pool.query('COMMIT');
        console.log('\nDatabase is now clean.');

    } catch (error) {
        try {
            await pool.query('ROLLBACK');
        } catch {
            // Ignore rollback errors; report the original failure below.
        }
        console.error('Error wiping data:', error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

wipeData();
