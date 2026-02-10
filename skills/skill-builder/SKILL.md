---
name: skill-builder
description: Create new Claude Code skills with best practices. Use when user wants to create, extract, or build a new skill. Provides templates and GitHub automation. Trigger phrases include "create a skill", "build a skill", "extract a skill", "new skill", "/skill-builder".
allowed-tools:
  - Bash
  - Read
  - Write
  - Glob
  - Grep
---

# Skill Builder

Create Claude Code skills following proven patterns from mature skills (Linear, Governance).

> **Templates**: [templates/](../../templates/)
> **Best Practices**: [BEST-PRACTICES.md](../../BEST-PRACTICES.md)
> **GitHub Automation**: [scripts/create-repo.mjs](scripts/create-repo.mjs)

---

## Quick Start

When user asks to create a skill:

### 1. Gather Basic Info

Ask the user:
- **Skill name**: Short, descriptive (e.g., "governance", "linear", "docker")
- **Description**: One sentence explaining when to use it
- **Trigger phrases**: What should activate this skill?
- **Problem it solves**: What does the user gain?

### 2. Provide Templates

Copy and customize these templates:

```bash
# Copy all templates to working directory
cp -r templates/* /path/to/new-skill/
```

### 3. Customize Files

Guide user through customizing:
1. `skills/<name>/SKILL.md` — Core skill definition
2. `CHANGELOG.md` — Version history
3. `README.md` — Installation and usage
4. `package.json` — Plugin metadata and topics

### 4. Publish to GitHub

Run the automation script:

```bash
node scripts/create-repo.mjs \
  --name "<skill-name>-claude-skill" \
  --description "Claude Code skill for <purpose>" \
  --topics "claude,claude-code,claude-plugin,<domain-topics>"
```

---

## Template-First Workflow

### Step 1: Create Directory Structure

```bash
mkdir -p <skill-name>-claude-skill/skills/<skill-name>/scripts
mkdir -p <skill-name>-claude-skill/templates  # Optional
```

### Step 2: Copy Core Templates

| Template | Purpose | Customize |
|----------|---------|-----------|
| `SKILL-template.md` | Core skill definition | Name, description, triggers, content |
| `CHANGELOG-template.md` | Version history | Add initial features, lessons learned |
| `README-template.md` | User documentation | Installation, usage, examples |
| `package-template.json` | Plugin metadata | Name, topics, scripts |

### Step 3: Fill In Placeholders

All templates use these placeholders:

| Placeholder | Replace With | Example |
|-------------|--------------|---------|
| `{{SKILL_NAME}}` | Skill name (lowercase) | `governance` |
| `{{SKILL_TITLE}}` | Skill title (Title Case) | `Governance` |
| `{{DESCRIPTION}}` | One-sentence description | `Engineering standards enforcement` |
| `{{TRIGGER_PHRASES}}` | Comma-separated triggers | `"code review", "commit", "standards"` |
| `{{TOPICS}}` | GitHub topics | `governance,code-quality,standards` |
| `{{AUTHOR}}` | GitHub username | `wrsmith108` |
| `{{DATE}}` | Today's date | `2025-12-27` |

---

## Curated Best Practices

### From Linear Skill (Most Mature)

| Pattern | Why It Works |
|---------|--------------|
| **CHANGELOG with "Lesson Learned"** | Captures *why* changes were made, not just *what* |
| **Quick Start at top** | Gets new users productive immediately |
| **`allowed-tools` frontmatter** | Explicit tool dependencies |
| **MCP Reliability Matrix** | Shows which tools work reliably |
| **Anti-pattern tables** | Shows what NOT to do alongside correct patterns |
| **Setup verification script** | Immediate feedback on configuration |
| **Helper scripts** | Encapsulate complex operations |

### From Governance Skill

| Pattern | Why It Works |
|---------|--------------|
| **Two-document model** | Separates operational (CLAUDE.md) from policy (standards.md) |
| **Pre-commit/PR checklists** | Actionable reminders at key moments |
| **Section references (§1.3)** | Precise cross-referencing |
| **Compliance audit script** | Automated enforcement |

