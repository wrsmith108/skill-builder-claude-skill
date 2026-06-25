# Skill Builder for Claude Code

A meta-skill for creating Claude Code skills following proven patterns.

## Features

- **Template-First Workflow** — Ready-to-use templates with placeholders
- **GitHub Automation** — Create repos with proper topics automatically
- **Curated Best Practices** — Patterns from mature skills (Linear, Governance)
- **Setup Verification** — Scripts that provide actionable feedback

## Quick Start

### Option A: Plugin marketplace (Recommended)

This repo is a Claude Code plugin marketplace. Add it, then install the plugin — this
installs the **whole** plugin (both skills, their scripts, and templates):

```bash
claude plugin marketplace add wrsmith108/skill-builder-claude-skill
claude plugin install skill-builder@wrsmith108-skills
```

> The same two steps work in-session as the `/plugin marketplace add` and `/plugin install`
> slash commands.

### Option B: Manual clone (offline / no-marketplace fallback)

Copies the full plugin (both skills + scripts) into your skills directory:

```bash
git clone https://github.com/wrsmith108/skill-builder-claude-skill /tmp/skill-builder-skill
cp -r /tmp/skill-builder-skill/skills/skill-builder ~/.claude/skills/
cp -r /tmp/skill-builder-skill/skills/skill-reviewer ~/.claude/skills/
rm -rf /tmp/skill-builder-skill
```

### Option C: Single-file curl (skill-builder only)

> ⚠️ This fetches **only** `SKILL.md` — it does **not** install scripts, templates, or the
> `skill-reviewer` skill. Use it only if you want the create-skill instructions and nothing else.

```bash
mkdir -p ~/.claude/skills/skill-builder && curl -sSL https://raw.githubusercontent.com/wrsmith108/skill-builder-claude-skill/main/skills/skill-builder/SKILL.md -o ~/.claude/skills/skill-builder/SKILL.md
```

### Upgrading from an older (pre-1.4.0) install

Earlier versions placed a single (and, on git-clone, broken) skill at
`~/.claude/skills/skill-builder/`. Remove that stale copy before reinstalling so it does not
shadow the plugin:

```bash
rm -rf ~/.claude/skills/skill-builder
```

## Which skill does what?

This plugin ships **two** skills — pick by intent:

| Skill | Use when you want to… | Trigger phrases |
|-------|-----------------------|-----------------|
| `skill-builder` | **Create a NEW** skill from scratch | "create a skill", "build a skill", "extract a skill", `/skill-builder` |
| `skill-reviewer` | **Review / validate / generalize / publish an EXISTING** skill | "review my skill", "validate skill", "generalize skill", "publish a skill", `/validate-skill` |

## How It Works

When you say "create a skill", "build a skill", or "/skill-builder", Claude:

1. Provides ready-to-use templates
2. Guides you through customization
3. Automates GitHub repository creation
4. Ensures discoverability with proper topics

## Creating a New Skill

### 1. Create Directory Structure

```bash
mkdir -p my-skill-claude-skill/skills/my-skill/scripts
```

### 2. Copy Templates

```bash
cp -r templates/* my-skill-claude-skill/
```

### 3. Customize Files

Replace placeholders like `{{SKILL_NAME}}`, `{{DESCRIPTION}}`, etc.

### 4. Publish to GitHub

```bash
cd my-skill-claude-skill
git init && git add -A && git commit -m "Initial release"

node skills/skill-builder/scripts/create-repo.mjs \
  --name "my-skill-claude-skill" \
  --description "Claude Code skill for my purpose" \
  --topics "claude,claude-code,claude-plugin,my-domain"
```

## Templates Included

| Template | Copy to | Purpose |
|----------|---------|---------|
| `SKILL-template.md` | `skills/<name>/SKILL.md` | Core skill definition |
| `CHANGELOG-template.md` | `CHANGELOG.md` | Version history with "Lesson Learned" |
| `README-template.md` | `README.md` | User documentation |
| `package-template.json` | `package.json` | npm metadata |
| `plugin-template.json` | `.claude-plugin/plugin.json` | Plugin manifest (source of truth) |
| `marketplace-template.json` | `.claude-plugin/marketplace.json` | Marketplace manifest (enables install) |
| `setup-template.mjs` | `skills/<name>/scripts/setup.mjs` | Optional setup-verification script |
| `LICENSE-template` | `LICENSE` | MIT license |

## Best Practices Enforced

This skill enforces patterns from mature Claude Code skills:

### From Linear Skill
- CHANGELOG with "Lesson Learned" sections
- Quick Start at top of SKILL.md
- `allowed-tools` frontmatter
- Setup verification scripts

### From Governance Skill
- Anti-pattern tables
- Pre-commit/PR checklists
- Section cross-references (§1.3)
- Two-document model

See [BEST-PRACTICES.md](BEST-PRACTICES.md) for complete guidance.

## Directory Structure

```
skill-builder-claude-skill/
├── LICENSE
├── README.md
├── CHANGELOG.md
├── BEST-PRACTICES.md
├── package.json
├── .claude-plugin/
│   ├── plugin.json         # Plugin manifest (source of truth)
│   └── marketplace.json    # Marketplace manifest
├── skills/
│   ├── skill-builder/      # Create NEW skills
│   │   ├── SKILL.md
│   │   └── scripts/create-repo.mjs
│   └── skill-reviewer/     # Review / validate / publish EXISTING skills
│       ├── SKILL.md
│       ├── scripts/        # validate-skill.ts, generate-subagent.ts
│       └── references/
└── templates/
    ├── SKILL-template.md
    ├── CHANGELOG-template.md
    ├── README-template.md
    ├── package-template.json
    ├── plugin-template.json
    ├── marketplace-template.json
    └── LICENSE-template
```

## Publishing Checklist

Before publishing your new skill:

- [ ] SKILL.md has frontmatter (name, description, allowed-tools)
- [ ] SKILL.md has Quick Start section
- [ ] All placeholders replaced
- [ ] No project-specific references
- [ ] CHANGELOG.md has v1.0.0 with "Lesson Learned"
- [ ] Topics include `claude`, `claude-code`, `claude-plugin`

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full history. Highlights:

### 1.4.0

- **Added**: `.claude-plugin/marketplace.json` so the repo installs as a plugin marketplace (`claude plugin install skill-builder@wrsmith108-skills`) — fixes the "not found in any configured marketplace" install error
- **Added**: `skill-reviewer` skill (review / validate / generalize / publish existing skills), recovered from the former top-level `SKILL.md` and now a proper nested skill alongside `skill-builder`
- **Fixed**: scaffolder (`create-repo.mjs`) and templates no longer emit a broken install command or a space-containing plugin name

### 1.0.1 (2026-02-10)

- **Fixed**: Replaced hardcoded `~/.claude/skills/` paths with relative paths for portability
- **Fixed**: Corrected `create-repo.mjs` path to use `skills/skill-builder/scripts/` nested structure

## Contributing

Contributions welcome! Please submit issues and PRs for:
- New templates
- Additional best practices
- Improved automation

## License

MIT License — See [LICENSE](LICENSE)

## Credits

Patterns extracted from:
- [Linear Skill](https://github.com/wrsmith108/linear-claude-skill)
- [Governance Skill](https://github.com/wrsmith108/governance-claude-skill)
