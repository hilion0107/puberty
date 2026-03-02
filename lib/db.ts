import Database from "better-sqlite3";
import path from "path";
import bcryptjs from "bcryptjs";

const DB_PATH = path.join(process.cwd(), "data", "admin.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
    if (db) return db;

    // Ensure data directory exists
    const fs = require("fs");
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");

    // Create tables
    db.exec(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS notices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            title_html TEXT DEFAULT '',
            content TEXT NOT NULL,
            author TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS schedule (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            year INTEGER NOT NULL,
            month INTEGER NOT NULL,
            data_json TEXT NOT NULL,
            updated_at TEXT DEFAULT (datetime('now')),
            UNIQUE(year, month)
        );

        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            abbreviation TEXT NOT NULL,
            name TEXT NOT NULL,
            color TEXT NOT NULL DEFAULT '#3B82F6',
            sort_order INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS popup (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT DEFAULT '',
            image_path TEXT,
            size TEXT DEFAULT '1/2',
            position TEXT DEFAULT 'center',
            duration_days INTEGER DEFAULT 7,
            is_active INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS notice_settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
    `);

    // Safe migrations for existing databases
    const migrations = [
        "ALTER TABLE popup ADD COLUMN title TEXT DEFAULT ''",
        "ALTER TABLE notices ADD COLUMN image_path TEXT DEFAULT ''",
        "ALTER TABLE notices ADD COLUMN link_url TEXT DEFAULT ''",
        "ALTER TABLE notices ADD COLUMN is_pinned INTEGER DEFAULT 0",
        "ALTER TABLE notices ADD COLUMN sort_order INTEGER DEFAULT 0",
        "ALTER TABLE notices ADD COLUMN content_html TEXT DEFAULT ''",
        "ALTER TABLE notices ADD COLUMN title_html TEXT DEFAULT ''",
    ];
    for (const sql of migrations) {
        try { db.exec(sql); } catch { /* column already exists */ }
    }

    // Seed initial admin if none exists
    const adminCount = db.prepare("SELECT COUNT(*) as count FROM admins").get() as { count: number };
    if (adminCount.count === 0) {
        const hash = bcryptjs.hashSync("860524", 10);
        db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").run("jjim33", hash);
    }

    return db;
}
