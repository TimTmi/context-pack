import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, '..');
const TEMPLATES_SRC = resolve(PACKAGE_ROOT, 'template/context-templates');

/**
 * Collect project information interactively, then write .context/ files.
 */
export async function runInitPrompt({ dest, overwrite = false }) {
  const contextDir = resolve(dest, '.context');
  const templatesDir = TEMPLATES_SRC;

  // Check existing
  if (existsSync(contextDir) && !overwrite) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '.context/ already exists. What do you want to do?',
        choices: [
          { name: 'Overwrite all files', value: 'overwrite' },
          { name: 'Cancel', value: 'cancel' },
        ],
      },
    ]);
    if (action === 'cancel') {
      console.log('\n  Cancelled.\n');
      return;
    }
    overwrite = true;
  }

  console.log('\n  Let me ask you a few questions about your project.\n');

  // --- Collect info ---
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the project name?',
      validate: (v) => v.trim().length > 0 || 'Project name is required',
    },
    {
      type: 'input',
      name: 'goal',
      message: 'Describe the project goal in one paragraph:',
      validate: (v) => v.trim().length > 0 || 'A brief goal is required',
    },
    {
      type: 'input',
      name: 'stack',
      message: 'What is the tech stack? (e.g., React + Node.js + PostgreSQL)',
    },
    {
      type: 'input',
      name: 'features',
      message: 'What are the core features? (comma-separated list):',
      filter: (v) => v.split(',').map((s) => s.trim()).filter(Boolean),
    },
    {
      type: 'input',
      name: 'architecture',
      message: 'What is the architecture? (e.g., monolith, microservices, serverless)',
    },
    {
      type: 'confirm',
      name: 'hasDataModels',
      message: 'Do you have data models / schema defined?',
      default: false,
    },
    {
      type: 'input',
      name: 'dataModels',
      message: 'Describe the main entities and relationships briefly:',
      when: (a) => a.hasDataModels,
    },
    {
      type: 'confirm',
      name: 'hasApi',
      message: 'Does this project have an API?',
      default: true,
    },
    {
      type: 'input',
      name: 'apiType',
      message: 'What API protocol? (REST, GraphQL, gRPC, etc.)',
      default: 'REST',
      when: (a) => a.hasApi,
    },
    {
      type: 'input',
      name: 'apiEndpoints',
      message: 'List the main endpoints or operations (comma-separated):',
      when: (a) => a.hasApi,
      filter: (v) => v.split(',').map((s) => s.trim()).filter(Boolean),
    },
    {
      type: 'input',
      name: 'codingConventions',
      message: 'Any coding conventions to note? (e.g., TypeScript strict mode, feature-based folders)',
    },
    {
      type: 'input',
      name: 'currentStatus',
      message: 'What is the current status? (e.g., just starting, foundation built, feature X in progress)',
      default: 'Just starting',
    },
    {
      type: 'input',
      name: 'nextSteps',
      message: 'What are the next steps?',
      default: 'TBD',
    },
    {
      type: 'input',
      name: 'decisions',
      message: 'Any key architectural decisions made so far? (comma-separated)',
      filter: (v) => v.split(',').map((s) => s.trim()).filter(Boolean),
    },
  ]);

  // --- Generate files ---
  mkdirSync(contextDir, { recursive: true });

  const files = generateFiles(answers, templatesDir);
  const created = [];

  for (const [filename, content] of Object.entries(files)) {
    const filePath = join(contextDir, filename);
    if (existsSync(filePath) && !overwrite) {
      console.log(`  Skipped ${filename} (already exists)`);
      continue;
    }
    writeFileSync(filePath, content, 'utf-8');
    created.push(filename);
  }

  // Always write context_guide (needs to reference the created files)
  writeFileSync(join(contextDir, 'context_guide.md'), generateGuide(answers, Object.keys(files)), 'utf-8');
  if (!created.includes('context_guide.md')) {
    created.push('context_guide.md');
  }

  console.log(`\n  ✓ Created .context/ with ${created.length} files:`);
  for (const f of created) {
    console.log(`    ${f}`);
  }
  console.log('');
}

