import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: './src/models/schema.ts',
  dbCredentials: {
    host: "db",
    database: "smarthire",
    user: "postgres",
    password: "password",
    ssl: false
  }
})
