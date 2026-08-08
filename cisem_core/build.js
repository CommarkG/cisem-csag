const { execSync } = require('child_process');

if (!process.env.VERCEL && !process.env.CI) {
  try {
    execSync('python cisem_core/cisem_gate.py', { stdio: 'inherit' });
  } catch (err) {
    process.exit(1);
  }
} else {
  console.log("VERCEL/CI BUILD DETECTED: Bypassing local compilation gates.");
}
process.exit(0);
