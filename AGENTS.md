# AGENTS.md — ZutaLevana AI Agent Guide

This file is the single entry point for any AI assistant (Copilot, Claude, Cursor, etc.) working in this repository. Read it before touching any code.

---

## Domain Routing Table

| If the request touches… | Read this file first |
|---|---|
| UI components, hooks, state, styling, animations, contact form | [`src/DOMAIN_ARCHITECTURE.md`](src/DOMAIN_ARCHITECTURE.md) |
| Translation strings, i18n keys, gallery/menu data, static assets | [`src/i18n/DOMAIN_ARCHITECTURE.md`](src/i18n/DOMAIN_ARCHITECTURE.md) |
| REST API routes, request validation, lead submission logic | [`DOMAIN_ARCHITECTURE_API.md`](DOMAIN_ARCHITECTURE_API.md) |
| Database schema, migrations, SQL queries | [`DOMAIN_ARCHITECTURE_DB.md`](DOMAIN_ARCHITECTURE_DB.md) |
| Top-level architecture, deployment, infrastructure | [`ARCHITECTURE.md`](ARCHITECTURE.md) |

---

## AI AGENT WORKFLOW PROTOCOL

No matter which AI assistant is running this session (Copilot, Claude, Cursor, etc.), whenever you are asked to implement a feature, fix a bug, or refactor code, you MUST follow this exact sequence:

1. **Context Gathering:** Identify which domain(s) the request touches. Read the corresponding `DOMAIN_ARCHITECTURE.md` file(s) listed in the Routing Table above.
2. **Execution:** Write the code, update tests, and implement the requested changes.
3. **Architecture Drift Check:** Before completing the task, analyze your changes:
   - Did you introduce a new dependency?
   - Did you alter the data flow or state management?
   - Did you cross or move a migration boundary?
4. **Documentation Update:** If the answer to any question in Step 3 is YES, you MUST update the relevant `DOMAIN_ARCHITECTURE.md` file (and this `AGENTS.md` routing table if a new domain was created) to reflect reality. Do not ask for permission; do this autonomously as part of the commit/save process.
