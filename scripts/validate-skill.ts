#!/usr/bin/env npx tsx
/**
 * Skill Validation Script
 *
 * Validates skill structure, content, and generalization.
 * Run before committing skill changes.
 *
 * Usage:
 *   npx tsx validate-skill.ts <skill-path>
 *   npx tsx validate-skill.ts path/to/skill
 */

import * as fs from 'fs'
import * as path from 'path'

interface ValidationResult {
  passed: boolean
  errors: string[]
  warnings: string[]
}

// Patterns that indicate project-specific content
const PROJECT_SPECIFIC_PATTERNS = [
  /SKILLSMITH/gi,
  /skillsmith/g,
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, // UUIDs
  /Acme|MyCompany|OurTeam/gi,
  /internal\.(company|corp|org)\./gi,
]

// Patterns that should trigger warnings
const WARNING_PATTERNS = [
  { pattern: /hardcoded/gi, message: 'Contains "hardcoded" - may indicate config issues' },
  { pattern: /TODO|FIXME|HACK/g, message: 'Contains TODO/FIXME/HACK comments' },
]

// Patterns that expose secrets (NEVER use these)
const SECRET_EXPOSURE_PATTERNS = [
  { pattern: /echo\s+\$[A-Z_]*KEY/gi, message: 'Echo command exposes secret KEY variable' },
  { pattern: /echo\s+\$[A-Z_]*SECRET/gi, message: 'Echo command exposes SECRET variable' },
  { pattern: /echo\s+\$[A-Z_]*TOKEN/gi, message: 'Echo command exposes TOKEN variable' },
  { pattern: /cat\s+\.env/g, message: 'cat .env exposes all secrets' },
  { pattern: /printenv\s*\|\s*grep/gi, message: 'printenv | grep may expose secrets' },
  { pattern: /config\s+show/gi, message: 'config show commands often expose secrets' },
]

// Patterns that indicate documentation context (skip these)
const DOCUMENTATION_CONTEXT_PATTERNS = [
  /❌|NEVER|unsafe|don't|bad|wrong/i,
  /# Example:|<!-- Example/i,
  /Usage:|Example:/i,
]

