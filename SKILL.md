---
name: Skill Builder
description: This skill should be used when the user asks to "create a skill", "update a skill", "review my skill", "improve skill quality", "publish a skill", or when modifying any skill in ~/.claude/skills/. Enforces generalization rules and quality standards for skills intended for public use.
version: 1.0.0
---

# Skill Builder

Build, update, and validate Claude Code skills following best practices for public distribution.

---

## Core Principle: Generalization for Public Users

**CRITICAL**: Skills in `~/.claude/skills/` may be shared publicly. Never include:

| ❌ Never Include | ✅ Use Instead |
|------------------|----------------|
| Hardcoded project names | Environment variables |
| Specific UUIDs/IDs | `process.env.VAR_NAME` |
| Personal API endpoints | Configurable URLs |
| Company-specific logic | Generic patterns |
| Internal team references | Generic examples |

### Example: Linear Skill Refactoring

**Before (project-specific):**
```typescript
export const INITIATIVES = {
  SKILLSMITH: '5e1cebfe-f4bb-42c1-988d-af792fc4253b'
}
export async function linkAllSkillsmithProjects() { ... }
```

**After (generalized):**
```typescript
export const DEFAULT_INITIATIVE_ID = process.env.LINEAR_DEFAULT_INITIATIVE_ID || ''
export async function linkProjectsToInitiative(initiativeId: string, filter?) { ... }
```

---

## Skill Creation Checklist

### 1. Structure Validation

```
skill-name/
├── SKILL.md              # Required: Core instructions
├── references/           # Optional: Detailed docs
├── scripts/              # Optional: Utility scripts
└── examples/             # Optional: Working examples
```

### 2. SKILL.md Requirements

**Frontmatter (required):**
```yaml
---
name: Skill Name
description: This skill should be used when the user asks to "phrase 1", "phrase 2", "phrase 3". Be specific with trigger phrases.
version: 1.0.0
---
```

**Body requirements:**
- Use imperative form ("Configure the server", not "You should configure")
- Keep under 2,000 words (move details to references/)
- Reference all bundled resources
- No project-specific details

### 3. Generalization Checklist

Before publishing or committing any skill:

- [ ] **No hardcoded IDs**: UUIDs, project IDs, initiative IDs → environment variables
- [ ] **No specific names**: Project names, company names → generic examples
- [ ] **No personal URLs**: API endpoints, webhooks → configurable via env vars
- [ ] **No internal references**: Team names, internal docs → generic documentation
- [ ] **Environment variables documented**: All required env vars listed
- [ ] **Generic examples**: Examples use placeholder values like `<your-uuid>`

### 4. Varlock for Secrets Management

**CRITICAL**: All skills handling secrets MUST use Varlock to prevent exposure.

#### Required Files

```
skill-name/
├── .env.schema      # Variable definitions with @sensitive annotations (commit)
├── .env.example     # Template with placeholders (commit)
└── .env             # Actual secrets (NEVER commit)
```

#### .env.schema Format

```bash
# @type=string(startsWith=lin_api_) @required @sensitive
LINEAR_API_KEY=

# @type=string @optional
LINEAR_DEFAULT_INITIATIVE_ID=
```

#### Safe Commands (Always Use)

```bash
varlock load                           # Validate (masked output)
varlock run -- npx tsx scripts/my.ts   # Run with secrets injected
```

#### Unsafe Commands (NEVER Use)

```bash
echo $API_KEY        # ❌ Exposes to Claude's context
cat .env             # ❌ Exposes all secrets
tool config show     # ❌ Many tools print secrets!
```

#### Document in SKILL.md

```markdown
## Environment Variables

| Variable | Required | Sensitive | Description |
|----------|----------|-----------|-------------|
| `LINEAR_API_KEY` | Yes | 🔐 Yes | Your Linear API key |
| `LINEAR_DEFAULT_INITIATIVE_ID` | No | No | Default initiative for linking |
```

---

## Skill Update Workflow

When modifying an existing skill:

### Step 1: Audit for Project-Specific Content

```bash
# Search for hardcoded values
grep -r "SKILLSMITH\|MyProject\|specific-id" skill-name/
grep -r "[0-9a-f]{8}-[0-9a-f]{4}" skill-name/  # UUIDs
```

### Step 2: Extract to Environment Variables

