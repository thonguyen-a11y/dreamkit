# Implementation Plan: Admin Discount Code Management

**Branch**: `001-admin-discount-codes` | **Date**: 2026-07-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-admin-discount-codes/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add an admin-only page where an admin can create, list, search, edit, enable/disable,
and delete discount codes, with a computed status (Scheduled/Active/Expired/Exhausted/
Disabled) shown per code. Implemented as a new `discount-codes` domain following the
existing `products`/`contacts`/`users` admin pattern already in this repo: a pure
domain-logic module, a REST API client module talking to the existing NestJS backend,
an admin manager component, and an admin route page, wired into the existing admin nav.

## Technical Context

**Language/Version**: TypeScript (strict mode) on Next.js 16 (App Router), React 19

**Primary Dependencies**: react-hook-form + zod (already a dependency, used for form
validation elsewhere in the app), Tailwind CSS v4, existing local UI primitives in
`components/ui` — no new dependency is introduced

**Storage**: N/A in this repo — discount codes are persisted by the existing external
NestJS backend via REST (`/api/discount-codes`), the same way products/contacts/users
already are; this repo only implements the frontend admin UI and API client

**Testing**: vitest + @testing-library/react, matching existing `lib/*.test.ts` /
`components` test conventions (e.g. `lib/product-admin.test.ts`)

**Target Platform**: Web browser (statically-exported Next.js app), admin-only route

**Project Type**: Web application — frontend-only in this repository (single Next.js
project); the backend REST API is an existing external system, not part of this repo

**Performance Goals**: Admin route JS payload stays within the 250KB gzipped admin
budget (Constitution Principle II); no heavy new dependency added

**Constraints**: Route must be gated by the existing `AdminGuard`/admin role check;
discount code status must always be computed from current date/time + rules rather
than stored, per spec FR-008

**Scale/Scope**: Single admin page (list + create/edit form), expected tens to a few
hundred discount codes — no pagination requirement beyond what search/filter already
provides

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Feature-First, Domain-Driven Architecture)** — PASS. New `discount-codes`
  domain gets its own files: `lib/discount-codes.ts` (domain logic/validation, no
  framework imports), `lib/discount-codes-api.ts` (data access, depends only on the
  shared `lib/api-client.ts`), `components/admin/discount-code-manager.tsx` (UI, depends
  on the two lib modules), `app/admin/discount-codes/page.tsx` (routing, depends only on
  the manager + `AdminShell`). Dependencies point inward; nothing in `lib/` imports from
  `app/` or from component internals.
- **Principle II (Performance Budget & Lazy-Loading)** — PASS. No new dependency is
  added; the admin manager component follows the same non-lazy pattern already used by
  `product-manager.tsx`/`contact-manager.tsx`/`user-manager.tsx` (client component
  rendered directly by its page, no `next/dynamic` wrapper), keeping the change
  consistent with the rest of the admin area and within the existing budget headroom.
- **Principle III (SEO & Discoverability)** — N/A / consistent with existing pattern.
  Admin routes are not public/indexable and only set a page `<title>` today (no OG/JSON-LD,
  no explicit `robots: noindex`). This feature follows that same existing convention
  rather than introducing a new, inconsistent metadata treatment; retrofitting
  `noindex` across the admin area is a separate, repo-wide concern out of scope here.
- **Principle IV (Observability)** — PASS (deferred to backend). Business-event logging
  and error monitoring for the mutation endpoints are the responsibility of the existing
  NestJS backend, matching how products/contacts/users mutations are already handled;
  no new server-side handler is added in this repo.
- **Principle V (CI/CD Quality Gates)** — PASS. Implementation will keep `tsc --noEmit`,
  `eslint`, `vitest run`, and `next build` green, matching existing scripts.
- **Technology Stack note**: The constitution calls for React Query (server state) and
  Zustand (client UI state). The existing codebase does not use either anywhere yet —
  every admin manager (`product-manager.tsx`, `contact-manager.tsx`, `user-manager.tsx`)
  fetches with a plain `useState`/`useEffect` pair against a hand-rolled `lib/*-api.ts`
  client. This feature follows that same, already-established pattern for consistency
  with its sibling admin domains rather than introducing React Query for one feature in
  isolation. See Complexity Tracking below.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
lib/
├── types.ts                       # add DiscountCode, DiscountType, DiscountCodeStatus
├── discount-codes.ts               # domain logic: normalize, validate, computeStatus
├── discount-codes.test.ts          # unit tests for the above
├── discount-codes-api.ts           # REST client: list/create/update/delete against
│                                    # the existing NestJS backend
└── discount-codes-api.test.ts      # unit tests for API mapping/error handling

components/admin/
└── discount-code-manager.tsx       # list + create/edit form, mirrors product-manager.tsx

app/admin/discount-codes/
└── page.tsx                        # route: AdminShell + DiscountCodeManager

components/admin/
└── admin-nav.tsx                   # add a "Mã giảm giá" link (existing file, edited)
```

**Structure Decision**: Single Next.js project (this repo is the frontend only; the
discount-codes REST API is assumed to already exist on the external NestJS backend,
the same assumption already made for `products`, `contacts`, and `users`). The feature
is added as its own domain slice under `lib/` + `components/admin/` + `app/admin/`,
following Principle I, with no changes needed to unrelated domains besides registering
the new nav link.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------------------|
| Plain `useState`/`useEffect` data fetching instead of React Query (constitution's Technology Stack section) | Every existing admin manager (products, contacts, users) already uses this hand-rolled pattern; there is no React Query provider set up anywhere in the app yet | Introducing React Query for just this one new feature would create two competing server-state patterns side by side in the same admin area, which is a larger, cross-cutting migration decision (affecting 4+ existing files) that belongs in its own dedicated effort, not bundled into a single CRUD page |