// Patterns that indicate placeholder API keys or validation (not real keys)
const PLACEHOLDER_KEY_PATTERNS = [
  /lin_api_xxx/i,
  /lin_api_\.\.\./i,
  /lin_api_your_key/i,
  /lin_api_here/i,
  /sk-xxx/i,
  /ghp_xxx/i,
  /your[-_]?key/i,
  /your[-_]?api[-_]?key/i,
  /<your-/i,
  /startsWith\s*\(['"]lin_api_/i, // Validation pattern
  /startsWith\s*\(['"]sk-/i,
  /startsWith\s*\(['"]ghp_/i,
  /console\.(log|error|warn)\s*\(/i, // Help/error messages
  /throw\s+new\s+Error/i, // Error messages
]

function isDocumentationContext(content: string, lineIndex: number): boolean {
  const lines = content.split('\n')
  const contextWindow = 5 // Check 5 lines before and after
  const start = Math.max(0, lineIndex - contextWindow)
  const end = Math.min(lines.length, lineIndex + contextWindow)
  const contextLines = lines.slice(start, end).join('\n')

  return DOCUMENTATION_CONTEXT_PATTERNS.some(p => p.test(contextLines))
}

function isPlaceholderKey(line: string): boolean {
  return PLACEHOLDER_KEY_PATTERNS.some(p => p.test(line))
}

function validateSkillStructure(skillPath: string): ValidationResult {
  const result: ValidationResult = { passed: true, errors: [], warnings: [] }

  // Check SKILL.md exists
  const skillMdPath = path.join(skillPath, 'SKILL.md')
  if (!fs.existsSync(skillMdPath)) {
    result.passed = false
    result.errors.push('Missing required SKILL.md file')
    return result
  }

  // Read SKILL.md
  const content = fs.readFileSync(skillMdPath, 'utf-8')

  // Check frontmatter
  if (!content.startsWith('---')) {
    result.passed = false
    result.errors.push('SKILL.md missing YAML frontmatter')
  }

  // Check required frontmatter fields
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1]
    if (!frontmatter.includes('name:')) {
      result.passed = false
      result.errors.push('Frontmatter missing required "name" field')
    }
    if (!frontmatter.includes('description:')) {
      result.passed = false
      result.errors.push('Frontmatter missing required "description" field')
    }

    // Check description format
    if (frontmatter.includes('description:')) {
      if (!frontmatter.includes('This skill should be used when')) {
        result.warnings.push('Description should start with "This skill should be used when..."')
      }
    }
  }

  // Check for referenced files
  const referencedFiles = content.match(/`references\/[^`]+`|`scripts\/[^`]+`|`examples\/[^`]+`/g) || []
  for (const ref of referencedFiles) {
    const filePath = ref.replace(/`/g, '')
    const fullPath = path.join(skillPath, filePath)
    if (!fs.existsSync(fullPath)) {
      result.warnings.push(`Referenced file does not exist: ${filePath}`)
    }
  }

  // Check content length
  const bodyContent = content.replace(/^---[\s\S]*?---/, '')
  const wordCount = bodyContent.split(/\s+/).length
  if (wordCount > 3000) {
    result.warnings.push(`SKILL.md body is ${wordCount} words (recommended: <2000). Consider moving content to references/`)
  }

  return result
}

function checkGeneralization(skillPath: string): ValidationResult {
  const result: ValidationResult = { passed: true, errors: [], warnings: [] }

  // Get all files in skill directory
  function getAllFiles(dirPath: string, files: string[] = []): string[] {
    if (!fs.existsSync(dirPath)) return files

    const items = fs.readdirSync(dirPath)
    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      if (fs.statSync(fullPath).isDirectory()) {
        getAllFiles(fullPath, files)
      } else if (item.endsWith('.ts') || item.endsWith('.js') || item.endsWith('.md')) {
        files.push(fullPath)
      }
    }
    return files
  }

  const files = getAllFiles(skillPath)

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    const relativePath = path.relative(skillPath, file)

    // Check for project-specific patterns
    for (const pattern of PROJECT_SPECIFIC_PATTERNS) {
      const matches = content.match(pattern)
      if (matches) {
        // Skip if it's in a comment explaining the pattern
        if (!content.includes('// Example:') && !content.includes('<!-- Example')) {
          result.warnings.push(`${relativePath}: Contains potentially project-specific content: "${matches[0]}"`)
        }
      }
    }

    // Check for warning patterns
    for (const { pattern, message } of WARNING_PATTERNS) {
      if (pattern.test(content)) {
        result.warnings.push(`${relativePath}: ${message}`)
      }
    }

    // Check for secret exposure patterns (CRITICAL)
    // Skip if in documentation context showing what NOT to do
    const lines = content.split('\n')
    for (const { pattern, message } of SECRET_EXPOSURE_PATTERNS) {
      const matches = content.matchAll(new RegExp(pattern.source, pattern.flags))
      for (const match of matches) {
        // Find line number of match
        const beforeMatch = content.substring(0, match.index)
        const lineIndex = beforeMatch.split('\n').length - 1

        // Skip if in documentation context (showing unsafe patterns as examples)
        if (!isDocumentationContext(content, lineIndex)) {
          result.passed = false
          result.errors.push(`${relativePath}: ${message} - Use Varlock instead!`)
          break // Only report once per pattern per file
        }
      }
    }

    // Check for hardcoded strings that should be env vars (in code files)
    if (file.endsWith('.ts') || file.endsWith('.js')) {
      // Check for hardcoded API keys - skip placeholder patterns
      const keyPattern = /['"]lin_api_|['"]sk-|['"]ghp_|['"]npm_/g
      const keyMatches = content.matchAll(keyPattern)
      for (const match of keyMatches) {
        const line = lines.find(l => l.includes(match[0]))
        if (line && !isPlaceholderKey(line)) {
          result.passed = false
          result.errors.push(`${relativePath}: Contains hardcoded API key`)
          break
        }
      }

      // Check for non-parameterized function names
      if (/function\s+\w*(Skillsmith|MyProject|Acme)\w*/.test(content)) {
        result.warnings.push(`${relativePath}: Function name contains project-specific term`)
      }
    }
  }

  return result
}

function checkEnvironmentDocumentation(skillPath: string): ValidationResult {
  const result: ValidationResult = { passed: true, errors: [], warnings: [] }

  const skillMdPath = path.join(skillPath, 'SKILL.md')
  if (!fs.existsSync(skillMdPath)) return result

  const content = fs.readFileSync(skillMdPath, 'utf-8')

  // Get all files in skill
  function getAllFiles(dirPath: string, files: string[] = []): string[] {
    if (!fs.existsSync(dirPath)) return files
    const items = fs.readdirSync(dirPath)
    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      if (fs.statSync(fullPath).isDirectory()) {
        getAllFiles(fullPath, files)
      } else if (item.endsWith('.ts') || item.endsWith('.js')) {
        files.push(fullPath)
      }
    }
    return files
  }

  // Find all process.env references
  const envVars = new Set<string>()
  const sensitiveVars = new Set<string>()
  const files = getAllFiles(skillPath)

  for (const file of files) {
    const fileContent = fs.readFileSync(file, 'utf-8')
    const matches = fileContent.matchAll(/process\.env\.([A-Z_][A-Z0-9_]*)/g)
    for (const match of matches) {
      const varName = match[1]
      envVars.add(varName)

      // Check if it's likely a sensitive variable
      if (/KEY|SECRET|TOKEN|PASSWORD|CREDENTIAL|AUTH/i.test(varName)) {
        sensitiveVars.add(varName)
      }
    }
  }

  // Check if env vars are documented
  for (const envVar of envVars) {
    if (!content.includes(envVar)) {
      result.warnings.push(`Environment variable ${envVar} used but not documented in SKILL.md`)
    }
  }

  // Check for Varlock usage with sensitive variables
  if (sensitiveVars.size > 0) {
    const hasEnvSchema = fs.existsSync(path.join(skillPath, '.env.schema'))
    const mentionsVarlock = content.toLowerCase().includes('varlock')

    if (!hasEnvSchema && !mentionsVarlock) {
      result.warnings.push(
        `Skill uses sensitive variables (${Array.from(sensitiveVars).join(', ')}) but does not reference Varlock. ` +
        `Consider adding .env.schema and Varlock documentation.`
      )
    }

    // Check for @sensitive annotations in .env.schema
    if (hasEnvSchema) {
      const schemaContent = fs.readFileSync(path.join(skillPath, '.env.schema'), 'utf-8')
      for (const sensitiveVar of sensitiveVars) {
        if (schemaContent.includes(sensitiveVar) && !schemaContent.includes('@sensitive')) {
          result.warnings.push(
            `.env.schema defines ${sensitiveVar} but may be missing @sensitive annotation`
          )
        }
      }
    }
  }

  return result
}

function main() {
  const skillPath = process.argv[2]

  if (!skillPath) {
    console.log('Usage: validate-skill.ts <skill-path>')
    console.log('')
    console.log('Example:')
    console.log('  npx tsx validate-skill.ts path/to/skill')
    process.exit(1)
  }

  const resolvedPath = path.resolve(skillPath)

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: Path does not exist: ${resolvedPath}`)
    process.exit(1)
  }

  console.log(`\n=== Validating Skill: ${path.basename(resolvedPath)} ===\n`)

  // Run validations
  const structureResult = validateSkillStructure(resolvedPath)
  const generalizationResult = checkGeneralization(resolvedPath)
  const envDocResult = checkEnvironmentDocumentation(resolvedPath)

  // Combine results
  const allErrors = [
    ...structureResult.errors,
    ...generalizationResult.errors,
    ...envDocResult.errors
  ]

  const allWarnings = [
    ...structureResult.warnings,
    ...generalizationResult.warnings,
    ...envDocResult.warnings
  ]

  // Print results
  if (allErrors.length > 0) {
    console.log('❌ ERRORS:')
    allErrors.forEach(e => console.log(`  - ${e}`))
    console.log('')
  }

  if (allWarnings.length > 0) {
    console.log('⚠️  WARNINGS:')
    allWarnings.forEach(w => console.log(`  - ${w}`))
    console.log('')
  }

  const passed = allErrors.length === 0
  console.log(`\n=== Result: ${passed ? '✅ PASSED' : '❌ FAILED'} ===`)
  console.log(`Errors: ${allErrors.length}, Warnings: ${allWarnings.length}`)

  process.exit(passed ? 0 : 1)
}

main()
