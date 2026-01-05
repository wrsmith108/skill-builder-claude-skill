# Generalization Patterns for Skills

This document provides detailed patterns for ensuring skills are generic and suitable for public distribution.

---

## Pattern 1: Varlock for Secrets Management

### Problem
- Hardcoded secrets make skills unusable by other users
- Exposing secrets in terminal output leaks them to Claude's context
- Environment variables need validation and documentation

### Solution: Varlock Integration

**CRITICAL**: All skills handling secrets MUST use Varlock to prevent exposure.

#### Required Files

```
skill-name/
├── .env.schema      # Variable definitions with @sensitive annotations
├── .env.example     # Template with placeholders (committed)
└── .env             # Actual secrets (NEVER committed)
```

#### .env.schema Format

```bash
# .env.schema - Commit this file
# @type=string(startsWith=lin_api_) @required @sensitive
LINEAR_API_KEY=

# @type=string @required @sensitive
MY_SKILL_API_KEY=

# @type=string @optional
MY_SKILL_PROJECT_ID=

# @type=enum(development,staging,production) @default=development
NODE_ENV=
```

#### Safe Commands (Always Use)

```bash
# Validate environment (masked output)
varlock load

# Run commands with secrets injected
varlock run -- npx tsx scripts/my-script.ts

# Check specific variable (masked)
varlock load 2>&1 | grep MY_SKILL
```

#### Unsafe Commands (NEVER Use)

```bash
# ❌ NEVER - exposes secrets to Claude's context
echo $MY_SKILL_API_KEY
printenv | grep API
cat .env
my-tool config show  # Many tools print secrets!
```

### Code Pattern with Varlock

```typescript
// Configuration at top of file
// Secrets are injected via `varlock run` - never log them!
const CONFIG = {
  apiKey: process.env.MY_SKILL_API_KEY,
  projectId: process.env.MY_SKILL_PROJECT_ID,
  baseUrl: process.env.MY_SKILL_BASE_URL || 'https://api.example.com'
}

// Validate required config WITHOUT logging values
function validateConfig() {
  const missing: string[] = []
  if (!CONFIG.apiKey) missing.push('MY_SKILL_API_KEY')
  if (!CONFIG.projectId) missing.push('MY_SKILL_PROJECT_ID')

  if (missing.length > 0) {
    // Log variable NAMES only, never values
    throw new Error(`Missing required environment variables: ${missing.join(', ')}. Run: varlock load`)
  }
}

validateConfig()
```

### Documentation Pattern with Varlock

```markdown
## Configuration

### Setup with Varlock (Recommended)

1. Create `.env.schema`:
   ```bash
   # @type=string @required @sensitive
   MY_SKILL_API_KEY=
   ```

2. Create `.env` with your values (never commit):
   ```bash
   MY_SKILL_API_KEY=your-actual-key
   ```

3. Validate setup:
   ```bash
   varlock load
   ```

4. Run commands:
   ```bash
   varlock run -- npx tsx scripts/my-script.ts
   ```

### Environment Variables

| Variable | Required | Sensitive | Description |
|----------|----------|-----------|-------------|
| `MY_SKILL_API_KEY` | Yes | 🔐 Yes | API key for authentication |
| `MY_SKILL_PROJECT_ID` | No | No | Target project identifier |
```

---

## Pattern 2: Parameterized Functions

### Problem
Functions hardcoded with specific project names.

### Solution
Accept parameters with sensible defaults from environment.

```typescript
// Before (project-specific)
export async function updateSkillsmithProject() {
  const projectId = '5e1cebfe-f4bb-42c1-988d-af792fc4253b'
  // ...
}

// After (parameterized)
export async function updateProject(
  projectId: string = process.env.DEFAULT_PROJECT_ID || ''
): Promise<Result> {
  if (!projectId) {
    throw new Error('projectId is required. Set DEFAULT_PROJECT_ID or pass explicitly.')
  }
  // ...
}
```

### Filtering Pattern

```typescript
// Before (hardcoded filter)
const projects = await client.projects({
  filter: { name: { contains: 'Skillsmith' } }
})

// After (parameterized filter)
export async function getProjects(
  nameFilter?: string
): Promise<Project[]> {
  const filter = nameFilter
    ? { filter: { name: { contains: nameFilter } } }
    : undefined
  return client.projects(filter)
}
```

---

## Pattern 3: Generic Examples

### Problem
Examples reference specific projects or internal resources.

### Solution
Use placeholder values with clear instructions.

```markdown
## Example Usage

### Link a project to an initiative

```bash
# Set your initiative ID (use Varlock for production)
export LINEAR_DEFAULT_INITIATIVE_ID="<your-initiative-uuid>"

# Link all projects containing "MyProject"
varlock run -- npx tsx lib/initiative.ts link $LINEAR_DEFAULT_INITIATIVE_ID "MyProject"
```

### Verify project structure

```bash
varlock run -- npx tsx lib/verify.ts all <initiative-id> [project-filter]
```

**Parameters:**
- `<initiative-id>`: Your Linear initiative UUID
- `[project-filter]`: Optional string to filter project names
```

---

## Pattern 4: Deprecation for Backwards Compatibility

### Problem
Renaming functions breaks existing users.

### Solution
Export both old and new names with deprecation notice.

