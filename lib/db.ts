import { Pool } from 'pg';
import bcryptjs from 'bcryptjs';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

let isInitialized = false;
let initPromise: Promise<void> | null = null;

export async function getDb(): Promise<Pool> {
    if (!isInitialized) {
        if (!initPromise) {
            initPromise = initializeDb()
                .then(() => { isInitialized = true; })
                .catch((error) => {
                    console.error("Database initialization failed:", error);
                    initPromise = null; // 재시도할 수 있도록 초기화
                });
        }
        await initPromise;
    }
    return pool;
}

async function initializeDb() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                admin_type VARCHAR(50) DEFAULT '대표',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Add admin_type column to existing admins table if missing
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name='admins' AND column_name='admin_type'
                ) THEN
                    ALTER TABLE admins ADD COLUMN admin_type VARCHAR(50) DEFAULT '대표';
                END IF;
            END
            $$;

            CREATE TABLE IF NOT EXISTS notices (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                title_html TEXT DEFAULT '',
                content TEXT NOT NULL,
                content_html TEXT DEFAULT '',
                author VARCHAR(255) NOT NULL,
                image_path TEXT DEFAULT '',
                link_url TEXT DEFAULT '',
                is_pinned INTEGER DEFAULT 0,
                sort_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS schedule (
                id SERIAL PRIMARY KEY,
                year INTEGER NOT NULL,
                month INTEGER NOT NULL,
                data_json TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(year, month)
            );

            CREATE TABLE IF NOT EXISTS doctors (
                id SERIAL PRIMARY KEY,
                abbreviation VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                color VARCHAR(50) NOT NULL DEFAULT '#3B82F6',
                sort_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS popup (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) DEFAULT '',
                image_path TEXT,
                size VARCHAR(50) DEFAULT '1/2',
                position VARCHAR(50) DEFAULT 'center',
                duration_days INTEGER DEFAULT 7,
                is_active INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS notice_settings (
                key VARCHAR(255) PRIMARY KEY,
                value TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS questionnaires (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                gender VARCHAR(10) NOT NULL,
                birth_date VARCHAR(20) NOT NULL,
                privacy_consent BOOLEAN DEFAULT false,
                category VARCHAR(50) NOT NULL,
                responses JSONB NOT NULL DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Seed initial admin if none exists
        const res = await client.query("SELECT COUNT(*) FROM admins");
        if (parseInt(res.rows[0].count, 10) === 0) {
            const hash = bcryptjs.hashSync("860524", 10);
            await client.query(
                "INSERT INTO admins (username, password_hash) VALUES ($1, $2)",
                ["jjim33", hash]
            );
        }
    } finally {
        client.release();
    }
}
