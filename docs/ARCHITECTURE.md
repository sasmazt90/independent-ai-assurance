# Architecture

## Layers

- `src/domain`: typed assurance entities.
- `src/data/demo.ts`: deterministic, centralized demo records and product configuration.
- `src/repositories`: repository boundary and local browser persistence.
- `src/services`: validated evaluation orchestration and future framework update interface.
- `src/i18n`: English, German and Turkish message dictionaries.
- `src/App.tsx`: application shell and page composition.

The repository boundary is replaceable by a PostgreSQL/Supabase implementation. The demo evaluation service intentionally calls no external model. Zod validates evaluation inputs. Authentication is represented as a session UI concept only and is not production security.

## Data flow

UI action → typed service/repository → state update → local demo persistence → audit event. Framework records have stable IDs and versions; a future framework update service should propose a new draft and preserve historical snapshots rather than overwrite published mappings.

## Security and privacy

No secrets or customer prompts are included. Local storage contains only synthetic demo workflow state. Production use requires server-side authorization, tenant isolation, encryption, retention policy, signed evidence storage, audit integrity and threat modeling.
