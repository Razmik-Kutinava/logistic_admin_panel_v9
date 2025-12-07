import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';

// Динамический импорт PrismaClient - работает и в dev, и в production
// Используем require для динамической загрузки с правильным путем
type PrismaClientType = typeof import('../../generated/prisma').PrismaClient;

const possiblePaths = [
  path.resolve(process.cwd(), 'generated/prisma'),
  path.resolve(process.cwd(), 'dist/generated/prisma'),
  path.join(__dirname, '../../generated/prisma'),
  path.join(__dirname, '../../../generated/prisma'),
];

let PrismaClientModule: { PrismaClient: new (...args: any[]) => any } | null = null;
for (const prismaPath of possiblePaths) {
  const indexPath = path.join(prismaPath, 'index.js');
  if (fs.existsSync(indexPath)) {
    try {
      PrismaClientModule = require(prismaPath);
      break;
    } catch (error) {
      // Пробуем следующий путь
      continue;
    }
  }
}

if (!PrismaClientModule || !PrismaClientModule.PrismaClient) {
  throw new Error('PrismaClient not found. Please run: npm run prisma:generate');
}

const PrismaClient = PrismaClientModule.PrismaClient as typeof import('../../generated/prisma').PrismaClient;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  private adapter: PrismaPg;

  constructor() {
    // Удаляем несовместимый бинарник для Windows ARM64 при инициализации
    if (process.platform === 'win32' && process.arch === 'arm64') {
      // Используем путь относительно корня проекта
      const binaryPath = path.resolve(process.cwd(), 'generated/prisma/query_engine-windows.dll.node');
      if (fs.existsSync(binaryPath)) {
        try {
          fs.unlinkSync(binaryPath);
          console.log('✅ Removed incompatible Prisma binary for ARM64 compatibility');
        } catch (error) {
          // Игнорируем ошибки удаления
        }
      }
      
      // Принудительно устанавливаем переменные окружения для WASM
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = '';
      process.env.PRISMA_CLIENT_ENGINE_TYPE = 'wasm';
      process.env.PRISMA_CLI_QUERY_ENGINE_TYPE = 'wasm';
      
      // Проверяем и патчим index.js если нужно
      // Используем путь относительно корня проекта (работает и в src, и в dist)
      const indexPath = path.resolve(process.cwd(), 'generated/prisma/index.js');
      if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf8');
        if (content.includes('config.engineWasm = undefined')) {
          const wasmConfig = `config.engineWasm = {
  getRuntime: () => require('./query_engine_bg.js'),
  getQueryEngineWasmModule: async () => {
    const loader = (await import('#wasm-engine-loader')).default;
    const engine = (await loader).default;
    return engine;
  }
}`;
          content = content.replace(/config\.engineWasm = undefined/g, wasmConfig);
          fs.writeFileSync(indexPath, content, 'utf8');
          console.log('✅ Patched Prisma to use WASM engine at runtime');
        }
      }
    }

    // Для Prisma 7 используем адаптер для WASM
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('❌ DATABASE_URL environment variable is not set');
      console.error('💡 Make sure you have a .env file in the backend directory with DATABASE_URL');
      throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({
      adapter: adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

    this.pool = pool;
    this.adapter = adapter;
  }

  async onModuleInit() {
    // Адаптер уже подключен через конструктор PrismaClient
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    // Закрываем pool после отключения
    if (this.pool) {
      await this.pool.end();
    }
  }
}
