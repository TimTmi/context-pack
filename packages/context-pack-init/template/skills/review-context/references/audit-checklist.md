# Context Audit Checklist

Use these checks during a `review-context` run.

## File Existence
- [ ] `context_guide.md` exists and references only files that exist
- [ ] `project_brief.md` exists
- [ ] `original_requirements.md` exists (optional — may not be present)
- [ ] `design.md` exists
- [ ] `data_models.md` exists
- [ ] `api_spec.md` exists
- [ ] `coding_rules.md` exists
- [ ] `roadmap.md` exists
- [ ] `progress.md` exists
- [ ] `decisions.md` exists

## Content Quality
- [ ] `project_brief.md` is under 1 page
- [ ] `progress.md` is under 1 page
- [ ] `roadmap.md` is under 1 page
- [ ] No file contains code dumps or long command output
- [ ] No file repeats information from another file (prefer cross-references)
- [ ] All paths mentioned in `.context` files actually exist in the repo
- [ ] `coding_rules.md` matches actual lint/test/build commands used

## Cross-File Consistency
- [ ] Entities in `data_models.md` match schema/migrations/ORM models
- [ ] Endpoints in `api_spec.md` match route/controller files
- [ ] Architecture in `design.md` matches actual project structure
- [ ] Decisions in `decisions.md` are not contradicted by current code
- [ ] Progress claims match actual git history or file timestamps
