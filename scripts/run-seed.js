const { execSync } = require('child_process');
const path = require('path');

console.log('🌱 Ejecutando script de siembra de datos...');
console.log('📁 Directorio actual:', process.cwd());

try {
  // Compilar y ejecutar el script TypeScript
  const scriptPath = path.join(__dirname, 'seed-data.ts');
  console.log('🔧 Compilando y ejecutando:', scriptPath);
  
  execSync(`npx tsx ${scriptPath}`, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('✅ Script ejecutado exitosamente!');
} catch (error) {
  console.error('❌ Error al ejecutar el script:', error.message);
  process.exit(1);
}