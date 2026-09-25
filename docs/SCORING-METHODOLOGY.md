# Scoring Methodology

The deterministic assurance score starts at 100 and subtracts configured deductions for failed results by severity, review-required results and controls without evidence. Rules live in `src/lib/scoring`; the score is bounded at zero. The waterfall is generated from those deduction records.

Framework coverage is calculated from mapped controls and current test results. The current implementation does not fully account for system-type applicability, NOT_APPLICABLE statuses or evidence sufficiency as separate coverage statuses. Confidence is calculated separately from coverage, evidence quality, sample sufficiency, evaluator reliability, freshness and repeatability. Risk is calculated independently using contextual factors and is not derived from the assurance score.