### Universal Patterns

| Pattern | Implementation |
|---------|---------------|
| **Explicit triggers** | List all phrases in description frontmatter |
| **No project-specific references** | Use generic examples, placeholders |
| **Templates over hardcoding** | Configurable via CONFIG object or placeholders |
| **Version with semver** | CHANGELOG follows Keep a Changelog format |
| **MIT license** | Standard for Claude Code skills |

---

## SKILL.md Structure

Every SKILL.md should have:

```markdown
---
name: <skill-name>
description: <when to use, trigger phrases>
allowed-tools:
  - <tool1>
  - <tool2>
---

# <Skill Title>

One-line description.

> **Key Reference**: [link](path)

---

## Quick Start (First-Time Users)

1. Verify setup
2. Common operations
3. Getting help

---

## When This Skill Activates

### Trigger 1
What happens, what to check

### Trigger 2
What happens, what to check

---

## Core Patterns

Tables, examples, code blocks

---

## Anti-Patterns vs Correct Patterns

| Anti-Pattern | Correct Pattern | Why |
|--------------|-----------------|-----|
| ❌ Bad thing | ✅ Good thing | Reason |

---

## [Domain-Specific Sections]

...

---

## Related Documents

- [Link 1](path)
- [Link 2](path)

---

*Last updated: <date>*
```

---

## package.json Structure

```json
{
  "name": "claude-plugin-<skill-name>",
  "version": "1.0.0",
  "description": "<One sentence>",
  "keywords": [
    "claude",
    "claude-code",
    "claude-plugin",
    "<domain-specific>",
    "<domain-specific>"
  ],
  "author": "<github-username>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/<user>/<skill-name>-claude-skill.git"
  },
  "files": ["skills", "templates", "README.md", "LICENSE"],
  "scripts": {
    "setup": "node skills/<name>/scripts/setup.mjs",
    "check": "node skills/<name>/scripts/check.mjs"
  },
  "claude-plugin": {
    "name": "<Skill Title>",
    "description": "<Description for plugin registry>",
    "skills": ["skills/<name>"]
  }
}
```

---

## GitHub Topics for Discoverability

### Required Topics (all skills)
- `claude`
- `claude-code`
- `claude-plugin`

### Domain Topics (choose relevant)
- `governance`, `code-quality`, `standards`
- `project-management`, `issue-tracking`
- `testing`, `automation`
- `security`, `authentication`
- `database`, `api`
- `documentation`, `developer-tools`

---

## Publishing Checklist

Before publishing:

- [ ] SKILL.md has frontmatter (name, description, allowed-tools)
- [ ] SKILL.md has Quick Start section
- [ ] All placeholders replaced (no `{{...}}` remaining)
- [ ] No project-specific references (generic examples only)
- [ ] CHANGELOG.md has initial release with "Lesson Learned"
- [ ] README.md has installation instructions
- [ ] package.json has `claude-plugin` section
- [ ] LICENSE file exists (MIT)
- [ ] Topics include `claude`, `claude-code`, `claude-plugin`

---

## Example: Creating a "Docker" Skill

```bash
# 1. Create structure
mkdir -p docker-claude-skill/skills/docker/scripts

# 2. Copy templates
cp templates/* docker-claude-skill/

# 3. Customize (example)
# - Replace {{SKILL_NAME}} with "docker"
# - Replace {{SKILL_TITLE}} with "Docker"
# - Add docker-specific patterns to SKILL.md

# 4. Publish
node scripts/create-repo.mjs \
  --name "docker-claude-skill" \
  --description "Claude Code skill for Docker container development" \
  --topics "claude,claude-code,claude-plugin,docker,containers,devops"
```

---

## Related Skills

- **Linear Skill** — Example of MCP integration, SDK automation
- **Governance Skill** — Example of documentation patterns, audit scripts
- **Varlock Skill** — Example of security-focused skill

---

*Last updated: December 2025*
*Meta-skill for building Claude Code skills*
