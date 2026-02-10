# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-02-10

### Fixed
- Replaced hardcoded `~/.claude/skills/` paths with relative paths for portability
- Corrected `create-repo.mjs` references to use `skills/skill-builder/scripts/` nested structure

## [1.0.0] - 2025-12-27

### Added
- **Initial Release** — Meta-skill for building Claude Code skills
- **SKILL.md** — Template-first workflow with curated best practices
- **Templates** — Ready-to-use files with placeholders:
  - `SKILL-template.md` — Core skill definition
  - `CHANGELOG-template.md` — Version history
  - `README-template.md` — User documentation
  - `package-template.json` — Plugin metadata
  - `LICENSE-template` — MIT license
- **GitHub Automation** — `create-repo.mjs` script for publishing
- **Best Practices Guide** — Curated patterns from Linear and Governance skills
- **Trigger Phrases** — "create a skill", "build a skill", "/skill-builder"

### Documentation
- BEST-PRACTICES.md with 10 sections of curated patterns
- Publishing checklist
- Cross-references to reference skills

### Lesson Learned
Creating skills without a template leads to inconsistent quality and missing essential elements (CHANGELOG, Quick Start, setup scripts). A meta-skill that provides templates ensures every new skill follows proven patterns from day one.

---

## Future Improvements (Planned)

### [1.1.0] - TBD
- [ ] Interactive wizard mode (step-by-step questions)
- [ ] Skill scaffolding CLI command
- [ ] Automatic placeholder detection and validation
- [ ] Integration with Claude Code plugin registry
