import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle('postgresql://postgres.tvxaesoanpetoqbbsdoi:ayush@aws-0-ap-south-1.pooler.supabase.com:6543/postgres');

export default db;