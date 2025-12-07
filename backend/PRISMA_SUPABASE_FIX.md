# Проблемы с отправкой схемы Prisma в Supabase

## Основные проблемы:

### 1. ❌ Ошибка аутентификации (P1000)
**Ошибка:** `Authentication failed against database server`

**Причины:**
- Отсутствует файл `.env` с переменными окружения
- Неправильные учетные данные в `DATABASE_URL`
- Использование pooler URL вместо direct connection

### 2. ⚠️ Конфигурация подключения

**Для Supabase нужно использовать:**
- **DIRECT_URL** (порт 5432) - для миграций и схемы
- **DATABASE_URL** (pooler, порт 6543) - для приложения (опционально)

### 3. 📝 Решение:

#### Шаг 1: Создайте файл `.env` в папке `backend/`

```env
# Direct connection для миграций (ОБЯЗАТЕЛЬНО для db push)
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"

# Pooler connection для приложения (опционально)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
```

**Где взять данные:**
1. Зайдите в Supabase Dashboard → ваш проект
2. Settings → Database
3. Скопируйте "Connection string" (используйте "Direct connection", не "Connection pooling")
4. Замените `[YOUR-PASSWORD]` на ваш пароль базы данных

#### Шаг 2: Используйте правильный URL для миграций

Для `prisma db push` и миграций **ОБЯЗАТЕЛЬНО** используйте **DIRECT_URL** (порт 5432), а не pooler (порт 6543).

Pooler не поддерживает некоторые операции миграций!

#### Шаг 3: Выполните команду

```bash
# Установите переменную окружения для миграций
$env:DATABASE_URL="postgresql://postgres:[PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"

# Или создайте .env файл и выполните:
npx prisma db push
```

### 4. 🔧 Альтернативное решение через prisma.config.ts

Если используете Prisma 7, создайте `prisma.config.ts`:

```typescript
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"), // Используйте DIRECT_URL для миграций
  },
});
```

И уберите `url` из `schema.prisma` (как уже сделано).

### 5. ✅ Проверка подключения

Проверьте подключение:
```bash
npx prisma db execute --stdin
```

Или через psql:
```bash
psql "postgresql://postgres:[PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

## Важно:

1. **Для миграций** всегда используйте **DIRECT_URL** (порт 5432)
2. **Для приложения** можно использовать pooler (порт 6543) для лучшей производительности
3. **Пароль** должен быть правильным - проверьте в Supabase Dashboard
4. **SSL mode** должен быть `require` для Supabase

