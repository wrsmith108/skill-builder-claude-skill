# Skill Builder for Claude Code

A meta-skill for creating Claude Code skills following proven patterns.

## Features

- **Template-First Workflow** — Ready-to-use templates with placeholders
- **GitHub Automation** — Create repos with proper topics automatically
- **Curated Best Practices** — Patterns from mature skills (Linear, Governance)
- **Setup Verification** — Scripts that provide actionable feedback

## Quick Start

### Option A: Claude Plugin (Recommended)

```bash
claude plugin add github:wrsmith108/skill-builder-claude-skill
```

### Option B: Manual Installation

```bash
git clone https://github.com/wrsmith108/skill-builder-claude-skill ~/.claude/skills/skill-builder
```

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

node scripts/create-repo.mjs \
  --name "my-skill-claude-skill" \
  --description "Claude Code skill for my purpose" \
  --topics "claude,claude-code,claude-plugin,my-domain"
```

## Templates Included

| Template | Purpose |
|----------|---------|
| `SKILL-template.md` | Core skill definition |
| `CHANGELOG-template.md` | Version history with "Lesson Learned" |
| `README-template.md` | User documentation |
| `package-template.json` | Plugin metadata |
| `LICENSE-template` | MIT license |

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
├── skills/skill-builder/
│   ├── SKILL.md
│   └── scripts/
│       └── create-repo.mjs
└── templates/
    ├── SKILL-template.md
    ├── CHANGELOG-template.md
    ├── README-template.md
    ├── package-template.json
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
