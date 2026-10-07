import { execFileSync } from 'node:child_process';

export function buildVersion() {
  const supplied = process.env.PUBLIC_DATADOG_VERSION || process.env.GITHUB_SHA || process.env.CI_COMMIT_SHA;
  if (supplied) return supplied;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return 'unknown';
  }
}
