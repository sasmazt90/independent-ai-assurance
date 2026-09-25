# Security

This MVP has no backend, credentials, external AI calls or real customer information. Evaluation requests are Zod-validated. UI rendering uses React text nodes and does not use `dangerouslySetInnerHTML`. Browser local storage is a demo persistence mechanism, not a secure evidence store.

Before production: enforce tenant and role authorization server-side; isolate organizations; protect secrets; use encrypted evidence storage and transport; validate uploads; add retention/deletion workflows; make audit events append-only and tamper-evident; rate-limit and monitor services; review dependencies and run security testing; threat-model integrations and evaluation workers; document incident handling and privacy responsibilities.
