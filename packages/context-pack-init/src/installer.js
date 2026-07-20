import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, writeFileSync } from 'fs';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import { runInitPrompt } from './init-prompt.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, '..');
const SKILLS_SRC = resolve(PACKAGE_ROOT, 'template/skills');
const TEMPLATES_SRC = resolve(PACKAGE_ROOT, 'template/context-templates');

/**
 * Recursively copies a directory.
 * Returns list of copied files relative to srcRoot.
 */
function copyDir(src, dest, dryRun = false) {
  const copied = [];

  if (!existsSync(src)) return copied;

  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!dryRun) {
        mkdirSync(destPath, { recursive: true });
      }
      const subCopied = copyDir(srcPath, destPath, dryRun);
      copied.push(...subCopied);
    } else {
      if (!dryRun) {
        copyFileSync(srcPath, destPath);
      }
      copied.push(relative(dirname(src), srcPath));
    }
  }

  return copied;
}

export async function installPackage({ dest, agent, agentPath, runInit, force, dryRun }) {
  const skillsDest = resolve(dest, agentPath, 'skills');
  const templatesDest = resolve(dest, '.context-templates');
  const contextDest = resolve(dest, '.context');

  // Check for existing .context/
  const contextExists = existsSync(contextDest);
  let shouldInit = runInit;

  if (contextExists && !force && !dryRun) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'A .context/ folder already exists in this project.',
        choices: [
          { name: 'Overwrite .context/ with fresh templates', value: 'overwrite' },
          { name: 'Keep existing .context/, only update skills/templates', value: 'skip' },
          { name: 'Cancel installation', value: 'cancel' },
        ],
      },
    ]);
    if (action === 'cancel') {
      console.log('\n  Installation cancelled.');
      process.exit(0);
    }
    if (action === 'skip') {
      shouldInit = false;
    }
  }

  // --- Copy skills ---
  console.log(`\n  Installing context-pack skills for ${agent}...`);

  if (!dryRun) {
    mkdirSync(skillsDest, { recursive: true });
  }

  const copiedSkills = copyDir(SKILLS_SRC, skillsDest, dryRun);
  if (copiedSkills.length === 0) {
    console.log(`  ⚠  No skills found in template at ${SKILLS_SRC}`);
  } else if (!dryRun) {
    console.log(`  ✓ Copied ${copiedSkills.length} skill files to ${agentPath}/skills/`);
  } else {
    console.log(`  [DRY-RUN] Would copy ${copiedSkills.length} skill files to ${agentPath}/skills/`);
    for (const f of copiedSkills) {
      console.log(`    → ${agentPath}/skills/${f}`);
    }
  }

  // --- Copy templates ---
  console.log(`  Installing .context-templates...`);

  if (!dryRun) {
    mkdirSync(templatesDest, { recursive: true });
  }

  const copiedTemplates = copyDir(TEMPLATES_SRC, templatesDest, dryRun);
  if (copiedTemplates.length === 0) {
    console.log(`  ⚠  No templates found at ${TEMPLATES_SRC}`);
  } else if (!dryRun) {
    console.log(`  ✓ Copied ${copiedTemplates.length} template files to .context-templates/`);
  } else {
    console.log(`  [DRY-RUN] Would copy ${copiedTemplates.length} template files to .context-templates/`);
    for (const f of copiedTemplates) {
      console.log(`    → .context-templates/${f}`);
    }
  }

  // --- Summary ---
  console.log(`\n  ── Installation summary ──`);
  console.log(`  Target project   : ${dest}`);
  console.log(`  Agent            : ${agent} (→ ${agentPath}/skills/)`);
  console.log(`  Skills           : ${copiedSkills.length} files`);
  console.log(`  Templates        : ${copiedTemplates.length} files`);
  console.log(`  Context folder   : ${contextExists ? 'already exists' : 'not yet created'}`);
  console.log(`  ─────────────────────────\n`);

  // --- Optionally run init prompt ---
  if (shouldInit) {
    if (dryRun) {
      console.log('  [DRY-RUN] Would run interactive context initialization.\n');
    } else {
      console.log('  Starting interactive context initialization...\n');
      await runInitPrompt({ dest, overwrite: !!force });
    }
  } else if (runInit) {
    console.log('  Skipped interactive init (existing .context/ kept as-is).');
    console.log('  Run `context-pack-init init` to regenerate.\n');
  }

  if (!dryRun) {
    console.log('  Done! Run the use-context skill in your agent to get started.\n');
  }
}
