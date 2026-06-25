#!/usr/bin/env node

/**
 * Setup verification for the {{SKILL_TITLE}} skill.
 *
 * Copy to skills/{{SKILL_NAME}}/scripts/setup.mjs and customize the checks below.
 * Provides immediate, actionable feedback that the skill is installed correctly.
 *
 * Usage: node skills/{{SKILL_NAME}}/scripts/setup.mjs
 */

import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

// Skill root is two levels up from scripts/ (skills/<name>/scripts/ -> skills/<name>/)
const skillDir = dirname(dirname(fileURLToPath(import.meta.url)));

let ok = true;
const check = (label, passed) => {
  console.log(`${passed ? GREEN + '✓' : RED + '✗'}${RESET} ${label}`);
  if (!passed) ok = false;
};

// --- Customize these checks for your skill ---
check('SKILL.md present', existsSync(join(skillDir, 'SKILL.md')));
// Example: check that a required CLI is available, an env var is set, etc.
// check('gh CLI installed', spawnSync('gh', ['--version']).status === 0);

console.log('');
console.log(ok ? `${GREEN}Setup looks good.${RESET}` : `${RED}Setup incomplete — see above.${RESET}`);
process.exit(ok ? 0 : 1);
