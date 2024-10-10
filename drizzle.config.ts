import type { Config } from 'drizzle-kit';

export default {
  // schema: './src/db/schemas/*',
  schema: './src/db/schemas/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;