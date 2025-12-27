# Claude Code Skill Best Practices

Curated patterns from mature skills (Linear, Governance) and real-world usage.

---

## 1. Skill Structure

### Required Files

| File | Purpose | Example |
|------|---------|---------|
| `skills/<name>/SKILL.md` | Core skill definition | Triggers, patterns, checklists |
| `README.md` | Installation and usage | Quick start, examples |
| `CHANGELOG.md` | Version history | Semver, lessons learned |
| `package.json` | Plugin metadata | `claude-plugin` section |
| `LICENSE` | License (MIT standard) | Open source |

### Recommended Files

| File | Purpose | When to Include |
|------|---------|-----------------|
| `skills/<name>/scripts/setup.mjs` | Setup verification | Always (immediate feedback) |
| `templates/` | Reusable templates | When skill generates files |
| `BEST-PRACTICES.md` | Domain guidance | Complex skills |

---

## 2. SKILL.md Patterns

### Frontmatter (Required)

```yaml
---
name: skill-name
description: When to use, trigger phrases included
allowed-tools:
  - Bash
  - Read
  - Write
---
```

**Why `allowed-tools`?** Explicitly declares dependencies, helps with permission management.

### Section Order (Recommended)

1. **Quick Start** — Gets users productive immediately
2. **When This Skill Activates** — Clear trigger documentation
3. **Core Patterns** — Main content, tables, examples
4. **Anti-Patterns** — What NOT to do
5. **Troubleshooting** — Common issues and fixes
6. **Related Documents** — Cross-references

### Quick Start Pattern

```markdown
## Quick Start (First-Time Users)

### 1. Verify Setup
```bash
node ~/.claude/skills/<name>/scripts/setup.mjs
```

### 2. Common Operations
```bash
# Most frequent command
npm run <name>:check
```

### 3. Getting Help
```bash
npm run <name>:help
```
```

**Why at top?** Users need immediate value. Don't bury it below theory.

---

## 3. CHANGELOG Patterns

### "Lesson Learned" Section

Every version should include:

```markdown
### Lesson Learned
MCP's update endpoint frequently fails with schema validation errors.
Direct GraphQL via helper scripts is 100% reliable.
```

**Why?** Captures *why* changes were made, not just *what*. Future maintainers understand the reasoning.

### Version Discipline

- **Major (X.0.0)**: Breaking changes, removed features
- **Minor (X.Y.0)**: New features, backwards compatible
- **Patch (X.Y.Z)**: Bug fixes, documentation

---

## 4. Anti-Pattern Tables

### Format

```markdown
| Anti-Pattern | Correct Pattern | Why |
|--------------|-----------------|-----|
| ❌ Bad thing | ✅ Good thing | Reason |
```

### Categories to Cover

1. **Code Quality** — Types, file length, secrets
2. **Documentation** — Duplication, missing docs
3. **Workflow** — Branching, commits, reviews
4. **Testing** — Coverage, mocking, flaky tests

**Why tables?** Scannable. Users quickly find what NOT to do.

---

## 5. Trigger Phrases

### In Description Frontmatter

```yaml
description: Engineering standards enforcement. Triggers on "code review", "commit", "standards", "compliance", "before I merge".
```

### Trigger Design

| Type | Example | Use When |
|------|---------|----------|
| Explicit command | `/skill-name` | User wants direct control |
| Natural language | "review this code" | Proactive assistance |
| Context keywords | "before I commit" | Workflow integration |

**Tip**: Include both explicit and natural triggers for flexibility.

---

## 6. Setup Verification Scripts

### Pattern

```javascript
#!/usr/bin/env node

// Check 1: Required file exists
if (existsSync(path)) {
  pass('File exists');
} else {
  fail('File missing', 'Create with: touch <path>');
}

// Check 2: Configuration valid
if (config.valid) {
  pass('Config valid');
} else {
  warn('Config issue', 'Fix: <specific instruction>');
}

// Summary
console.log(`Score: ${passes}/${total}`);
```

### Key Principles

1. **Actionable fixes** — Every failure includes how to fix it
2. **Pass/Warn/Fail levels** — Not everything is critical
3. **Score output** — Users see progress at a glance

---

## 7. Abstraction Patterns

### No Project-Specific References

| Bad | Good |
|-----|------|
| `CodeBlock.astro` | `Button.tsx`, `UserCard.astro` |
| `clerk_user_id` | `user_id`, `created_at` |
| `[SCHOOL-XXX]` | `[PROJECT-XXX]` |
| `Vitest` hardcoded | `Vitest, Jest, pytest` |

### Use Placeholders in Templates

```markdown
# {{SKILL_TITLE}}

{{DESCRIPTION}}.

Triggers: {{TRIGGER_PHRASES}}
```

---

## 8. GitHub Publishing

### Required Topics

Always include these for discoverability:

```
claude, claude-code, claude-plugin
```

### Domain Topics

Add 2-4 relevant domain topics:

```
governance, code-quality, standards
docker, containers, devops
testing, automation, ci-cd
```

### package.json `claude-plugin` Section

```json
{
  "claude-plugin": {
    "name": "Skill Title",
    "description": "One sentence for plugin registry",
    "skills": ["skills/<name>"]
  }
}
```

---

## 9. Cross-Referencing

### Section References

Use `§` notation for precise linking:

```markdown
See standards.md §1.3 for file organization rules.
```

### Relative Paths

From SKILL.md to repo root:

```markdown
[README](../../README.md)
[CHANGELOG](../../CHANGELOG.md)
[Templates](../../templates/)
```

---

## 10. Reference Skills

### Linear Skill — MCP Integration Pattern

- MCP reliability matrix (which tools work)
- Helper scripts for unreliable operations
- SDK automation for complex tasks
- GraphQL fallbacks for timeouts

### Governance Skill — Documentation Pattern

- Two-document model (CLAUDE.md + standards.md)
- Pre-commit/PR checklists
- Compliance audit scripts
- Section cross-references

### Varlock Skill — Security Pattern

- Critical rules at top
- "Never do" examples prominent
- Safe alternatives for every risky operation

---

## Checklist: Before Publishing

- [ ] SKILL.md has frontmatter (name, description, allowed-tools)
- [ ] SKILL.md has Quick Start section at top
- [ ] All `{{placeholders}}` replaced with real content
- [ ] No project-specific references (generic examples)
- [ ] CHANGELOG.md has v1.0.0 with "Lesson Learned"
- [ ] README.md has installation instructions
- [ ] package.json has `claude-plugin` section
- [ ] LICENSE file exists (MIT)
- [ ] Setup script provides actionable feedback
- [ ] Topics include `claude`, `claude-code`, `claude-plugin`

---

*Curated from Linear, Governance, and Varlock skills — December 2025*
