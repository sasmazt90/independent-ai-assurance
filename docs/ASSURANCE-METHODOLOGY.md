# Assurance Methodology

This MVP presents evidence-linked evaluation, monitoring and release review. It does not certify systems or make legal-compliance determinations. Seeded test results are examples, not results from live systems.

The domain chain connects framework version and requirement, explicit mapping, master control/version, evaluation procedure, test case/result, evidence and finding. Finding state changes are validated and recorded as audit events. The seed contains the Medical HCP Assistant comparison (v3.7 to v3.8), including hallucination 1.8% to 4.7%, injection resistance 96 to 93, fairness indicator 77 to 72, and seeded sensitive-disclosure PASS.

Assurance score, coverage, confidence and risk are separate calculations. Confidence combines test coverage, evidence quality, sample size, evaluator reliability, freshness and repeatability. Risk uses likelihood, impact, data exposure, autonomy, affected-user count and reversibility. These demo formulas are not calibrated operational risk models.

Monitoring regression uses an explicit direction on each metric. A change exactly equal to the configured adverse threshold is classified as a regression (`>=` for lower-is-better increases, `<=` for higher-is-better decreases).
