# Project Context Pack

> A portable memory-pack plugin for AI coding agents. Drop it into any project so agents can stay context-aware across conversations.

## What It Does

Maintain a lightweight `.context/` folder in any project. AI agents read it to instantly understand scope, stack, architecture, data models, API contracts, coding rules, progress, roadmap, and decisions — without re-scanning the entire codebase.

## Quick Install

```bash
# Install skills + templates into current project (Cline default)
npx @tmitmitmi/context-pack-init install

# Or specify a project directory and agent
npx @tmitmitmi/context-pack-init install --dest ../my-project --agent claude-code

# Interactive init: generates .context/ with your project details
npx @tmitmitmi/context-pack-init init

# Combined: install then auto-init
npx @tmitmitmi/context-pack-init install --init

# See all options
npx @tmitmitmi/context-pack-init install --help
```

> Note: Package publishing is pending. For now, clone the repo and copy the `packages/context-pack-init/template/` folder into your project, or run the CLI directly from the repo.

### Manual Install (No CLI)

Clone or copy `.cline/skills/` and `.context-templates/` into your project:

```bash
cp -r .cline/skills /path/to/your/project/.cline/
cp -r .context-templates /path/to/your/project/
```

Then run the **use-context** skill in your agent, or **init-context** to generate `.context/` files.

## Skills

| Skill | Description |
|---|---|
| **init-context** | Initialize `.context/` on a new project. Asks you about your project, then generates compact context files. |
| **use-context** | Read and use the `.context/` folder efficiently. Loads the right files for the task at hand. |
| **update-context** | Surgically update specific context files after completing work. |
| **review-context** | Audit `.context/` for staleness, missing files, and inaccuracies. |

## CLI Usage

```text
Usage: context-pack-init <command> [options]

Commands:
  install|i    Copy skills and templates into the target project
  init         Run the interactive context initialization prompt

Options (install):
  -d, --dest <path>    Target project directory (default: ".")
  -a, --agent <agent>  Target AI agent (default: "cline")
                       Supported: cline, claude-code, copilot, cursor
  --init               Also run interactive context initialization after install
  --update             Overwrite existing files without prompting
  --dry-run            Show what would be copied without actually copying
  --list-agents        List supported agents and exit
```

### Agent Path Mapping

| Agent | Skills directory |
|---|---|
| `cline` | `.cline/skills/` |
| `claude-code` | `.claude/skills/` |
| `copilot` | `.github/skills/` |
| `cursor` | `.cursor/skills/` |

## Structure

```
.cline/                          # Plugin root (for Cline)
├── plugin.json                  # Plugin manifest
└── skills/
    ├── init-context/            # Initialize .context/ on new projects
    │   ├── SKILL.md
    │   ├── agents/openai.yaml
    │   └── references/init-workflow.md
    ├── use-context/             # Read and use .context/ efficiently
    │   ├── SKILL.md
    │   ├── agents/openai.yaml
    │   └── references/context-hygiene.md
    ├── update-context/          # Update .context/ after work
    │   ├── SKILL.md
    │   └── agents/openai.yaml
    └── review-context/          # Audit .context/ for staleness
        ├── SKILL.md
        ├── agents/openai.yaml
        └── references/audit-checklist.md

.context-templates/              # Template files (used by init-context skill and CLI)
├── context_guide.md
├── project_brief.md
├── original_requirements.md
├── design.md
├── data_models.md
├── api_spec.md
├── coding_rules.md
├── roadmap.md
├── progress.md
└── decisions.md

packages/context-pack-init/      # npm CLI package (@context-pack/init)
├── package.json
├── src/
│   ├── cli.js                   # Entry point (commander)
│   ├── installer.js              # Copies skills + templates to target project
│   └── init-prompt.js            # Interactive .context/ generator
└── template/                    # What gets copied during install
    ├── skills/
    └── context-templates/
```

## Cross-Platform Compatibility

The skill files (`SKILL.md`) are written in plain Markdown with a YAML front matter header. This format is compatible with:
- **Cline** (`.cline/skills/`)
- **Claude Code** (`.claude/skills/`)
- **GitHub Copilot** (`.github/skills/`)
- **Cursor** (`.cursor/skills/`)
- Any agent that supports skill-based plugin loading

To adapt for another agent, use the `--agent` flag or copy the `skills/` folder to the appropriate path.

## License

MIT
