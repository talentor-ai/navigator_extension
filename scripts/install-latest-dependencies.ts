/**
 * Install dependencies pinned to the current npm `latest` version.
 *
 * Usage:
 *   bun run scripts/install-latest-dependencies.ts [--dev] [--cwd <dir>] <pkg>...
 *
 * - Resolves each package through https://registry.npmjs.org/<pkg>/latest at run time.
 * - Installs the exact resolved version with `bun add --exact`, updating package.json and bun.lock.
 * - Workspace-local packages use `workspace:*`; this script is only for registry packages.
 */
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const packages: string[] = [];
let dev = false;
let cwd: string | null = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--dev') {
    dev = true;
  } else if (arg === '--cwd') {
    cwd = args[++i];
  } else if (arg.startsWith('--')) {
    console.error(`Unknown flag: ${arg}`);
    process.exit(1);
  } else {
    packages.push(arg);
  }
}

if (packages.length === 0) {
  console.error(
    'Usage: bun run scripts/install-latest-dependencies.ts [--dev] [--cwd <dir>] <pkg>...',
  );
  process.exit(1);
}

async function latestVersion(name: string): Promise<string> {
  const url = `https://registry.npmjs.org/${encodeURIComponent(name)}/latest`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to resolve ${name}: HTTP ${response.status}`);
  }
  const body = (await response.json()) as { version: string };
  return body.version;
}

const dir = cwd ? resolve(cwd) : process.cwd();

for (const name of packages) {
  // Accept explicit `pkg@version` specs; otherwise resolve the npm `latest` tag.
  const explicit =
    name.includes('@') && !name.startsWith('@') ? name.split('@') : null;
  const spec = explicit
    ? `${explicit[0]}@${explicit[1]}`
    : `${name}@${await latestVersion(name)}`;
  const cmdArgs = ['add', '--exact', spec];
  if (dev) {
    cmdArgs.push('--dev');
  }
  console.log(`Installing ${spec}${dev ? ' (dev)' : ''} in ${dir}`);
  const result = spawnSync('bun', cmdArgs, { cwd: dir, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`Failed to install ${spec}`);
    process.exit(result.status ?? 1);
  }
}
