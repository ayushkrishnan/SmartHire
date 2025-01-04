import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
    schema: './src/models/schema.ts',
    dbCredentials: {
        url: "postgresql://postgres.onirlstpkexxilhtmalp:6PY0xLTVl8j6Gc@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
    }
})
