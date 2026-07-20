#!/usr/bin/env node

import { Command } from 'commander';
import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { installPackage } from './installer.js';
import { runInitPrompt } from './init-prompt.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));

const AGENT_PATHS = {
  cline: '.cline',
  'claude-code': '.claude',
  copilot: '.github',
  cursor: '.cursor',
};

const AGENT_DESCRIPTIONS = {
  cline: 'Cline (.cline/)',
  'claude-code': 'Claude Code (.claude/)',
  copilot: 'GitHub Copilot (.github/)',
  cursor: 'Cursor (.cursor/)',
};

const program = new Command();

program
  .name('context-pack-init')
  .description('Install the project context pack into any repo')
  .version(pkg.version);

program
  .command('install')
  .alias('i')
  .description('Copy skills and templates into the target project')
  .option('-d, --dest <path>', 'Target project directory', '.')
  .option('-a, --agent <agent>', `Target AI agent: ${Object.keys(AGENT_PATHS).join(', ')}`, 'cline')
  .option('--init', 'Also run interactive context initialization after install')
  .option('--update', 'Overwrite existing files (skip prompts)')
  .option('--dry-run', 'Show what would be copied without actually copying')
  .option('--list-agents', 'List supported agents and exit')
  .action(async (options) => {
    if (options.listAgents) {
      console.log('\nSupported agents:');
      for (const [key, desc] of Object.entries(AGENT_DESCRIPTIONS)) {
        const agentPath = AGENT_PATHS[key];
        console.log(`  ${key.padEnd(15)} ${desc.padEnd(30)} → ${agentPath}/skills/`);
      }
      process.exit(0);
    }

    const agent = options.agent.toLowerCase();
    if (!AGENT_PATHS[agent]) {
      console.error(`\n  Unknown agent: "${options.agent}"`);
      console.error(`  Supported agents: ${Object.keys(AGENT_PATHS).join(', ')}`);
      process.exit(1);
    }

    const dest = resolve(process.cwd(), options.dest);
    if (!existsSync(dest)) {
      console.error(`\n  Destination does not exist: ${dest}`);
      process.exit(1);
    }

    await installPackage({
      dest,
      agent,
      agentPath: AGENT_PATHS[agent],
      runInit: options.init,
      force: options.update || !!process.env.CI,
      dryRun: options.dryRun,
    });
  });

program
  .command('init')
  .description('Run the interactive context initialization prompt (generates .context/ files)')
  .option('-d, --dest <path>', 'Target project directory', '.')
  .action(async (options) => {
    const dest = resolve(process.cwd(), options.dest);
    if (!existsSync(dest)) {
      console.error(`\n  Destination does not exist: ${dest}`);
      process.exit(1);
    }
    await runInitPrompt({ dest });
  });

program.parse(process.argv);
