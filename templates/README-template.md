# {{SKILL_TITLE}} Skill for Claude Code

A [Claude Code](https://claude.ai/code) skill for {{DESCRIPTION_LOWERCASE}}.

## Features

- **{{FEATURE_1}}** — {{FEATURE_1_DESC}}
- **{{FEATURE_2}}** — {{FEATURE_2_DESC}}
- **{{FEATURE_3}}** — {{FEATURE_3_DESC}}

## Quick Start

### Option A: One-liner (Recommended)

```bash
mkdir -p ~/.claude/skills/{{SKILL_NAME}} && curl -sSL https://raw.githubusercontent.com/{{AUTHOR}}/{{SKILL_NAME}}-claude-skill/main/skills/{{SKILL_NAME}}/SKILL.md -o ~/.claude/skills/{{SKILL_NAME}}/SKILL.md
```

### Option B: Manual Installation

```bash
git clone https://github.com/{{AUTHOR}}/{{SKILL_NAME}}-claude-skill /tmp/{{SKILL_NAME}}-skill
cp -r /tmp/{{SKILL_NAME}}-skill/skills/{{SKILL_NAME}} ~/.claude/skills/
rm -rf /tmp/{{SKILL_NAME}}-skill
```

### Verify Setup

```bash
node scripts/setup.mjs
```

## How It Works

When Claude detects trigger phrases like {{TRIGGER_PHRASES}}, this skill activates and provides:

1. {{PROVIDES_1}}
2. {{PROVIDES_2}}
3. {{PROVIDES_3}}

## Usage Examples

### Example 1: {{EXAMPLE_1_TITLE}}

```bash
{{EXAMPLE_1_CODE}}
```

### Example 2: {{EXAMPLE_2_TITLE}}

```bash
{{EXAMPLE_2_CODE}}
```

## Configuration

{{CONFIGURATION_INSTRUCTIONS}}

## Directory Structure

```
{{SKILL_NAME}}-claude-skill/
├── LICENSE
├── README.md
├── CHANGELOG.md
├── package.json
├── skills/{{SKILL_NAME}}/
│   ├── SKILL.md
│   └── scripts/
│       └── setup.mjs
└── templates/           # Optional
    └── ...
```

## Contributing

Contributions welcome! Please submit issues and PRs.

## License

MIT License — See [LICENSE](LICENSE)

## Credits

Created for the Claude Code community.
