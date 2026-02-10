---
name: Skill Builder
description: >
  This skill should be used when the user asks to "create a skill", "update a skill",
  "review my skill", "improve skill quality", "publish a skill", "generalize skill",
  "check for hardcoded values", "review for specific references", "validate skill for publishing",
  or when modifying any skill in ~/.claude/skills/. Enforces generalization rules and
  quality standards for skills intended for public use.
version: 1.1.0
triggers:
  keywords:
    - create a skill
    - update a skill
    - review my skill
    - improve skill quality
    - publish a skill
    - generalize skill
    - check for hardcoded
    - specific references
    - validate skill
    - skill for publishing
  paths:
    - ~/.claude/skills/**
  explicit:
    - /skill-builder
    - /validate-skill
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

## Behavioral Classification (ADR-025)

Every skill must declare its behavioral type. This determines how the skill interacts with users.

### 1. Autonomous Execution

**Directive**: EXECUTE, DON'T ASK

Skills that follow a prescribed workflow automatically. No permission-seeking.

| Use For | Examples |
|---------|----------|
| Enforcement/compliance | governance, docker-enforce |
| Automated fixes | lint-fix, format |
| CI/CD integrations | deploy, release |

### 2. Guided Decision

**Directive**: ASK, THEN EXECUTE

Skills that ask structured questions upfront, then execute based on decisions.

| Use For | Examples |
|---------|----------|
| Planning/architecture | wave-planner, mcp-decision-helper |
| Configuration wizards | init, setup |
| Template generators | skill-builder |

### 3. Interactive Exploration

**Directive**: ASK THROUGHOUT

Skills with ongoing dialogue. The conversation IS the value.

| Use For | Examples |
|---------|----------|
| Research/exploration | researcher |
| Browser automation | dev-browser |
| Debugging sessions | debugger |

### 4. Configurable Enforcement

**Directive**: USER-CONFIGURED

Skills that adapt behavior based on project/user configuration.

| Use For | Examples |
|---------|----------|
| Security tools with severity levels | varlock, security-auditor |
| Linting with configurable strictness | eslint-wrapper |
| Environment-dependent workflows | ci-doctor |

### Classification Decision Tree

```
Does the skill need user input to work?
│
├─ NO → Autonomous Execution
│
└─ YES → Is input needed throughout, or just upfront?
         │
         ├─ UPFRONT → Guided Decision
         │
         └─ THROUGHOUT → Interactive Exploration

Exception: If behavior depends on config → Configurable Enforcement
```

---

## Skill Creation Checklist

### 1. Structure Validation

```
skill-name/
├── SKILL.md              # Required: Core instructions
├── references/           # Optional: Detailed docs
├── scripts/              # Optional: Utility scripts
├── hooks/                # Optional: Pre/post command hooks
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

**Behavioral Classification (required in body):**

Every skill MUST include a Behavioral Classification section immediately after the title.

```markdown
## Behavioral Classification

**Type**: [Autonomous Execution | Guided Decision | Interactive Exploration | Configurable Enforcement]

**Directive**: [EXECUTE, DON'T ASK | ASK, THEN EXECUTE | ASK THROUGHOUT | USER-CONFIGURED]

[Brief description of how the skill interacts with users]
```

**Body requirements:**
- Use imperative form ("Configure the server", not "You should configure")
- Keep under 2,000 words (move details to references/)
- Reference all bundled resources
- No project-specific details

### 3. Generalization Checklist

Before publishing or committing any skill:

- [ ] **Behavioral classification declared**: Type and directive documented
- [ ] **No hardcoded IDs**: UUIDs, project IDs, initiative IDs → environment variables
- [ ] **No specific names**: Project names, company names → generic examples
- [ ] **No personal URLs**: API endpoints, webhooks → configurable via env vars
- [ ] **No internal references**: Team names, internal docs → generic documentation
- [ ] **Environment variables documented**: All required env vars listed
- [ ] **Generic examples**: Examples use placeholder values like `<your-uuid>`

### 3.1 Documentation Generalization (MANDATORY)

**CRITICAL**: ALL documentation files (README.md, references/, examples/, lessons-learned.md) MUST be fully generalized. This is non-negotiable for public skills.

#### What to Generalize in Documentation

| ❌ Project-Specific | ✅ Generic Replacement |
|--------------------|------------------------|
| "Skillsmith" | "[Project Name]" or "your project" |
| "SMI-1234" (Linear issues) | "[ISSUE-ID]" or "[Tracking Issue]" |
| "Apache-2.0 to Elastic License 2.0" | "[Old License] to [New License]" |
| "ADR-013", "ADR-017" | "ADR-XXX", "ADR-YYY" |
| Specific file paths from a project | Generic paths like "docs/adr/*.md" |
| Company names (Smith Horn Group, etc.) | "[Your Company]" or omit entirely |
| Real dates tied to a project | "[Date]" or "[Month Year]" |

#### Case Studies and Examples

When including case studies or lessons learned:

```markdown
# ❌ BAD - Project-specific case study
## Case Study: Skillsmith License Migration (January 2026)
After migrating Skillsmith from Apache-2.0 to Elastic License 2.0...
Created Linear issue SMI-1369...

# ✅ GOOD - Generalized case study
## Case Study: License Migration (Generic Example)
After migrating a project from an open-source license (e.g., Apache-2.0, MIT)
to a source-available license (e.g., Elastic License 2.0, BSL)...
Created tracking issue [ISSUE-ID]...
```

#### Templates Must Use Placeholders

All templates in a skill must use generic placeholders:

```markdown
# ❌ BAD - Specific project in template
> **Linear Issue:** SMI-XXXX (to be created)
> See [ADR-013](../adr/013-open-core-licensing.md)

# ✅ GOOD - Generic placeholders
> **Tracking Issue:** [ISSUE-ID] (to be created)
> See [ADR-XXX](../adr/XXX.md)
```

#### Automatic Generalization Check

Before publishing ANY skill, run:
```bash
# Search for common project-specific patterns
grep -ri "skillsmith\|smi-[0-9]\|smith.horn" skill-name/
grep -ri "lin_api_\|api_key.*=" skill-name/  # Exposed secrets
```

**If ANY matches are found, the skill is NOT ready for publishing.**

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
npx tsx scripts/validate-skill.ts skill-name/
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
npx tsx scripts/validate-skill.ts path/to/skill

# Check for project-specific content
npx tsx scripts/check-generalization.ts path/to/skill
```

---

## Subagent Pair Generation

### When to Generate a Subagent

Generate a companion subagent when the skill:
- Produces verbose output (>500 tokens working context)
- Involves document processing (PDF, Excel, large files)
- Performs multi-file analysis or code review
- Runs test suites with detailed output
- Conducts research with iterative exploration

**Token Savings**: 37-97% reduction through context isolation.

### Subagent Definition Structure

Every skill can have a companion subagent defined at `~/.claude/agents/[skill-name]-specialist.md`:

```yaml
---
name: [skill-name]-specialist
description: [Skill purpose]. Use when [trigger conditions].
skills: [skill-name]
tools: [minimal tool set]
model: sonnet
---

## Operating Protocol

1. Execute the [skill-name] skill for the delegated task
2. Process all intermediate results internally
3. Return ONLY a structured summary to the orchestrator

## Output Format

- **Task:** [what was requested]
- **Actions:** [what you did]
- **Results:** [key outcomes, max 3-5 bullet points]
- **Artifacts:** [file paths or outputs created]

Keep response under 500 tokens unless explicitly requested.
```

### Tool Set Determination

| Skill Content Contains | Include Tools |
|------------------------|---------------|
| Always | Read |
| write, create, edit | Write, Edit |
| bash, npm, command | Bash |
| search, find, grep | Grep, Glob |
| web, fetch, url | WebFetch |

### CLI Commands for Subagent Generation

```bash
# Generate subagent for a skill
skillsmith author subagent [path] [options]
  -o, --output <path>   Output directory (default: ~/.claude/agents)
  --tools <tools>       Override tools (comma-separated)
  --model <model>       Model to use (default: sonnet)
  --skip-claude-md      Skip CLAUDE.md snippet generation

# Transform existing skill (non-destructive)
skillsmith author transform [path] [options]
  --dry-run             Preview without creating files
  --force               Overwrite existing subagent
  --batch <paths>       Process multiple skills
```

### CLAUDE.md Delegation Snippet

After generating a subagent, add to your CLAUDE.md:

```markdown
## Subagent Delegation

When tasks match [skill-name] triggers, delegate to the [skill-name]-specialist
subagent instead of executing directly. This provides context isolation and
token savings.

### Delegation Pattern
- Detect: User requests [trigger phrases]
- Delegate: Task tool with subagent_type="[skill-name]-specialist"
- Receive: Structured summary (under 500 tokens)
```

### Template and Script References

- **`templates/subagent-template.md`** - Base template for subagent generation
- **`scripts/generate-subagent.ts`** - Generation logic and tool detection

---

## Enforcement Hooks Pattern (Optional)

Skills can include pre/post command hooks for policy enforcement. This pattern is optional and most useful for skills that enforce development policies.

### When to Add Hooks

Add a `hooks/` directory when your skill needs to:
- Intercept commands before execution (pre-command)
- Validate environment state
- Transform commands automatically
- Enforce project policies

### Hooks Directory Structure

```
skill-name/
├── SKILL.md
├── hooks/
│   ├── pre-command.sh    # Runs before commands
│   └── post-command.sh   # Runs after commands (optional)
└── scripts/
```

### Pre-Command Hook Template

```bash
#!/bin/bash
# Pre-command hook for [skill-name]
# Called automatically by Claude Code hooks system

set -euo pipefail

COMMAND="${1:-}"
CONFIG_FILE=".claude/[skill-name]-config.json"

# Load configuration
load_config() {
    if [[ -f "$CONFIG_FILE" ]]; then
        # Parse config
        ENFORCEMENT=$(grep -o '"enforcement".*"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4 || echo "warn")
    else
        ENFORCEMENT="warn"
    fi
}

# Check if command should be intercepted
should_intercept() {
    # Add pattern matching logic
    echo "$COMMAND" | grep -qE "^pattern"
}

# Main enforcement
main() {
    load_config

    if ! should_intercept; then
        exit 0  # Allow command
    fi

    case "$ENFORCEMENT" in
        block)
            echo "ERROR: Policy violation" >&2
            exit 1
            ;;
        warn)
            echo "WARNING: Consider alternative approach" >&2
            exit 0
            ;;
        transform)
            # Transform and execute
            exec transformed-command
            ;;
    esac
}

main "$@"
```

### Configuration Pattern

Skills with hooks should support a configuration file:

```json
{
  "enforcement": "block|warn|transform|disabled",
  "allowedPatterns": ["pattern1", "pattern2"],
  "options": {}
}
```

### Example: docker-enforce

The `docker-enforce` skill demonstrates this pattern:

| Component | Purpose |
|-----------|---------|
| `hooks/pre-command.sh` | Intercepts npm/node commands |
| `.claude/docker-config.json` | Per-project configuration |
| Enforcement modes | block, warn, transform, disabled |

### Integration with Claude Code

To enable hooks in Claude Code, add to `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "bash ~/.claude/skills/[skill-name]/hooks/pre-command.sh \"$COMMAND\""
      }]
    }]
  }
}
```

**Note**: Hooks integration is optional and should only be added when the skill genuinely needs to enforce policies.

---

## Additional Resources

### Reference Files
- **`references/generalization-patterns.md`** - Detailed patterns for generalizing skills
- **`references/linear-retro.md`** - Full retrospective from Linear skill update
- **`references/orchestrator-delegation.md`** - Delegation patterns for subagents

### Scripts
- **`scripts/validate-skill.ts`** - Validate skill structure and content
- **`scripts/check-generalization.ts`** - Check for project-specific content
- **`scripts/generate-subagent.ts`** - Generate companion subagent for a skill

---

## Integration with Skill Updates

**This skill should be automatically invoked when:**
- Creating new skills
- Updating existing skills in `~/.claude/skills/`
- Reviewing skills before publishing
- Committing changes to skill repositories

### Automatic Triggering via Claude Code Hooks

Add to `~/.claude/settings.json` to automatically trigger skill-builder validation when editing skills:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "bash -c 'if [[ \"$CLAUDE_TOOL_ARG_FILE_PATH\" == */.claude/skills/* ]]; then echo \"[skill-builder] Reminder: Run generalization check before committing\"; fi'"
      }]
    }]
  }
}
```

This hook provides a reminder when editing skill files. For full validation, run:

```bash
# Check for project-specific content
grep -ri "skillsmith\|smi-[0-9]\|specific-uuid" ~/.claude/skills/<skill-name>/

# Or use the validation script
npx tsx scripts/check-generalization.ts ~/.claude/skills/<skill-name>/
```

### CLAUDE.md Integration

To ensure this skill is used, add to your CLAUDE.md:

```markdown
## Skill Development

When creating or updating skills in `~/.claude/skills/`, always:

1. **Invoke skill-builder** for validation: `/skill-builder` or "validate skill"
2. **Run generalization check** before committing
3. **Review for specific references** (project names, UUIDs, internal docs)

The skill-builder skill enforces generalization rules and quality standards.
```

### Why This Matters

**Lesson learned from SMI-1735**: During the Skill Architecture Refactor, skills were edited without invoking skill-builder, resulting in project-specific references that required a second pass to generalize.

**Root cause**: The trigger phrases didn't include "review for specific references" or "generalize", and there was no automatic hook to remind about validation.

**Fix applied**: Added trigger phrases and documented hook pattern in v1.1.0.
