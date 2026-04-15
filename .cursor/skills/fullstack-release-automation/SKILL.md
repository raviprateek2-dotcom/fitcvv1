---
name: fullstack-release-automation
description: Execute a full-stack release workflow for Next.js + Firebase + Vercel projects: scope changes, run focused checks, fix failing tests/builds, validate deployment readiness, and report release status. Use when users ask to "proceed", "ship", "deploy", "fix CI", "fix Vercel", or request end-to-end implementation with automation.
---

# Fullstack Release Automation

## Goal

Ship changes quickly with safe automation:
- implement requested code changes
- run targeted validation first, then full quality gates
- fix breakages with minimal churn
- deploy and verify production status

## Default Behavior

Use **balanced automation**:
1. Execute routine checks automatically.
2. Ask before destructive or high-risk actions.
3. Keep user informed with short progress updates.

## Workflow

Copy this checklist and update progress while working:

```text
Release Progress
- [ ] 1) Confirm scope and branch state
- [ ] 2) Implement changes
- [ ] 3) Run focused validation
- [ ] 4) Run full quality gates
- [ ] 5) Fix failures and re-run
- [ ] 6) Prepare deploy (Vercel/CI settings)
- [ ] 7) Deploy and verify live status
- [ ] 8) Summarize outcome and next actions
```

## 1) Confirm Scope and Branch State

- Check current branch, diff, and uncommitted files.
- Avoid touching unrelated files.
- If deployment is requested, verify project linkage (`.vercel/project.json`) and target project/domain.

## 2) Implement Changes

- Make the smallest coherent change set.
- Prefer existing project patterns over introducing new architecture.
- Add or update tests with behavioral changes.

## 3) Run Focused Validation (Fast Feedback)

Run checks closest to modified areas first, for example:
- targeted Jest test file
- specific Playwright spec
- TypeScript check on impacted modules

Only after focused checks pass, continue to full gates.

## 4) Run Full Quality Gates

Typical order for this stack:

```bash
npm run lint
npm run typecheck
npm test
npx playwright test
npm run build
```

If CI defines extra checks (Lighthouse, template contract tests), run or validate equivalent locally when feasible.

## 5) Fix Failures and Re-run

- Fix root cause, not symptom.
- Re-run the failed step first, then full suite if needed.
- For CI-only failures:
  - verify missing secrets/env vars
  - verify install mode includes dev dependencies when required
  - verify project IDs/tokens for deployment providers

## 6) Prepare Deploy (Vercel + CI)

- Ensure CI deploy step uses expected target project/org.
- Ensure required secrets exist (at minimum token for authenticated deploy).
- Confirm no stale deployment provider mismatch (e.g., Firebase vs Vercel).

For Vercel-specific troubleshooting:
- verify latest deployment state (READY/CANCELED/ERROR)
- inspect build logs for the failed deployment
- redeploy from CLI only when requested or when equivalent to requested action

## 7) Deploy and Verify Live Status

After deploy:
- confirm deployment state is `READY`
- confirm correct project and domain aliases
- confirm commit SHA/ref matches intended branch/commit
- verify critical user-facing pages load

Report exact:
- deployment URL
- deployment ID
- target (`production`/`preview`)
- commit SHA/ref

## 8) Final Response Format

Use this structure:

```markdown
Implemented <what changed>.

- Validation: <passed/failed + key commands>
- Deployment: <status + id + url + target>
- Risks/Follow-ups: <if any>
- Next: <one clear next step>
```

## Safety Rules

- Never run destructive git commands unless user explicitly asks.
- Never expose secrets/tokens in logs or responses.
- Do not claim deployment success without a verifiable `READY` state.
- If blocked by external credentials or permissions, stop and provide exact remediation steps.
