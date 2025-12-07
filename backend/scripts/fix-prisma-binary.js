const fs = require('fs');
const path = require('path');

const binaryPath = path.join(__dirname, '../generated/prisma/query_engine-windows.dll.node');

if (fs.existsSync(binaryPath)) {
  try {
    fs.unlinkSync(binaryPath);
    console.log('✅ Removed incompatible Prisma binary for ARM64 compatibility');
  } catch (error) {
    console.warn('⚠️  Could not remove binary:', error.message);
  }
} else {
  console.log('ℹ️  No incompatible binary found (already removed or using WASM)');
}