```typescript
// New generalized function
export async function linkProjectsToInitiative(
  initiativeId: string,
  projectFilter?: { name?: { contains?: string } }
): Promise<Result> {
  // implementation
}

// Deprecated alias for backwards compatibility
/** @deprecated Use linkProjectsToInitiative instead */
export const linkAllSkillsmithProjects = () =>
  linkProjectsToInitiative(
    process.env.LINEAR_DEFAULT_INITIATIVE_ID || '',
    { name: { contains: 'Skillsmith' } }
  )
```

---

## Pattern 5: CLI with Environment Fallbacks

### Problem
CLI tools require all arguments every time.

### Solution
Support both explicit arguments and environment fallbacks.

```typescript
// CLI entry point
if (require.main === module) {
  async function main() {
    const command = process.argv[2]
    const arg1 = process.argv[3] || process.env.DEFAULT_ARG1
    const arg2 = process.argv[4] || process.env.DEFAULT_ARG2

    if (!arg1) {
      console.log('Usage: script.ts command <arg1> [arg2]')
      console.log('')
      console.log('Or set environment variables:')
      console.log('  DEFAULT_ARG1 - First argument')
      console.log('  DEFAULT_ARG2 - Second argument')
      console.log('')
      console.log('For secrets, use Varlock:')
      console.log('  varlock run -- npx tsx script.ts command')
      process.exit(1)
    }

    // Process command
  }

  main().catch(console.error)
}
```

---

## Pattern 6: Configuration Objects with Varlock

### Problem
Multiple scattered environment variable checks.

### Solution
Centralized configuration with validation.

```typescript
// config.ts
export interface Config {
  apiKey: string
  projectId?: string
  baseUrl: string
  debug: boolean
}

export function loadConfig(): Config {
  const config: Config = {
    apiKey: process.env.API_KEY || '',
    projectId: process.env.PROJECT_ID,
    baseUrl: process.env.BASE_URL || 'https://api.example.com',
    debug: process.env.DEBUG === 'true'
  }

  // Validate required fields - NEVER log the actual values!
  if (!config.apiKey) {
    throw new Error('API_KEY environment variable is required. Use: varlock run -- npx tsx ...')
  }

  return config
}

// Usage in other files
import { loadConfig } from './config'
const config = loadConfig()
```

---

## Pattern 7: Documentation Structure with Varlock

### Problem
Environment variables scattered throughout docs.

### Solution
Dedicated configuration section at top of SKILL.md.

```markdown
---
name: My Skill
description: ...
---

# My Skill

Brief description of what the skill does.

---

## Configuration

### Varlock Setup (Required for Secrets)

Create `.env.schema` in your project:
```bash
# @type=string @required @sensitive
API_KEY=

# @type=string @optional
PROJECT_ID=
```

Create `.env` with your values (never commit):
```bash
API_KEY=your-actual-key
PROJECT_ID=your-project-id
```

Validate:
```bash
varlock load
```

### Environment Variables

| Variable | Required | Sensitive | Default | Description |
|----------|----------|-----------|---------|-------------|
| `API_KEY` | Yes | 🔐 Yes | - | Your API authentication key |
| `PROJECT_ID` | No | No | - | Target project identifier |
| `BASE_URL` | No | No | `https://api.example.com` | API endpoint |
| `DEBUG` | No | No | `false` | Enable debug logging |

---

## Usage

Always run with Varlock to inject secrets safely:
```bash
varlock run -- npx tsx scripts/my-script.ts [args]
```

[Rest of documentation...]
```

---

## Anti-Patterns to Avoid

### 1. Inline Hardcoded Values

❌ **Bad:**
```typescript
const INITIATIVE_ID = '5e1cebfe-f4bb-42c1-988d-af792fc4253b'
const PROJECT_NAME = 'Skillsmith'
```

### 2. Company-Specific Terminology

❌ **Bad:**
```markdown
## Updating Acme Corp Projects
Link all Acme projects to the Q4 Initiative.
```

### 3. Internal URL References

❌ **Bad:**
```typescript
const API_URL = 'https://internal.company.com/api'
```

### 4. Team-Specific Logic

❌ **Bad:**
```typescript
if (user.team === 'engineering') {
  // Special handling for engineering team
}
```

### 5. Exposing Secrets in Terminal Output

❌ **Bad:**
```bash
echo $API_KEY
linear config show
cat .env
```

✅ **Good:**
```bash
varlock load  # Masked output
varlock run -- my-command
```

### 6. Undocumented Environment Variables

❌ **Bad:**
```typescript
// Uses env vars without documentation
const key = process.env.SECRET_KEY
```

---

## Checklist for Generalization

Before committing:

- [ ] All secrets use Varlock with `.env.schema` annotations
- [ ] All IDs/UUIDs come from environment variables
- [ ] All project names are parameterized or use placeholders
- [ ] All URLs are configurable
- [ ] Environment variables are validated with clear error messages (no values logged!)
- [ ] Environment variables are documented in SKILL.md with sensitivity flags
- [ ] Examples use generic placeholders like `<your-value>`
- [ ] CLI tools show help with `varlock run` instructions
- [ ] No company/team-specific references
- [ ] No commands that could expose secrets (echo $VAR, cat .env, etc.)
- [ ] Backwards compatibility maintained if renaming exports
