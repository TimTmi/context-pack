# Context Hygiene Reference

## Good Practices

✅ **Write concisely**: Bullets, tables, short paragraphs
✅ **Cross-reference**: Link to related files instead of duplicating content
✅ **Remove stale info**: When implementation reality differs from a context file, fix it
✅ **Precise file ownership**: Put API details in `api_spec.md`, not `design.md`
✅ **Keep budget**: `project_brief.md`, `progress.md`, `roadmap.md` should fit one page each

## Bad Practices

❌ **Code dumps**: Don't paste generated code, logs, or command output into context files
❌ **Duplication**: Don't repeat the same fact in multiple files
❌ **Speculation**: Don't write plans as if they're implemented facts
❌ **Stale plans**: Don't keep sections that describe a world that no longer exists
❌ **Over-documentation**: Don't document implementation details that agents can read directly from code

## When to Update Each File

| Event | File to update |
|---|---|
| Milestone completed | `progress.md` |
| Blocker encountered | `progress.md` |
| Next task changes | `progress.md` |
| New endpoint wired | `api_spec.md` |
| Schema/entity changes | `data_models.md` |
| Architecture changes | `design.md`, `decisions.md` |
| New decision made | `decisions.md` |
| Roadmap priority shift | `roadmap.md` |
| New coding convention | `coding_rules.md` |
| Scope/stack changes | `project_brief.md` |
