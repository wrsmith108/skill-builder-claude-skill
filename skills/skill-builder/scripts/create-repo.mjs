#!/usr/bin/env node

/**
 * GitHub Repository Creator for Claude Code Skills
 *
 * Creates a public GitHub repository with proper topics for discoverability.
 *
 * Usage:
 *   node create-repo.mjs --name "skill-name-claude-skill" \
 *                        --description "Description" \
 *                        --topics "claude,claude-code,topic1,topic2"
 *
 * Prerequisites:
 *   - gh CLI installed and authenticated
 *   - Git repository initialized in current directory
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { basename } from 'path';

// ANSI colors
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function log(msg) {
  console.log(msg);
}

function success(msg) {
  console.log(`${GREEN}✓${RESET} ${msg}`);
}

function error(msg) {
  console.log(`${RED}✗${RESET} ${msg}`);
}

function warn(msg) {
  console.log(`${YELLOW}⚠${RESET} ${msg}`);
}

function info(msg) {
  console.log(`${BLUE}ℹ${RESET} ${msg}`);
}

function run(cmd, options = {}) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: options.silent ? 'pipe' : 'inherit', ...options });
  } catch (e) {
    if (!options.ignoreError) {
      throw e;
    }
    return null;
  }
}

// Parse arguments
const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(`--${name}`);
  return index !== -1 ? args[index + 1] : null;
};

const name = getArg('name') || basename(process.cwd());
const description = getArg('description') || 'Claude Code skill';
const topicsArg = getArg('topics') || 'claude,claude-code,claude-plugin';
const topics = topicsArg.split(',').map(t => t.trim());

log(`\n${BOLD}🚀 Creating GitHub Repository${RESET}\n`);
log('━'.repeat(50));

// Pre-flight checks
log(`\n${BOLD}Pre-flight Checks${RESET}`);

// Check gh CLI
try {
  run('gh --version', { silent: true });
  success('gh CLI installed');
} catch {
  error('gh CLI not installed');
  info('Install: brew install gh && gh auth login');
  process.exit(1);
}

// Check gh auth
try {
  run('gh auth status', { silent: true });
  success('gh CLI authenticated');
} catch {
  error('gh CLI not authenticated');
  info('Run: gh auth login');
  process.exit(1);
}

// Check git repo
if (!existsSync('.git')) {
  error('Not a git repository');
  info('Run: git init');
  process.exit(1);
}
success('Git repository exists');

// Check for commits
try {
  run('git rev-parse HEAD', { silent: true });
  success('Has commits');
} catch {
  error('No commits found');
  info('Run: git add -A && git commit -m "Initial commit"');
  process.exit(1);
}

// Required files check
const requiredFiles = ['README.md', 'LICENSE', 'package.json', 'skills'];
for (const file of requiredFiles) {
  if (existsSync(file)) {
    success(`${file} exists`);
  } else {
    warn(`${file} missing (recommended)`);
  }
}

// Create repository
log(`\n${BOLD}Creating Repository${RESET}`);
info(`Name: ${name}`);
info(`Description: ${description}`);
info(`Topics: ${topics.join(', ')}`);

try {
  // Create repo
  log('\nCreating GitHub repository...');
  run(`gh repo create ${name} --public --description "${description}" --source . --push`);
  success('Repository created and pushed');
} catch (e) {
  // Repo might exist, try pushing
  warn('Repository may already exist, trying to push...');
  try {
    run(`git remote set-url origin https://github.com/$(gh api user --jq .login)/${name}.git`, { ignoreError: true });
    run('git push -u origin main');
    success('Pushed to existing repository');
  } catch {
    error('Failed to push. Check repository settings.');
    process.exit(1);
  }
}

// Add topics
log('\nAdding topics for discoverability...');
const topicArgs = topics.map(t => `--add-topic ${t}`).join(' ');
try {
  const username = run('gh api user --jq .login', { silent: true }).trim();
  run(`gh repo edit ${username}/${name} ${topicArgs}`, { silent: true });
  success(`Added ${topics.length} topics`);
} catch {
  warn('Could not add all topics (some may be invalid)');
}

// Final output
log('\n' + '━'.repeat(50));
log(`\n${GREEN}${BOLD}✓ Repository created successfully!${RESET}\n`);

const username = run('gh api user --jq .login', { silent: true }).trim();
log(`${BOLD}URL:${RESET} https://github.com/${username}/${name}`);
log(`${BOLD}Clone:${RESET} git clone https://github.com/${username}/${name}`);
log(`${BOLD}Install:${RESET} claude plugin add github:${username}/${name}\n`);

// Next steps
log(`${BOLD}Next Steps:${RESET}`);
log('1. Update README.md with specific usage instructions');
log('2. Add more topics if needed: gh repo edit --add-topic <topic>');
log('3. Create a release: gh release create v1.0.0');
log('');
