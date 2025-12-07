// Загружаем переменные окружения ПЕРВЫМ
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

import { defineConfig } from '@prisma/config';

// Получаем DATABASE_URL из переменных окружения
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set in environment variables');
  console.error('💡 Make sure your .env file contains DATABASE_URL');
  throw new Error('DATABASE_URL environment variable is not set');
}

console.log('✅ DATABASE_URL loaded from .env');

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
});
