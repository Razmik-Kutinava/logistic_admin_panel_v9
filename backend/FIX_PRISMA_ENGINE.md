# Решение проблемы с Prisma Engine

## Проблема:
```
PrismaClientInitializationError: Unable to require(`query_engine-windows.dll.node`).
The Prisma engines do not seem to be compatible with your system.
Details: ... is not a valid Win32 application.
```

## Причина:
- Несовместимость бинарного файла Prisma Engine с архитектурой системы
- Система: ARM64, а бинарник для x64
- Поврежденный или устаревший бинарный файл

## Решение:

### Вариант 1: Перегенерировать Prisma Client (РЕКОМЕНДУЕТСЯ)

```bash
# 1. Удалить старую папку generated/prisma
Remove-Item -Recurse -Force generated/prisma

# 2. Установить правильные engines
npm install @prisma/engines --save-dev

# 3. Перегенерировать Prisma Client
npx prisma generate
```

### Вариант 2: Полная переустановка

```bash
# 1. Удалить node_modules и package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# 2. Удалить generated/prisma
Remove-Item -Recurse -Force generated/prisma

# 3. Переустановить зависимости
npm install

# 4. Перегенерировать Prisma Client
npx prisma generate
```

### Вариант 3: Указать правильную архитектуру в schema.prisma

Если проблема сохраняется, можно явно указать binaryTargets:

```prisma
generator client {
  provider      = "prisma-client-js"
  output        = "../generated/prisma"
  binaryTargets = ["native"] // автоматически определит правильную архитектуру
}
```

Затем:
```bash
# Удалить старый бинарник
Remove-Item -Recurse -Force generated/prisma/query_engine-windows.dll.node

# Перегенерировать
npx prisma generate
```

**Важно:** Используйте `"native"` вместо конкретной архитектуры - Prisma автоматически определит правильный бинарник.

## Проверка архитектуры:

```bash
# Проверить архитектуру Node.js
node -p "process.arch"

# Результат:
# - arm64 - для ARM64 систем
# - x64 - для x64 систем
# - ia32 - для 32-bit систем
```

## После исправления:

1. Перезапустите сервер разработки
2. Prisma должен подключиться к базе данных без ошибок

## Если проблема сохраняется:

1. Проверьте версию Node.js: `node --version`
2. Убедитесь, что используете совместимую версию Prisma
3. Попробуйте обновить Prisma: `npm install prisma@latest @prisma/client@latest`
4. Проверьте документацию: https://pris.ly/d/system-requirements

