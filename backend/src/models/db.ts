import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost/smarthire`);

export default db;