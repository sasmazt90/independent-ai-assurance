# Assurance Methodology

## Purpose and independence

Provide repeatable, evidence-linked assessments of systems operated by others. The platform does not implement or optimize assessed systems and does not claim certification authority.

## Scope and classification

Register intended purpose, system type, deployment context, owner, users, affected groups, data sensitivity, autonomy, reversibility, dependencies and lifecycle status. Applicability is contextual and requires accountable human review.

## Taxonomy and testing

Controls span governance, risk, data governance, transparency, human oversight, reliability, safety, security, privacy, fairness, accuracy, robustness, documentation, traceability and lifecycle monitoring. Evaluation methods may be rule-based, reference-based, model-based, statistical, human or hybrid. Test results are bounded observations, not proof of legal compliance.

## Evidence and findings

Record test inputs, outputs, traces, evaluator/version, timestamp, system version, sample size and evidence provenance. Findings link to affected system versions, controls, evidence, severity, owner, status and remediation. Severity considers impact, likelihood, scope, data sensitivity, autonomy, affected users and reversibility. Confidence is separate from risk and depends on test coverage, evidence quality, sample size, evaluator reliability, freshness and repeatability.

## Scoring

Demo assurance score is deterministic: weighted average of control-domain performance on a 0–100 scale, with configured category weights and explicit failing/review deductions. It is an operational summary, not a regulatory standard. Risk is assessed separately. Coverage = applicable controls with a current result / applicable controls. Confidence describes strength of supporting evidence and is not added to risk.

## Monitoring and release

Monitor model, prompt, data, knowledge base, configuration and tool changes. Compare current results with a recorded baseline. Gate policy can block on unresolved critical findings, stale required evaluations or missing human review. Overrides require owner, rationale, expiry and an audit record. Human judgment remains necessary for applicability, fairness, oversight, risk acceptance and high-impact remediation.

## Framework mapping and limits

Map requirements to normalized master controls using versioned framework records. Preserve historical framework versions. Summaries are not legal interpretations. Unverified mappings must be marked for source validation. No assessment language implies legal advice, regulatory approval or certification.
