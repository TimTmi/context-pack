---
name: review-context
description: Audit the `.context` folder for stale references, missing files, outdated information, and alignment with the current codebase. Use before starting a major task, when onboarding a new agent, or when the user asks to audit/review/check/sync/clean the context.
---

# Review Context

## Goal

Audit the `.context` folder for accuracy, completeness, and freshness. Identify stale references, missing files, outdated decisions, and alignment issues between context files and the current codebase.

## Workflow

1. **Read all `.context` files** to understand what the project claims about itself.

2. **Verify file integrity**:
   - Does every file mentioned in `context_guide.md` actually exist?
   - Do all cross-references between `.context` files point to existing sections?
   - Are any `.context` files present but unlisted in `context_guide.md`?

3. **Verify structural claims** (lightweight checks — do not deep-read the entire source):
   - Does the stack in `project_brief.md` match what `package.json`, `composer.json`, `Cargo.toml`, `requirements.txt`, etc. declare?
   - Do major directory names in the repo match the module/component names in `design.md`?
   - Do the major entities in `data_models.md` match actual schema files, migrations, or ORM models? (Spot-check 2-3 entities.)
   - Do the API endpoints in `api_spec.md` appear in route files or controller files? (Spot-check 2-3 endpoints.)

4. **Verify progress claims**:
   - Do features marked "completed" in `progress.md` or `roadmap.md` actually work or exist in the codebase?
   - Do features marked "in progress" or "next" still make sense given the current state?

5. **Detect staleness**:
   - Are there references to deleted files, renamed modules, or removed dependencies?
   - Are there decisions in `decisions.md` that have been implicitly reversed by later code changes?
   - Does `progress.md` mention branches, PRs, or issues that are closed/merged?
   - Are architecture descriptions still accurate (e.g., still using the same DB, same auth mechanism)?

6. **Report findings** with a clear status per file:
   - ✅ **Accurate** — file is current and reflects reality
   - ⚠️ **Minor drift** — small inaccuracies that should be fixed
   - ❌ **Stale** — file is significantly out of date and needs rewriting
   - ❓ **Cannot verify** — lacked evidence to confirm (state what evidence was needed)

7. **Provide recommendations**: For each issue found, suggest the concrete action needed (e.g., "Update `design.md` — module X was renamed to Y", "Remove reference to deleted `specs/` folder from `context_guide.md`").

## Audit Rules

- Be conservative — if you cannot verify a claim confidently, mark it as "cannot verify" rather than wrong
- Do not modify any `.context` files during this audit unless the user explicitly asks you to fix issues
- Focus on facts that matter for agent accuracy — minor formatting issues are not audit findings
- Check that `coding_rules.md` reflects the actual testing commands, lint commands, and build tools used

## Output Format

```
# Context Review: {{PROJECT_NAME}}

## Summary
- **Files checked**: X
- **Accurate**: X
- **Minor drift**: X
- **Stale**: X
- **Cannot verify**: X

## Per-File Results
### project_brief.md — ✅ / ⚠️ / ❌ / ❓
...

## Cross-Reference Issues
...

## Recommendations
1. ...
2. ...
```
