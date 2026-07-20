# Init Context Workflow Reference

## Question Bank

When initializing context, collect information in this order:

1. **Project Identity**
   - Project name

2. **Project Goal**
   - One-paragraph elevator pitch

3. **Tech Stack**
   - Languages, frameworks, databases, infrastructure, deployment

4. **Core Features**
   - 3-6 bullet points covering the main user-facing capabilities

5. **Architecture**
   - Monolith, microservices, modular monolith, serverless?
   - Key components and their responsibilities
   - Communication patterns (REST, GraphQL, message queues, events)

6. **Data Models**
   - Primary datastore(s)
   - Main entities and their relationships
   - Key constraints and indexes

7. **API Contracts**
   - Protocol (REST, GraphQL, gRPC)
   - Known endpoints (method, path, purpose)
   - Auth mechanisms

8. **Coding Rules**
   - Language/framework conventions
   - Testing approach and commands
   - Lint/format config

9. **Current Status**
   - Completed work
   - In-progress work
   - Known blockers
   - Next steps

10. **Roadmap Phases**
    - Major phases planned
    - What's been delivered vs what's coming

11. **Key Decisions**
    - Architecture decisions made so far
    - Tradeoffs accepted
    - Rejected alternatives

## Template File Mapping

| User answer | Template file(s) |
|---|---|
| Project name | All templates (placeholder) |
| Project goal | `project_brief.md` |
| Tech stack | `project_brief.md`, `coding_rules.md` |
| Core features | `project_brief.md`, `roadmap.md` |
| Architecture | `design.md`, `context_guide.md` |
| Data models | `data_models.md` |
| API contracts | `api_spec.md` |
| Coding rules | `coding_rules.md` |
| Current status | `progress.md` |
| Roadmap | `roadmap.md` |
| Key decisions | `decisions.md` |
