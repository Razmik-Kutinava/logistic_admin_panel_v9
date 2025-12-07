# Решение проблемы Prisma на Windows ARM64

## Проблема:
```
PrismaClientInitializationError: Unable to require(`query_engine-windows.dll.node`).
Details: ... is not a valid Win32 application.
```

## Причина:
Prisma 5.22.0 не имеет нативного бинарника для Windows ARM64. Бинарник `query_engine-windows.dll.node` сгенерирован для x64, а не для ARM64.

## Решение:

### Вариант 1: Удалить несовместимый бинарник (РЕКОМЕНДУЕТСЯ)

Prisma автоматически переключится на WASM engine, если native бинарник недоступен:

```powershell
# Удалить несовместимый бинарник
Remove-Item generated/prisma/query_engine-windows.dll.node -Force

# Перезапустить сервер
npm run start:dev
```

### Вариант 2: Использовать переменную окружения

```powershell
# Установить переменную для использования WASM
$env:PRISMA_CLI_QUERY_ENGINE_TYPE="wasm"
npx prisma generate
```

### Вариант 3: Полная переустановка

```powershell
# 1. Удалить все сгенерированные файлы
Remove-Item -Recurse -Force generated/prisma
Remove-Item -Recurse -Force node_modules/.prisma

# 2. Переустановить зависимости
npm install

# 3. Перегенерировать (без бинарника)
npx prisma generate

# 4. Убедиться, что бинарник удален
Remove-Item generated/prisma/query_engine-windows.dll.node -ErrorAction SilentlyContinue
```

## Важно:

- **WASM engine** работает медленнее, чем native, но совместим с ARM64
- Prisma автоматически выберет WASM, если native бинарник недоступен
- Это временное решение до тех пор, пока Prisma не добавит нативную поддержку Windows ARM64

## После исправления:

1. Перезапустите сервер разработки
2. Prisma должен работать через WASM engine
3. Производительность может быть немного ниже, но функциональность будет полной

