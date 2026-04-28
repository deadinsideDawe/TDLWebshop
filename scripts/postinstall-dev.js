const { spawnSync } = require('node:child_process');
const path = require('node:path');

if (process.platform !== 'win32') {
  console.log('Skipping Windows-only postinstall helper on this platform.');
  process.exit(0);
}

const scriptPath = path.join(__dirname, 'postinstall-dev.ps1');
const result = spawnSync(
  'powershell.exe',
  ['-ExecutionPolicy', 'Bypass', '-File', scriptPath],
  { stdio: 'inherit' }
);

if (result.error) {
  console.error('Failed to run Windows postinstall helper:', result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
