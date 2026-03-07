# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-03-07

### Added

- **README.md and CHANGELOG.md are now Required** — updated Structure Validation (Section 1) to list both as required files (not optional), with inline notes on what each must contain
- **Step 6: Publish** — new mandatory publishing step added to Skill Update Workflow: README presence check, CHANGELOG entry check, `git push`, `gh release create`, git tag; includes required README section list and CHANGELOG format template

### Source

`gcloud` skill creation session — skill was built without README/CHANGELOG/release until added manually after the fact; enforced going forward.

---

## [1.2.0] - 2026-03-01

### Added

- **Versioning & Release section** — skill pack version drift audit, frontmatter completeness check, monorepo tag convention (`<skill-name>/v<version>`)
- **Step 5.5 in Skill Update Workflow** — semver bump rules table, version bump command, CHANGELOG entry requirement; Step 0 to record current version before editing
- **Bulk Find & Replace section** — case-insensitive grep requirement before bulk renames, Edit tool angle bracket gotcha (`<` → `&lt;`), post-rename verification pattern

### Source

Retrospective learnings from `product-builder-starter` v1.0.0 release (SMI-2903, SMI-2906).

---

## [1.1.0] - 2026-01-?? (undocumented)

> Note: frontmatter was bumped to 1.1.0 at an unknown date. Changes include generalization enforcement, subagent pair generation, enforcement hooks pattern, and execution context requirements (SMI-2613).

---

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
