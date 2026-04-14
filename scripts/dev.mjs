/**
 * dev.mjs — Next.js dev server with Turbopack + webpack fallback
 *
 * Starts with Turbopack. If Turbopack panics more than PANIC_THRESHOLD
 * times (the "Next.js package not found" HMR bug on Windows paths with
 * spaces), it kills the Turbopack process and re-starts using webpack.
 */

import { spawn } from 'node:child_process';

const PANIC_SENTINEL  = 'FATAL: An unexpected Turbopack error';
const PANIC_THRESHOLD = 2;

/** Run `next dev [extraArgs]` and pipe all output through.
 *  Returns true if we should fall back to webpack. */
function runNext(extraArgs, label) {
  return new Promise((resolve) => {
    process.stdout.write(`\n▲ Next.js dev (${label})\n\n`);

    const env   = { ...process.env, FORCE_COLOR: '1' };
    const child = spawn('next', ['dev', ...extraArgs], {
      env,
      shell: true,   // needed on Windows for .cmd shims in node_modules/.bin
      stdio: 'pipe',
    });

    let panics = 0;

    const forward = (dest, data) => {
      dest.write(data);
      if (data.toString().includes(PANIC_SENTINEL) && ++panics >= PANIC_THRESHOLD) {
        process.stderr.write(
          `\n[dev] Turbopack panicked ${PANIC_THRESHOLD}× — switching to webpack...\n\n`
        );
        child.kill();
      }
    };

    child.stdout.on('data', (d) => forward(process.stdout, d));
    child.stderr.on('data', (d) => forward(process.stderr, d));

    // Fall back only when Turbopack panicked (not on clean exit or Ctrl-C).
    child.on('close', () => resolve(panics >= PANIC_THRESHOLD));
  });
}

const shouldFallback = await runNext([], 'Turbopack');

if (shouldFallback) {
  // Webpack fallback: inherit stdio directly — no need to monitor.
  process.stdout.write('\n▲ Next.js dev (webpack fallback)\n\n');
  spawn('next', ['dev', '--no-turbopack'], {
    env:   { ...process.env, FORCE_COLOR: '1' },
    shell: true,
    stdio: 'inherit',
  });
}
