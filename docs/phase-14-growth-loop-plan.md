# Phase 14 Plan: Growth loop hardening (blog -> CTA -> signup)

## Goal

Increase conversion from content engagement to account creation with measurable attribution.

## Scope

- Improve blog CTA placement/copy and source tracking consistency.
- Strengthen transition from blog/session intent to signup.
- Validate improvements with controlled rollouts and event deltas.

## Workstreams

1. Funnel diagnostics
   - Map drop-off across `blog_read_complete`, helpful votes, CTA clicks, and signup starts/completions.
2. CTA optimization
   - Test copy and placement variants on high-traffic articles and listing surfaces.
3. Attribution quality
   - Standardize `source`/context params across blog, dashboard, editor, and interview entry points.

## Acceptance criteria

- `cta_signup` conversion from blog sessions improves by >= 12% vs baseline.
- Attribution coverage >= 95% for tracked signup CTA events.
- No degradation in helpful-vote sentiment ratio while increasing CTA activity.
