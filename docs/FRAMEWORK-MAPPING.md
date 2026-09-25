# Framework Mapping

Framework records are data, not UI logic. Each record carries stable ID, name, version, status, issuer, source URL, publication metadata and source validation status. Requirement summaries and mappings can be added without changing prior assessment snapshots.

Initial families include EU AI Act (Regulation (EU) 2024/1689), ISO/IEC 42001:2023, ISO/IEC 23894:2023, NIST AI RMF 1.0, NIST Generative AI Profile (NIST AI 600-1), OWASP Top 10 for LLM Applications, and draft OWASP Agentic AI mapping. Public source metadata is linked from the framework catalog in `src/data/demo.ts`.

EU AI Act themes include risk management, data governance, technical documentation, logging, transparency, human oversight, accuracy, robustness, cybersecurity, quality management and post-market monitoring. These are summarized themes, not reproduced legal requirements. NIST function mappings are Govern, Map, Measure and Manage; trustworthiness concepts include validity/reliability, safety, security/resilience, accountability/transparency, explainability, privacy and fairness. OWASP mappings are summaries only.

ISO records use public metadata only. Clause-level mappings require licensed source validation and must remain `REFERENCE_REQUIRES_VALIDATION` until reviewed. All unvalidated mapping summaries set `needsSourceValidation: true`. Draft, active, superseded and retired statuses preserve standards evolution. No proprietary ISO content is copied.
