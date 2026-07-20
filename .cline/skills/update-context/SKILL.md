---
name: update-context
description: Update specific context files in `.context` after completing work. Trigger after finishing a milestone, changing architecture/API/schema, adding decisions, or when the user asks to update/refresh/sync the context.
---

# Update Context

## Goal

Keep `.context` files aligned with current implementation reality. This skill performs precise, targeted updates — not full regeneration. For full regeneration from source code, use the repo's generate-context skill (if available) instead.

## Workflow

1. **Identify what changed**: Determine which durable facts have changed:
   - Architecture decisions or system design
   - Data models, entities, fields, indexes, relationships
   - API endpoints, contracts, request/response shapes
   - Coding rules, conventions, or tooling
   - Project progress, milestones completed, blockers
   - Roadmap priorities or timeline
   - New architectural decisions with lasting tradeoffs

2. **Read the relevant file(s)** from `.context/` to understand current content.

3. **Apply targeted updates**:
   - **`progress.md`**: Append completed items, update in-progress section, update next steps. Keep chronological order.
   - **`api_spec.md`**: Add new endpoints, update changed contracts, mark deprecated endpoints. Mark the status line as updated.
   - **`data_models.md`**: Add/modify entities, fields, relationships, constraints. Keep the datastore source-of-truth statement current.
   - **`design.md`**: Update architecture descriptions, component responsibilities, communication flows, or reliability patterns only when architecture-level changes occur.
   - **`decisions.md`**: Append new decisions with date, decision, rationale, and consequences. Do not modify past decisions unless they were explicitly reversed.
   - **`coding_rules.md`**: Update conventions, tooling changes, or new rules discovered during implementation.
   - **`roadmap.md`**: Mark completed phases, adjust priorities, add new phases.
   - **`project_brief.md`**: Update only if scope, stack, or core features materially changed.
   - **`original_requirements.md`**: Append clarifying notes if requirements interpretation changed significantly, but preserve original text.

4. **Preserve unrelated content**: When updating one section of a file, leave other sections intact. Use surgical edits, not file rewrites.

5. **Cross-reference check**: After updating, verify that related files still agree:
   - If `data_models.md` changed, does `api_spec.md` need updates?
   - If `design.md` changed, do the `decisions.md` entries still align?
   - If `progress.md` shows new completion, does `roadmap.md` need checkbox updates?

6. **Summarize**: Tell the user what was updated and why.

## Update Rules

- Never blindly regenerate — preserve user-authored content that is still accurate
- Never delete context files unless the user asks for cleanup
- When merging, prefer additive changes over destructive edits
- If a file was user-authored and has no stale content, leave it alone
- If unsure whether a piece of information is still accurate, preserve it and flag the uncertainty

## Safety

- Do not update `.context` files if no durable facts changed
- Do not add speculative future plans to `progress.md` or `roadmap.md` — let the user decide what to prioritize
- Do not remove user-written commentary or notes unless they contradict current implementation
