import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: './src/models/schema.ts',
  dbCredentials: {
   url:"postgresql://postgres.tvxaesoanpetoqbbsdoi:ayush@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
  }
})
