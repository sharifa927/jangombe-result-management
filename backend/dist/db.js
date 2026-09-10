import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;
const pgUser = process.env.PGUSER;
const pgPassword = process.env.PGPASSWORD;
const pgDatabase = process.env.PGDATABASE;
const pgHost = process.env.PGHOST ?? 'localhost';
const pgPort = Number(process.env.PGPORT ?? 5432);
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl && (!pgUser || !pgPassword || !pgDatabase)) {
    throw new Error('PostgreSQL configuration is missing. Set PGUSER, PGPASSWORD, PGDATABASE (and optional PGHOST/PGPORT) or DATABASE_URL in the environment.');
}
export const pool = new Pool(databaseUrl
    ? { connectionString: databaseUrl, max: 10 }
    : {
        host: pgHost,
        port: pgPort,
        user: pgUser,
        password: pgPassword,
        database: pgDatabase,
        max: 10,
    });
const schema = `
  CREATE TABLE IF NOT EXISTS teachers (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'TEACHER',
    assigned_classes TEXT[] DEFAULT '{}',
    assigned_subjects TEXT[] DEFAULT '{}'
  );

  CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    teacher_id TEXT,
    number_of_students INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Active'
  );

  CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    number_of_teachers INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Active'
  );

  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    admission_number TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    name TEXT NOT NULL,
    class_id TEXT,
    class_name TEXT,
    date_of_birth TEXT,
    gender TEXT,
    status TEXT DEFAULT 'Active'
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL,
    class_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    students INTEGER DEFAULT 0,
    submitted_date TEXT NOT NULL,
    rejection_reason TEXT
  );

  CREATE TABLE IF NOT EXISTS results (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    term TEXT NOT NULL,
    subject_results JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_marks INTEGER DEFAULT 0,
    average NUMERIC(5,2) DEFAULT 0,
    overall_grade TEXT,
    position INTEGER DEFAULT 0
  );
`;
export async function initializeDatabase() {
    try {
        const client = await pool.connect();
        try {
            await client.query(schema);
            return {
                connected: true,
                mode: 'postgres',
                message: 'Connected to PostgreSQL and initialized schema.',
            };
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error('PostgreSQL initialization failed:', error);
        throw new Error('Unable to connect to PostgreSQL. Ensure PGUSER, PGPASSWORD, PGDATABASE, and PGHOST/PGPORT are configured correctly.');
    }
}
