#!/usr/bin/env npx tsx
/**
 * Generate Subagent Script
 *
 * Generates companion specialist agents for skills, enabling 37-97% token savings
 * through context isolation.
 *
 * Usage:
 *   npx tsx generate-subagent.ts <skill-path> [options]
 *
 * Options:
 *   --output, -o <path>   Output directory (default: ~/.claude/agents)
 *   --tools <tools>       Override tools (comma-separated)
 *   --model <model>       Model to use (default: sonnet)
 *   --skip-claude-md      Skip CLAUDE.md snippet generation
 *   --dry-run             Preview without creating files
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { homedir } from 'os'

interface SkillMetadata {
  name: string
  description: string
  triggers: string[]
  version?: string
}

interface ToolAnalysis {
  requiredTools: string[]
  reason: string
}

interface GenerationResult {
  subagentPath: string
  claudeMdSnippet: string
  metadata: SkillMetadata
  tools: string[]
}

/**
 * Parse YAML frontmatter from SKILL.md content
 */
function parseSkillMetadata(content: string): SkillMetadata {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) {
    throw new Error('No YAML frontmatter found in SKILL.md')
  }

  const frontmatter = frontmatterMatch[1]
  const lines = frontmatter.split('\n')

  let name = ''
  let description = ''
  const triggers: string[] = []

  for (const line of lines) {
    const nameMatch = line.match(/^name:\s*(.+)$/)
    if (nameMatch) {
      name = nameMatch[1].trim()
    }

    const descMatch = line.match(/^description:\s*(.+)$/)
    if (descMatch) {
      description = descMatch[1].trim()
      // Extract trigger phrases from description
      const triggerMatch = description.match(/when.*?"([^"]+)"/g)
      if (triggerMatch) {
        for (const t of triggerMatch) {
          const phrase = t.match(/"([^"]+)"/)
          if (phrase) triggers.push(phrase[1])
        }
      }
    }

    const versionMatch = line.match(/^version:\s*(.+)$/)
    if (versionMatch) {
      // Version captured but not used in current implementation
    }
  }

  if (!name) {
    throw new Error('No name found in SKILL.md frontmatter')
  }

  return { name, description, triggers }
}

/**
 * Analyze skill content to determine required tools
 */
function analyzeToolRequirements(content: string): ToolAnalysis {
  const tools = new Set<string>()
  const contentLower = content.toLowerCase()

  // Always include Read
  tools.add('Read')

  // Detect file write operations
  if (
    contentLower.includes('write') ||
    contentLower.includes('create file') ||
    contentLower.includes('edit') ||
    contentLower.includes('modify')
  ) {
    tools.add('Write')
    tools.add('Edit')
  }

  // Detect command execution
  if (
    contentLower.includes('bash') ||
    contentLower.includes('npm') ||
    contentLower.includes('command') ||
    contentLower.includes('terminal') ||
    contentLower.includes('shell') ||
    contentLower.includes('run ')
  ) {
    tools.add('Bash')
  }

  // Detect search operations
  if (
    contentLower.includes('search') ||
    contentLower.includes('find') ||
    contentLower.includes('grep') ||
    contentLower.includes('glob')
  ) {
    tools.add('Grep')
    tools.add('Glob')
  }

  // Detect web operations
  if (
    contentLower.includes('web') ||
    contentLower.includes('fetch') ||
    contentLower.includes('url') ||
    contentLower.includes('http')
  ) {
    tools.add('WebFetch')
  }

  return {
    requiredTools: Array.from(tools),
    reason: 'Minimal tool set based on skill content analysis',
  }
}

/**
 * Generate subagent content from template
 */
function generateSubagentContent(
  metadata: SkillMetadata,
  tools: string[],
  templatePath: string
): string {
  const template = readFileSync(templatePath, 'utf-8')

  const triggersStr =
    metadata.triggers.length > 0
      ? metadata.triggers.map((t) => `"${t}"`).join(', ')
      : 'delegated tasks for this skill'

  return template
    .replace(/\{\{name\}\}/g, metadata.name)
    .replace(/\{\{description\}\}/g, metadata.description)
    .replace(/\{\{triggers\}\}/g, triggersStr)
    .replace(/\{\{tools\}\}/g, tools.join(', '))
}