```typescript
// Before
const PROJECT_ID = '5e1cebfe-f4bb-42c1-988d-af792fc4253b'

// After
const PROJECT_ID = process.env.MY_SKILL_PROJECT_ID || ''
if (!PROJECT_ID) {
  throw new Error('MY_SKILL_PROJECT_ID environment variable required')
}
```

### Step 3: Rename Project-Specific Functions

```typescript
// Before
export async function updateSkillsmithProject() { ... }

// After
export async function updateProject(projectId: string) { ... }
```

### Step 4: Update Documentation

- Replace specific examples with generic placeholders
- Document all environment variables
- Add configuration section to SKILL.md

### Step 5: Validate

Run the validation script:
```bash
npx tsx ~/.claude/skills/skill-builder/scripts/validate-skill.ts skill-name/
```

---

## Common Mistakes

### Mistake 1: Hardcoded Project References

❌ **Bad:**
```typescript
const result = await createSkillsmithProject({...})
await linkToSkillsmithInitiative(projectId)
```

✅ **Good:**
```typescript
const result = await createProject(teamId, {..., initiative: initiativeId})
await linkProjectToInitiative(projectId, initiativeId)
```

### Mistake 2: Missing Environment Variable Validation

❌ **Bad:**
```typescript
const apiKey = process.env.API_KEY  // Silently undefined
```

✅ **Good:**
```typescript
const apiKey = process.env.API_KEY
if (!apiKey) {
  throw new Error('API_KEY environment variable is required')
}
```

### Mistake 3: Project-Specific Examples

❌ **Bad:**
```markdown
## Example
Link the Skillsmith Phase 5 project to the initiative.
```

✅ **Good:**
```markdown
## Example
Link a project to an initiative:
\`\`\`bash
npx tsx lib/initiative.ts link <initiative-id> [project-filter]
\`\`\`
```

---

## Lessons Learned from Linear Skill

The Linear skill update revealed common patterns to avoid:

### 1. Hardcoded Initiative IDs
- **Problem**: `INITIATIVES.SKILLSMITH = '5e1cebfe-...'`
- **Solution**: `DEFAULT_INITIATIVE_ID = process.env.LINEAR_DEFAULT_INITIATIVE_ID`

### 2. Project-Specific Function Names
- **Problem**: `linkAllSkillsmithProjects()`, `verifyAllSkillsmithProjects()`
- **Solution**: `linkProjectsToInitiative(id, filter)`, `verifyProjectsForInitiative(id, filter)`

### 3. Missing Configuration Documentation
- **Problem**: Users didn't know what env vars to set
- **Solution**: Add environment variable table to SKILL.md

### 4. Non-Generic Examples
- **Problem**: Examples referenced "Skillsmith Phase X"
- **Solution**: Use "My Project Phase X" or `<your-project-name>`

---

## Quality Standards

### Code Quality
- TypeScript with strict mode
- Proper error handling with descriptive messages
- Input validation for required parameters
- JSDoc comments for public functions

### Documentation Quality
- Clear purpose statement
- Step-by-step workflows
- Working examples with placeholders
- Environment variable documentation
- Troubleshooting section

### Maintainability
- No duplicated logic across files
- Shared utilities in `lib/` or `scripts/`
- Consistent naming conventions
- Version number in frontmatter

---

## Validation Script

Run before committing skill changes:

```bash
# Validate a skill
npx tsx ~/.claude/skills/skill-builder/scripts/validate-skill.ts path/to/skill

# Check for project-specific content
npx tsx ~/.claude/skills/skill-builder/scripts/check-generalization.ts path/to/skill
```

---

## Additional Resources

### Reference Files
- **`references/generalization-patterns.md`** - Detailed patterns for generalizing skills
- **`references/linear-retro.md`** - Full retrospective from Linear skill update

### Scripts
- **`scripts/validate-skill.ts`** - Validate skill structure and content
- **`scripts/check-generalization.ts`** - Check for project-specific content

---

## Integration with Skill Updates

**This skill should be automatically invoked when:**
- Creating new skills
- Updating existing skills in `~/.claude/skills/`
- Reviewing skills before publishing
- Committing changes to skill repositories

To ensure this skill is used, add to your CLAUDE.md:
```markdown
## Skill Development
When creating or updating skills, always use the skill-builder skill to validate
generalization and quality standards before committing.
```
