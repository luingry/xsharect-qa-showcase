import { spawnSync } from 'node:child_process';

const probes = [
  ['accept_invalid_auth', 'tests/auth-api.spec.mjs', 'rejects an invalid access code'],
  ['drop_notes_broadcast', 'tests/notes-ui.spec.mjs', 'autosaves UTF-8 notes'],
  ['ignore_disconnect', 'tests/reconnect-responsive.spec.mjs', 'shows reconnect feedback'],
];

function runProbe({ file, port, fault }) {
  const result = spawnSync(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', file, '--project=chromium'], {
    shell: false,
    encoding: 'utf8',
    env: { ...process.env, PORT: String(port), PW_RETRIES: '0', PW_EXPECT_TIMEOUT: '1000', ...(fault ? { QA_FAULT_MODE: fault } : {}) },
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  process.stdout.write(output);
  return { status: result.status, output };
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

for (const [index, [fault, file, title]] of probes.entries()) {
  const port = 4400 + index;
  const baseline = runProbe({ file, port });
  if (baseline.status !== 0) throw new Error(`Baseline is not green for ${fault}; refusing to classify a mutation failure as proof.`);

  const mutant = runProbe({ file, port: port + 10, fault });
  const targetFailure = new RegExp(`\\bx\\s+\\d+\\s+\\[chromium\\]\\s+›[^\\r\\n]*${escapeRegex(title)}`, 'i');
  const hasPlaywrightFailure = /\b[1-9]\d* failed\b/i.test(mutant.output)
    && targetFailure.test(mutant.output);
  if (mutant.status === 0 || !hasPlaywrightFailure) {
    throw new Error(`Mutation ${fault} was not killed by an asserted Playwright test (status=${mutant.status}).`);
  }
  console.log(`Killed deliberate mutation with asserted test failure: ${fault}`);
}