/**
 * Generate CLAUDE.md integration snippet
 */
function generateClaudeMdSnippet(metadata: SkillMetadata): string {
  const triggersStr =
    metadata.triggers.length > 0 ? metadata.triggers.join('", "') : 'skill-specific tasks'

  return `### ${metadata.name} Subagent Delegation

When tasks match ${metadata.name} triggers, delegate to the \`${metadata.name}-specialist\` subagent for context isolation and token savings.

**Triggers:** "${triggersStr}"

**Delegation Pattern:**
\`\`\`
Task({
  description: "[task description]",
  prompt: "[detailed instructions]",
  subagent_type: "${metadata.name}-specialist"
})
\`\`\`
`
}

/**
 * Main generation function
 */
export function generateSubagent(
  skillPath: string,
  options: {
    output?: string
    tools?: string
    model?: string
    skipClaudeMd?: boolean
    dryRun?: boolean
  } = {}
): GenerationResult {
  // Resolve skill path
  const resolvedPath = resolve(skillPath)
  const skillMdPath = existsSync(join(resolvedPath, 'SKILL.md'))
    ? join(resolvedPath, 'SKILL.md')
    : resolvedPath

  if (!existsSync(skillMdPath)) {
    throw new Error(`SKILL.md not found at ${skillMdPath}`)
  }

  // Read and parse skill
  const content = readFileSync(skillMdPath, 'utf-8')
  const metadata = parseSkillMetadata(content)

  // Determine tools
  let tools: string[]
  if (options.tools) {
    tools = options.tools.split(',').map((t) => t.trim())
  } else {
    const analysis = analyzeToolRequirements(content)
    tools = analysis.requiredTools
  }

  // Get template path
  const templatePath = join(
    homedir(),
    '.claude',
    'skills',
    'skill-builder',
    'templates',
    'subagent-template.md'
  )

  if (!existsSync(templatePath)) {
    throw new Error(`Subagent template not found at ${templatePath}`)
  }

  // Generate subagent content
  const subagentContent = generateSubagentContent(metadata, tools, templatePath)

  // Determine output path
  const outputDir = options.output
    ? resolve(options.output)
    : join(homedir(), '.claude', 'agents')

  const subagentPath = join(outputDir, `${metadata.name}-specialist.md`)

  // Generate CLAUDE.md snippet
  const claudeMdSnippet = generateClaudeMdSnippet(metadata)

  if (!options.dryRun) {
    // Create output directory if needed
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // Write subagent file
    writeFileSync(subagentPath, subagentContent, 'utf-8')

    console.log(`✅ Generated subagent: ${subagentPath}`)

    if (!options.skipClaudeMd) {
      console.log('\n📋 Add to your CLAUDE.md:\n')
      console.log(claudeMdSnippet)
    }
  } else {
    console.log('🔍 Dry run - no files created\n')
    console.log('Would create:', subagentPath)
    console.log('\nSubagent content:\n')
    console.log(subagentContent)
    console.log('\nCLAUDE.md snippet:\n')
    console.log(claudeMdSnippet)
  }

  return {
    subagentPath,
    claudeMdSnippet,
    metadata,
    tools,
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: npx tsx generate-subagent.ts <skill-path> [options]

Options:
  --output, -o <path>   Output directory (default: ~/.claude/agents)
  --tools <tools>       Override tools (comma-separated)
  --model <model>       Model to use (default: sonnet)
  --skip-claude-md      Skip CLAUDE.md snippet generation
  --dry-run             Preview without creating files
  --help, -h            Show this help
`)
    process.exit(0)
  }

  const skillPath = args[0]
  const options: Record<string, string | boolean> = {}

  for (let i = 1; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--output' || arg === '-o') {
      options['output'] = args[++i]
    } else if (arg === '--tools') {
      options['tools'] = args[++i]
    } else if (arg === '--model') {
      options['model'] = args[++i]
    } else if (arg === '--skip-claude-md') {
      options['skipClaudeMd'] = true
    } else if (arg === '--dry-run') {
      options['dryRun'] = true
    }
  }

  try {
    generateSubagent(skillPath, options)
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

export { parseSkillMetadata, analyzeToolRequirements, generateSubagentContent, generateClaudeMdSnippet }
