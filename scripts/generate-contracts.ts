/**
 * Generate TypeScript API contracts from the live backend OpenAPI document.
 *
 *   bun run generate:contracts
 *
 * Reads http://localhost:3011/openapi.json (override with API_URL) and writes
 * packages/contracts/src/generated.ts. The backend must be running.
 */
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const apiUrl = process.env.API_URL ?? 'http://localhost:3011/openapi.json';
const output = resolve('packages/contracts/src/generated.ts');

console.log(`Generating contracts from ${apiUrl} -> ${output}`);
execSync(`openapi-typescript "${apiUrl}" -o "${output}"`, { stdio: 'inherit' });
console.log('Contracts generated.');
