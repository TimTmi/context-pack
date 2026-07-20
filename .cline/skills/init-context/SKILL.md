---
name: init-context
description: Initialize a project `.context` memory pack by asking the user about their project and generating compact context files. Use when starting a new project, or when the user asks to init/initialize/setup/create the context folder.
---

# Init Context

## Goal

Create a `.context` folder for this project that future agents can read to quickly understand the project's scope, stack, design, data models, API contracts, coding rules, progress, roadmap, and key decisions.

The skill asks the user a series of questions, then generates compact markdown files under `.context/`.

## Workflow

1. **Detect existing context**: If `.context/` already exists, ask the user whether to overwrite or merge. If the project already has context, consider whether `review-context` or `update-context` is more appropriate.

2. **Ask the user** (one question at a time, collect answers as you go):
   - What is the project name?
   - What is the one-paragraph goal of this project?
   - What tech stack is used? (languages, frameworks, databases, infra)
   - What are the core features? (list them concisely)
   - What is the high-level architecture? (monolith, microservices, etc.)
   - What data stores are used and what are the main entities?
   - Are there API contracts? (REST, GraphQL, etc.)
   - What coding conventions should agents follow?
   - What is the current build/phase/roadmap stage?
   - Any key architectural decisions already made?

3. **Generate files** using the templates in `.context-templates/`, filling in the user's answers. Create exactly these files:
   - `context_guide.md`
   - `project_brief.md`
   - `original_requirements.md` (if the user provides requirements)
   - `design.md` (if architecture info is available)
   - `data_models.md` (if entity/schema info is available)
   - `api_spec.md` (if API contracts are known, even partially)
   - `coding_rules.md`
   - `roadmap.md`
   - `progress.md`
   - `decisions.md`

4. **Omit placeholder files**: If a file would contain only boilerplate placeholders with no real content, skip creating it rather than leaving a stub. Mark it as "not yet defined" in `context_guide.md`'s file roles table if needed.

5. **Write concise markdown**: Use bullets and small tables. Avoid generated logs, long code excerpts, duplicated requirements, and speculative implementation notes.

6. **Summarize**: Tell the user what was created and what gaps remain (files omitted because info was not yet available).

## Generation Rules

- Keep `project_brief.md` to one page
- Keep `progress.md` focused on current state, not full history
- Keep `api_spec.md` as the authoritative contract; mark uncertain parts explicitly
- Keep `data_models.md` as the entity source of truth
- Keep `decisions.md` for accepted decisions with rationale — not every minor choice
- Keep `context_guide.md` self-contained and aligned with actual files in `.context`

## Safety

- Do not delete or overwrite existing `.context` files unless the user explicitly confirms
- Do not read entire source trees unless the user wants auto-generation
- If the user wants auto-generation from source code, suggest the `generate-context` skill instead
