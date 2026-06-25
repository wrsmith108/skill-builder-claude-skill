# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-06-24

### Added

- **Plugin marketplace** — `.claude-plugin/marketplace.json` makes this repo an installable marketplace. `claude plugin marketplace add wrsmith108/skill-builder-claude-skill` + `claude plugin install skill-builder@wrsmith108-skills` now works, resolving the *"not found in any configured marketplace"* error (#1).
- **`skill-reviewer` skill** — the former top-level `SKILL.md` (review / validate / generalize / publish existing skills) is recovered as a proper nested skill at `skills/skill-reviewer/`, with its `scripts/` (`validate-skill.ts`, `generate-subagent.ts`) and `references/` relocated alongside it. The plugin now ships two skills: `skill-builder` (create) and `skill-reviewer` (review).
- **Scaffolder marketplace support** — `create-repo.mjs` now scaffolds `.claude-plugin/plugin.json` + `marketplace.json` into new repos and prints the working two-step install. New `plugin-template.json` and `marketplace-template.json` templates added.

### Fixed

- **Install command** — `create-repo.mjs` and `README-template.md` no longer emit the non-resolving `claude plugin install github:<repo>` form (#1).
- **Plugin name with space** — `package-template.json` set the plugin name from `{{SKILL_TITLE}}` (a spaced human title), re-introducing the invocation bug from #2 in every scaffolded skill; it now uses kebab-case `{{SKILL_NAME}}` (#2).
- **Manifest drift** — `.claude-plugin/plugin.json` is now the single source of truth; the duplicate `claude-plugin` block was removed from `package.json`. Versions reconciled to `1.4.0` across `plugin.json`, `package.json`, and the `skill-reviewer` frontmatter.
- **Dangling references** — removed references to the non-existent `scripts/check-generalization.ts` (its checks live inside `validate-skill.ts`) and `references/linear-retro.md`; resolved the missing `setup.mjs` template reference.

### Lesson Learned

A repo can be a valid Claude Code *plugin* yet still be uninstallable: `claude plugin install` resolves plugins from a *marketplace*, so without a `.claude-plugin/marketplace.json` the install fails regardless of how correct `plugin.json` is. And "delete the conflicting file" is not the same as "remove the conflict" — the top-level `SKILL.md` was a whole second skill; preserving it as a nested skill fixes discovery without dropping a feature.

---

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
