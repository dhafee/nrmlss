# NRMLSS product schema

## Layers

1. **Auth** — Better Auth `user` / `session` / `account` / `verification`
2. **Profile & devices** — app profile + paired Band hardware
3. **Catalog** — domains, biomarkers, lab panels (global, not per-user)
4. **Continuous health** — daily snapshots, metric readings, domain status, timeline
5. **Labs** — orders → results → per-biomarker values
6. **Coach / care** — insights + care-share links

## Key tables

| Table | Purpose |
|-------|---------|
| `profile` | User preferences / onboarding |
| `device` | Paired NRMLSS Band |
| `domain` | Hormones, Sleep, Heart, … |
| `biomarker` | Catalog entry (`continuous` \| `lab` \| `derived`) |
| `domain_biomarker` | Which markers show in which domain |
| `lab_panel` | Advanced Labs offerings |
| `lab_panel_biomarker` | Panel contents |
| `daily_snapshot` | Today / Recovery hero metrics (1 row per user/day) |
| `metric_reading` | Time-series values for any biomarker |
| `domain_status` | Good / Watch / Caution per domain/day |
| `timeline_event` | Recovery timeline entries |
| `lab_order` | Scheduled / completed draws |
| `lab_result` | Result header for an order |
| `lab_result_value` | Individual lab values |
| `insight` | Coach actions & alerts |
| `care_share` | Shareable care summaries |

## Commands

```bash
pnpm db:push
pnpm db:seed
pnpm db:studio
```
