import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@host.docker.internal/smarthire`);

export default db;