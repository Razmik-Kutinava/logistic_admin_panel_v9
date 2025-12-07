const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../generated/prisma');
const targetDir = path.join(__dirname, '../dist/generated/prisma');

if (fs.existsSync(sourceDir)) {
  // Создаем целевую директорию если её нет
  if (!fs.existsSync(path.join(__dirname, '../dist/generated'))) {
    fs.mkdirSync(path.join(__dirname, '../dist/generated'), { recursive: true });
  }

  // Копируем всю папку generated/prisma
  function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      fs.readdirSync(src).forEach(childItemName => {
        copyRecursiveSync(
          path.join(src, childItemName),
          path.join(dest, childItemName)
        );
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  copyRecursiveSync(sourceDir, targetDir);
  console.log('✅ Copied generated/prisma to dist/generated/prisma');
} else {
  console.warn('⚠️  generated/prisma not found, skipping copy');
}

