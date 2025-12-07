# Настройка .env файла для Supabase

## Быстрое решение:

### 1. Откройте Supabase Dashboard:
https://supabase.com/dashboard/project/bebwdgocsfydqqtrcwvp/settings/database

### 2. Найдите "Connection string" → выберите "Direct connection"

### 3. Скопируйте строку подключения

### 4. Создайте/обновите файл `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:[ВАШ_ПАРОЛЬ]@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

### 5. Важно - если пароль содержит специальные символы:

**Закодируйте их в URL-формат:**

Примеры:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `/` → `%2F`
- `?` → `%3F`
- `:` → `%3A`
- `;` → `%3B`
- пробел → `%20`

**Пример:**
- Пароль: `MyP@ss#123`
- В URL: `MyP%40ss%23123`
- Полный URL: `postgresql://postgres:MyP%40ss%23123@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require`

### 6. Проверьте подключение:

```bash
cd backend
npx prisma db push
```

## Автоматическая проверка:

Запустите скрипт проверки:
```powershell
cd backend
.\check-connection.ps1
```

## Если проблема сохраняется:

1. **Проверьте пароль** в Supabase Dashboard → Settings → Database → Reset database password
2. **Используйте прямой connection string** из Supabase (не pooler)
3. **Убедитесь, что используете порт 5432**, не 6543
4. **Проверьте, что sslmode=require** присутствует в URL

