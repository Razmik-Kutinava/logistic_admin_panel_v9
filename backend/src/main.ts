// Загружаем переменные окружения из .env файла ПЕРВЫМ
// Пробуем загрузить из разных мест
const path = require('path');
const fs = require('fs');

// Пробуем найти .env файл
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`✅ Loaded .env from: ${envPath}`);
    break;
  }
}

// Если не нашли, пробуем загрузить из текущей директории
if (!process.env.DATABASE_URL) {
  require('dotenv').config();
}

// Устанавливаем переменные окружения ДО импорта Prisma для Windows ARM64
if (process.platform === 'win32' && process.arch === 'arm64') {
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = '';
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'wasm';
  process.env.PRISMA_CLI_QUERY_ENGINE_TYPE = 'wasm';
  process.env.PRISMA_ENGINES_MIRROR = '';
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Включаем CORS для фронтенда
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'], // Vite и другие порты
    credentials: true,
  });
  
  const defaultPort = parseInt(process.env.PORT || '3000', 10);
  
  // Пробуем запустить на указанном порту
  let port = defaultPort;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    try {
      await app.listen(port);
      console.log(`🚀 Application is running on: http://localhost:${port}`);
      if (port !== defaultPort) {
        console.log(`💡 Port ${defaultPort} was busy, using port ${port} instead`);
      }
      break;
    } catch (error: any) {
      if (error.code === 'EADDRINUSE') {
        attempts++;
        if (attempts >= maxAttempts) {
          console.error(`❌ Could not find an available port after ${maxAttempts} attempts`);
          console.error(`💡 Tried ports ${defaultPort}-${port}`);
          console.error(`💡 Try killing processes using these ports or set PORT environment variable`);
          process.exit(1);
        }
        port++;
        console.warn(`⚠️  Port ${port - 1} is already in use, trying port ${port}...`);
      } else {
        throw error;
      }
    }
  }
}
bootstrap();
