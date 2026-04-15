# Phase 13 Plan: Performance budget tightening and route remediation

## Goal

Raise performance quality bars safely after Phase 11 confirms stable headroom.

## Scope

- Tighten Lighthouse thresholds where data supports stricter limits.
- Remediate slowest routes first (highest user impact and traffic).

## Workstreams

1. Budget tightening pass
   - Review LHCI trends and web vital distributions.
   - Update `lighthouserc.json` thresholds with rationale.
2. Route-level remediation
   - Prioritize routes with worst p75 LCP/INP.
   - Reduce JS/asset cost and interaction latency on these routes.
3. Regression guardrails
   - Add/adjust CI checks only after route fixes land.

## Acceptance criteria

- LCP and INP p75 improve on top 3 slowest routes.
- Updated Lighthouse budgets pass on `main` for 3 consecutive CI runs.
- No accessibility/SEO regressions from performance changes.