function generateFiles(answers) {
  const { projectName, goal, stack, features, architecture, dataModels, hasApi,
          apiType, apiEndpoints, codingConventions, currentStatus, nextSteps, decisions } = answers;

  const now = new Date().toISOString().split('T')[0];

  return {
    'project_brief.md': [
      `# Project Brief: ${projectName}\n`,
      '## Goal', goal, '',
      '## Stack', stack || 'To be defined', '',
      '## Core Features',
      ...(features.length ? features.map((f) => `- ${f}`) : ['- To be defined']),
      '',
    ].join('\n'),

    'original_requirements.md': [
      `# Original Requirements: ${projectName}\n`,
      '> *(Initialized via context-pack. Replace with full requirements.)*\n',
      '## Context', goal, '',
      '## Requirements', '- To be detailed', '',
    ].join('\n'),

    'design.md': [
      `# ${projectName} Technical Design\n`,
      '## Architecture', architecture || 'Not yet defined', '',
      '## Components', '- To be documented', '',
      '## Communication',
      hasApi ? `- ${apiType} API` : '- No API defined', '',
      '## Key Reliability Patterns', '- To be documented', '',
      '## Important Tradeoffs', '- To be documented', '',
    ].join('\n'),

    'data_models.md': [
      `# Data Models: ${projectName}\n`,
      'To be defined.', '', dataModels || '', '',
    ].join('\n'),

    'api_spec.md': hasApi ? [
      `# API Spec: ${projectName}\n`,
      'Status: initial scaffold.\n',
      `Protocol: ${apiType}\n`,
      ...(apiEndpoints.length ? [
        '## Endpoints',
        ...apiEndpoints.map((e) => `- \`${e}\` — *(to be documented)*`),
      ] : ['## Endpoints', '- To be defined']),
      '',
    ].join('\n') : `# API Spec: ${projectName}\n\nNo API defined for this project.\n`,

    'coding_rules.md': [
      `# Coding Rules: ${projectName}\n`,
      '## Priority Order',
      '1. Correctness', '2. Simplicity', '3. Readability',
      '4. Maintainability', '5. Performance', '6. Cleverness\n',
      '---\n',
      '## Coding Standards',
      codingConventions || '- Standard conventions apply\n',
      '---\n',
      '## Documentation',
      '- Update `decisions.md` whenever significant architectural decisions change',
      '- Keep `progress.md` updated after major milestones',
      '- Documentation must reflect current implementation reality, not plans\n',
    ].join('\n'),

    'roadmap.md': [
      `# Roadmap: ${projectName}\n`,
      '## Phase 1: Foundation',
      '- [ ] Setup project scaffolding\n',
      '## Phase 2: Core Features',
      ...(features.length ? features.map((f) => `- [ ] ${f}`) : ['- [ ] To be defined']),
      '\n## Phase 3: Enhancements',
      '- [ ] To be planned\n',
    ].join('\n'),

    'progress.md': [
      `# Progress: ${projectName}\n`,
      '## Completed',
      '- **Project started**: Initial context setup\n',
      '## In Progress', `- ${currentStatus}\n`,
      '## Next Steps', `- ${nextSteps}\n`,
    ].join('\n'),

    'decisions.md': (decisions && decisions.length) ? [
      `# Decisions: ${projectName}\n`,
      ...decisions.map((d) => [
        `### ${now}: ${d}`,
        `- **Decision**: ${d}`,
        '- **Reason**: *(to document)*',
        '- **Consequences**: *(to document)*\n',
      ].join('\n')),
    ].join('\n') : [
      `# Decisions: ${projectName}\n`,
      'No architectural decisions have been recorded yet.\n',
    ].join('\n'),
  };
}

function generateGuide(answers, filenames) {
  const { projectName } = answers;
  const files = [
    { name: 'project_brief.md', desc: 'concise product summary, stack, and must-have features' },
    { name: 'original_requirements.md', desc: 'full requirements or problem statement; read when details are missing elsewhere' },
    { name: 'design.md', desc: 'system architecture, component responsibilities, communication flows, and reliability patterns' },
    { name: 'data_models.md', desc: 'entity and relationship source of truth' },
    { name: 'api_spec.md', desc: 'API contracts and integration expectations' },
    { name: 'coding_rules.md', desc: 'implementation standards and agent behavior rules' },
    { name: 'roadmap.md', desc: 'planned build order' },
    { name: 'progress.md', desc: 'completed work, current work, blockers, next steps' },
    { name: 'decisions.md', desc: 'accepted technical decisions and important tradeoffs' },
  ];

  const table = files
    .filter((f) => filenames.includes(f.name))
    .map((f) => `| \`${f.name}\` | ${f.desc} |`)
    .join('\n');

  return [
    `# Context Guide: ${projectName}\n`,
    'This folder is the lightweight memory pack for AI agents. Keep files short, factual, and current.\n',
    'Available skills (installed via context-pack):',
    '- `init-context`: Initialize this folder on a new project',
    '- `use-context`: Read and use this folder during development',
    '- `update-context`: Update specific context files after completing work',
    '- `review-context`: Audit context files for staleness\n',
    '## Read Order\n',
    '1. `project_brief.md` for scope, stack, and core features',
    '2. `progress.md` for current state and next task',
    '3. `coding_rules.md` before changing code\n',
    'Then read only what the task needs:\n',
    '| Task type | Read these files |',
    '| --- | --- |',
    '| Architecture/backend design | `design.md`, `decisions.md` |',
    '| Database/schema work | `data_models.md`, `design.md` |',
    '| API/client integration | `api_spec.md`, `data_models.md` |',
    '| Feature flow details | `design.md`, `api_spec.md`, `data_models.md`, `decisions.md` |',
    '| Planning/prioritization | `roadmap.md`, `progress.md` |\n',
    '## File Roles\n',
    table,
    '\n## Maintenance Rules\n',
    '- Update `progress.md` after each meaningful milestone',
    '- Update `api_spec.md` before wiring frontend/mobile to backend endpoints',
    '- Update `data_models.md` when schema, fields, indexes, or relationships change',
    '- Update `design.md` only for architecture-level changes',
    '- Add to `decisions.md` only for non-obvious decisions that future agents might re-debate\n',
    '## Context Budget\n',
    '- Keep files concise and under 1 page each where possible',
    '- Prefer cross-references over duplicating information',
    '- Remove stale plans when implementation reality differs\n',
  ].join('\n');
}
