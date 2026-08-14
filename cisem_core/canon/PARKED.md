# PARKED

**Purpose:** Deferred items, held with their reason and their unblocking condition.
**Read by:** `A.4.12` (E12) — the gate scans proposed next-steps against this file and rejects matches.
**Rule:** an item is parked only with a reason and a condition. "Later" is not a condition.

**Format — one block per item, machine-scannable:**

```
## PARK-nnn — title
address:   canon address, or NEW
parked:    date
reason:    why not now
unblocks:  the condition that makes it ready
keywords:  terms the gate matches proposed work against
```

---

## PARK-001 — Onboarding wizard and TTV chain
```
address:   E.5.02
parked:    2026-08-12
reason:    Requires a tenant boundary that is enforced, not merely built.
           Designing an onboarding flow onto localStorage produces a
           workspace that dies when a browser is cleared.
unblocks:  C.5.06 done (key swap) AND B.5.03 done (middleware)
keywords:  onboarding, wizard, time-to-value, TTV, aha moment, first project,
           signup flow, welcome
```

## PARK-002 — Stripe and billing
```
address:   D.5.xx (unassigned)
parked:    2026-08-12
reason:    No tier model exists to bill against (D.3.01). Billing before
           entitlement is billing for an undefined thing.
unblocks:  D.5.01 done (tier model defined and populated)
keywords:  stripe, billing, subscription, payment, webhook, dunning, invoice
```

## PARK-003 — Public template gallery
```
address:   D.5.10
parked:    2026-08-12
reason:    Acquisition surface for a product with no customers and no
           built product surface. Also requires a ratified decision on
           pre-login canonical visibility (C.2.04 is currently
           authenticated-only, by explicit choice).
unblocks:  E.5.01 done (a product surface exists) AND C.2.04 revisited
keywords:  public gallery, template marketplace, SEO landing, pre-login
```

## PARK-004 — SSO / SAML
```
address:   NEW
parked:    2026-08-12
reason:    Enterprise identity federation before a single paying customer.
unblocks:  a named enterprise prospect requires it
keywords:  sso, saml, okta, azure ad, identity federation, scim
```

## PARK-005 — White-labelling and custom subdomains
```
address:   NEW
parked:    2026-08-12
reason:    WhitelabelView is a UI mock with a client-side tier toggle
           (F.3.10). The feature is not built; the gate that protects it
           reads a forgeable source (D.3.04).
unblocks:  first enterprise deal AND D.5.02 done
keywords:  whitelabel, white-label, custom domain, subdomain, vanity url,
           custom branding
```

## PARK-006 — Tenant API keys and webhooks
```
address:   NEW
parked:    2026-08-12
reason:    Exposing an API surface before the tenant boundary is enforced
           multiplies the blast radius of any isolation defect.
unblocks:  C.6.02 VERIFIED (E5 green)
keywords:  api key, tenant api, webhook, developer api, rate limit
```

## PARK-007 — Mobile application
```
address:   NEW
parked:    2026-08-12
reason:    Web is unvalidated. A second client on an unproven product
           doubles the surface and halves the attention.
unblocks:  web validated with a real customer
keywords:  mobile app, ios, android, react native, expo
```

## PARK-008 — Terminal command allowlist cleanup (923 entries)
```
address:   A.2.20
parked:    2026-08-12
reason:    Inert while Terminal Auto Execution is Always Proceed. Editing
           the config would require reopening the workspace boundary to
           tidy something that currently grants nothing.
unblocks:  Terminal Auto Execution returns to Require Review — at which
           point 923 pre-approved commands would silently bypass it
keywords:  terminal allowlist, 923, command permissions, antigravity settings
```

## PARK-009 — Community template contributions
```
address:   NEW
parked:    2026-08-12
reason:    Marketplace dynamics require a population. Also depends on
           D.3.02 (two template stores, no declared authority).
unblocks:  50+ active tenants AND D.5.03 done
keywords:  community templates, marketplace, template sharing, curation
```

## PARK-010 — Generic PM feature expansion
```
address:   F.5.10
parked:    2026-08-12
reason:    Whether this surface survives at all is undecided. Building on
           it before F.5.10 is answered risks investing in something
           scheduled for retirement.
unblocks:  F.5.10 answered
keywords:  kanban, gantt, calendar view, task board, swimlane, sprint,
           project management features
```

---

## Unparking

An item leaves this file when its `unblocks` condition is met. Unparking is a decision — it gets a `.2` stage record in the relevant spine, and the block here is deleted with a note of the address that superseded it.

**An item may not be unparked because it became convenient.** Only because its stated condition is met.
