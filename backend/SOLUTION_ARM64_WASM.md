# Решение проблемы Prisma на Windows ARM64 через WASM

## Проблема:
```
PrismaClientInitializationError: Unable to require(``).
The Prisma engines do not seem to be compatible with your system.
Details: The parameter is incorrect.
```

## Причина:
Prisma 5.22.0 не имеет нативного бинарника для Windows ARM64. Бинарник `query_engine-windows.dll.node` сгенерирован для x64, а не для ARM64.

## Решение: Использование Driver Adapter с WASM Engine

### Шаг 1: Включить preview feature в schema.prisma

```prisma
generator client {
  provider        = "prisma-client-js"
  output          = "../generated/prisma"
  previewFeatures = ["driverAdapters"]
}
```

### Шаг 2: Установить зависимости

```bash
npm install @prisma/adapter-pg pg --save
```

### Шаг 3: Обновить PrismaService

Использовать `PrismaPg` адаптер с `pg.Pool` для принудительного использования WASM engine:

```typescript
import { PrismaClient } from '../../generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
```

### Шаг 4: Перегенерировать Prisma Client

```bash
npx prisma generate
```

### Шаг 5: Удалить несовместимый бинарник

```bash
node scripts/fix-prisma-binary.js
```

## Преимущества этого решения:

1. ✅ **Принудительное использование WASM** - драйвер-адаптер гарантирует использование WASM engine
2. ✅ **Совместимость с ARM64** - WASM работает на любой архитектуре
3. ✅ **Автоматическая очистка** - скрипт `fix-prisma-binary.js` удаляет несовместимые бинарники
4. ✅ **Полная функциональность** - все возможности Prisma доступны через WASM

## Важно:

- **WASM engine** работает медленнее, чем native, но полностью совместим с ARM64
- Драйвер-адаптер автоматически использует WASM, даже если native бинарник присутствует
- Это решение работает на всех платформах, включая Windows ARM64

## После исправления:

1. Перезапустите сервер разработки
2. Prisma должен работать через WASM engine с драйвер-адаптером
3. Производительность может быть немного ниже, но функциональность будет полной

