# Orchestrator Delegation Patterns

Reference guide for implementing delegation rules in CLAUDE.md to manage context efficiently.

---

## Overview

### Purpose of Delegation Patterns

Orchestrator delegation patterns enable Claude to act as a coordinator that dispatches work to specialized subagents rather than executing verbose operations directly. This approach:

- **Preserves main context** - Keeps orchestrator token usage under control
- **Enables parallel execution** - Multiple subagents can work simultaneously
- **Improves response quality** - Subagents return synthesized summaries, not raw output
- **Scales to complex workflows** - Chains of delegation handle multi-step processes

### When to Add Delegation Rules

Add delegation rules to CLAUDE.md when:

1. **High-volume output operations** - Document processing, test execution, log analysis
2. **Repeatable specialized workflows** - Code review, security audits, research tasks
3. **Context-sensitive operations** - Tasks that require loading large files or datasets
4. **Multi-step processes** - Workflows requiring sequential operations with intermediate state

**Rule of thumb**: If an operation typically produces >500 tokens of output or requires loading >1000 lines of context, delegate it.

---

## CLAUDE.md Template

Copy this template into your project's CLAUDE.md to enable orchestrator delegation:

\`\`\`markdown
## Skill Delegation Rules

When acting as orchestrator, delegate specialized tasks to subagents rather than executing verbose operations in main context.

### Delegation Table

| Task Pattern | Delegate To | Return Budget |
|--------------|-------------|---------------|
| Code review for PR/file | \`code-review\` skill | 300-500 tokens |
| Run test suite | \`testing\` subagent | 300-500 tokens |
| Process PDF/document | \`doc-processing\` skill | 400-600 tokens |
| Research topic | \`researcher\` subagent | 500-800 tokens |
| Analyze dependencies | \`analyzer\` subagent | 300-500 tokens |
| Generate documentation | \`documenter\` subagent | 400-600 tokens |

### Delegation Protocol

1. **Identify** - Recognize task matches delegation pattern
2. **Delegate** - Spawn subagent with clear instructions and return budget
3. **Await** - Let subagent complete without intervention
4. **Synthesize** - Incorporate subagent summary into orchestrator response

### Context Management Rule

**CRITICAL**: Do NOT execute verbose skills (document processing, test suites, large file analysis) directly in main orchestrator context. Always delegate to subagent with explicit return token budget.
\`\`\`

---

## Token Budget Planning

### Budget Allocation by Task Complexity

| Domain | Max Return Tokens | Rationale |
|--------|------------------|-----------|
| Quick lookup | 100-200 | Single fact or status check |
| File operation | 200-300 | Confirmation + brief details |
| Code review | 300-500 | Issue list with context |
| Document analysis | 400-600 | Structured findings summary |
| Test execution | 300-500 | Results summary + failures |
| Research | 500-800 | Multi-source synthesis |

### Orchestrator Reserve Calculations

**Practical Rule**: Keep orchestrator context <30K tokens, reserve 50% of remaining budget for subagent responses and synthesis.

---

## Best Practices

### DOs

1. **Delegate verbose operations** - Document processing, test suites, log analysis, multi-file code reviews
2. **Set clear return budgets** - Always specify maximum token count in subagent instructions
3. **Use parallel subagents** - Spawn multiple subagents in single message when tasks are independent
4. **Provide explicit return formats** - Request structured output (lists, tables, summaries)

### DON'Ts

1. **Execute document processing in main context** - Always delegate to subagents
2. **Exceed context budget** - Don't spawn unlimited subagents or accept unlimited return sizes
3. **Nest delegations deeply** - Maximum 2 levels of delegation
4. **Forget error handling** - Subagents can fail or timeout

---

## Quick Reference Card

\`\`\`
DELEGATION DECISION TREE
========================
Is output likely > 500 tokens?
  YES -> Delegate
  NO  -> Is file > 200 lines?
          YES -> Delegate
          NO  -> Execute directly

BUDGET QUICK CALC
=================
Safe orchestrator limit: 30K tokens
Per-subagent budget: 500-800 tokens typical
Parallel limit: 5-8 subagents per batch
\`\`\`

---

*Last updated: January 2026*
*Reference: Phase 10 - Parallel Agent Execution Patterns*
