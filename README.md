# Project Context Pack

> A portable memory-pack plugin for AI coding agents. Drop it into any project so agents can stay context-aware across conversations.

## What It Does

Maintain a lightweight `.context/` folder in any project. AI agents read it to instantly understand scope, stack, architecture, data models, API contracts, coding rules, progress, roadmap, and decisions — without re-scanning the entire codebase.

## Skills

| Skill | Description |
|---|---|
| **init-context** | Initialize `.context/` on a new project. Asks you about your project, then generates compact context files. |
| **use-context** | Read and use the `.context/` folder efficiently. Loads the right files for the task at hand. |
| **update-context** | Surgically update specific context files after completing work. |
| **review-context** | Audit `.context/` for staleness, missing files, and inaccuracies. |

## Installation

1. Clone or copy the contents of this repository into your project's `.cline/` folder (for Cline) or equivalent agent config directory.
2. Configure your agent to load the skills from `.cline/skills/`.
3. Run the **init-context** skill on a new project, or **use-context** on an existing project that already has a `.context/` folder.

## Structure

```
.cline/
├── plugin.json              # Plugin manifest
└── skills/
    ├── init-context/         # Initialize .context/ on new projects
    │   ├── SKILL.md
    │   ├── agents/openai.yaml
    │   └── references/init-workflow.md
    ├── use-context/          # Read and use .context/ efficiently
    │   ├── SKILL.md
    │   ├── agents/openai.yaml
    │   └── references/context-hygiene.md
    ├── update-context/       # Update .context/ after work
    │   ├── SKILL.md
    │   └── agents/openai.yaml
    └── review-context/       # Audit .context/ for staleness
        ├── SKILL.md
        ├── agents/openai.yaml
        └── references/audit-checklist.md

.context-templates/           # Template files used by init-context
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
```

## Cross-Platform Compatibility

The skill files (`SKILL.md`) are written in plain Markdown with a YAML front matter header. This format is compatible with:
- **Cline** (`.cline/skills/`)
- **Claude Code** (`.claude/skills/`)
- **GitHub Copilot** (`.github/copilot-instructions.md`)
- **Cursor** (`.cursorrules`)
- Any agent that supports skill-based plugin loading

To adapt for another agent, copy the `skills/` folder to the appropriate path and adjust `plugin.json` as needed.

## License

MIT
