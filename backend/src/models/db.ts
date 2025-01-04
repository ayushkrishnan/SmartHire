import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle('postgresql://postgres.onirlstpkexxilhtmalp:6PY0xLTVl8j6Gc@aws-0-us-west-1.pooler.supabase.com:6543/postgres');

export default db;