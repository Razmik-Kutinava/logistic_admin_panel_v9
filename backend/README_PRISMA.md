# Как отправить схему Prisma в Supabase

## Проблема:
Команда `npx prisma db push` запускается из неправильной директории.

## Решение:

### Вариант 1: Перейти в папку backend (РЕКОМЕНДУЕТСЯ)
```bash
cd backend
npx prisma db push
```

### Вариант 2: Указать путь к схеме из корня
```bash
npx prisma db push --schema=backend/prisma/schema.prisma
```

## Настройка .env файла

Создайте файл `backend/.env` с правильными данными подключения:

```env
# Direct connection для миграций (ОБЯЗАТЕЛЬНО!)
# Используйте порт 5432, не 6543!
DATABASE_URL="postgresql://postgres:[ВАШ_ПАРОЛЬ]@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

**Где взять данные:**
1. Supabase Dashboard → ваш проект
2. Settings → Database  
3. Скопируйте "Connection string" → выберите "Direct connection" (НЕ "Connection pooling")
4. Замените `[ВАШ_ПАРОЛЬ]` на ваш пароль базы данных

## Важно:
- ✅ Используйте порт **5432** (direct connection) для миграций
- ❌ НЕ используйте порт 6543 (pooler) для `db push` - он не поддерживает все операции

## После настройки .env:

```bash
cd backend
npx prisma db push
```

