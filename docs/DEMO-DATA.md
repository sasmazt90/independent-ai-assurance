# Demo Data

`src/data/demo/index.ts` centralizes organizations, systems, framework versions and requirements, mappings, controls, evaluation procedures, tests, results, findings, evidence, metrics, policies and audit seed records. The primary scenario is Demo Healthcare GmbH and Medical HCP Assistant v3.7 → v3.8. Seeded values: hallucination 1.8% → 4.7%, prompt-injection resistance 96 → 93, fairness indicator 77 → 72, and sensitive disclosure PASS. Seeded policy rules block release on regression or unresolved high-severity findings and require review for human-review outcomes.

Alpine Bank has separate organization, system, finding, evidence, evaluation and release policy records. Browser repositories filter findings and evidence by organization. Some workflows remain demo-only, and persisted state is browser-local rather than held in a tenant-aware server repository.

Monitoring metrics carry explicit `HIGHER_IS_BETTER` or `LOWER_IS_BETTER` direction metadata; semantics are not inferred from display labels.
