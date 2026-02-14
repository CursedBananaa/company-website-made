import { exec } from 'child_process';
import fs from 'fs';

exec('npm run lint', (error, stdout, stderr) => {
  const output = (stdout || '') + '\n' + (stderr || '');
  fs.writeFileSync('lint_results.txt', output);
  console.log('Lint finished. Output saved to lint_results.txt');
});
