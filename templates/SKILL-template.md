---
name: {{SKILL_NAME}}
description: {{DESCRIPTION}}. Trigger phrases include {{TRIGGER_PHRASES}}.
allowed-tools:
  - Bash
  - Read
  - Write
---

# {{SKILL_TITLE}}

{{DESCRIPTION}}.

> **Documentation**: [docs/](../../docs/)
> **Scripts**: [scripts/](scripts/)

---

## Quick Start (First-Time Users)

### 1. Verify Setup

```bash
# Run setup check
node scripts/setup.mjs
```

### 2. Common Operations

```bash
# Example command 1
npm run {{SKILL_NAME}}:check

# Example command 2
npm run {{SKILL_NAME}}:run
```

### 3. Getting Help

```bash
# Show all available commands
npm run {{SKILL_NAME}}:help
```

---

## When This Skill Activates

### Trigger 1: {{TRIGGER_1_NAME}}

When user mentions {{TRIGGER_1_PHRASE}}:

1. Check for {{CONDITION_1}}
2. Verify {{CONDITION_2}}
3. Provide {{OUTPUT}}

### Trigger 2: {{TRIGGER_2_NAME}}

When user mentions {{TRIGGER_2_PHRASE}}:

1. Check for {{CONDITION_1}}
2. Provide {{OUTPUT}}

---

## Core Patterns

### Pattern 1: {{PATTERN_1_NAME}}

| Element | Convention | Example |
|---------|------------|---------|
| {{ELEMENT_1}} | {{CONVENTION_1}} | `{{EXAMPLE_1}}` |
| {{ELEMENT_2}} | {{CONVENTION_2}} | `{{EXAMPLE_2}}` |

### Pattern 2: {{PATTERN_2_NAME}}

```bash
# Example code
{{CODE_EXAMPLE}}
```

---

## Anti-Patterns vs Correct Patterns

### {{CATEGORY_1}}

| Anti-Pattern | Correct Pattern | Why |
|--------------|-----------------|-----|
| ❌ {{BAD_1}} | ✅ {{GOOD_1}} | {{REASON_1}} |
| ❌ {{BAD_2}} | ✅ {{GOOD_2}} | {{REASON_2}} |

---

## Configuration

### Required Setup

1. {{SETUP_STEP_1}}
2. {{SETUP_STEP_2}}

### Optional Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `{{SETTING_1}}` | `{{DEFAULT_1}}` | {{DESC_1}} |
| `{{SETTING_2}}` | `{{DEFAULT_2}}` | {{DESC_2}} |

---

## Troubleshooting

### "{{ERROR_1}}"

```bash
# Fix
{{FIX_1}}
```

### "{{ERROR_2}}"

```bash
# Fix
{{FIX_2}}
```

---

## Related Documents

- [README](../../README.md) — Installation guide
- [CHANGELOG](../../CHANGELOG.md) — Version history

---

*Last updated: {{DATE}}*
*{{SHORT_TAGLINE}}*
