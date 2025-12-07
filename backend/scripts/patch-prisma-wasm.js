const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../generated/prisma/index.js');

if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Проверяем, не патчен ли уже файл
  if (content.includes('getQueryEngineWasmModule')) {
    console.log('ℹ️  Prisma index.js already patched for WASM');
    return;
  }
  
  // Заменяем engineWasm = undefined на правильную конфигурацию WASM
  const wasmConfig = `config.engineWasm = {
  getRuntime: () => require('./query_engine_bg.js'),
  getQueryEngineWasmModule: async () => {
    const loader = (await import('#wasm-engine-loader')).default;
    const engine = (await loader).default;
    return engine;
  }
}`;
  
  content = content.replace(
    /config\.engineWasm = undefined/g,
    wasmConfig
  );
  
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('✅ Patched Prisma index.js to use WASM engine');
} else {
  console.warn('⚠️  Prisma index.js not found, skipping patch');
}

