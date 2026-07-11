---

description: "Task list for admin discount code management"
---

# Tasks: Admin Discount Code Management

**Input**: Design documents from `/specs/001-admin-discount-codes/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/discount-codes-api.md, quickstart.md

**Tests**: Included — this repo has an established `lib/*.test.ts` unit-test convention for every sibling admin domain (`product-admin.test.ts`, `products-api.test.ts`, `contacts-api.test.ts`, `users-api.test.ts`), so discount-codes follows the same pattern.

**Organization**: Tasks are grouped by user story (from spec.md: US1 = create, US2 = view/monitor, US3 = edit/delete) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Paths are relative to the repository root (this is a single Next.js project — see plan.md Structure Decision)

---

## Phase 1: Setup

**Purpose**: Add the shared type definitions every later task depends on

- [X] T001 Add `DiscountType` (`"percentage" | "fixed"`), `DiscountCodeStatus` (`"scheduled" | "active" | "expired" | "exhausted" | "disabled"`), and `DiscountCode` interface to `lib/types.ts`, per the field table in `specs/001-admin-discount-codes/data-model.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain logic, API client, and routing scaffold that every user story builds on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Create `lib/discount-codes.ts` with module scaffolding and exported (initially throwing/TODO) signatures for `normalizeDiscountCode`, `validateDiscountCode`, `computeDiscountCodeStatus`, `upsertDiscountCode`, `deleteDiscountCode`, mirroring the shape of `lib/product-admin.ts`
- [X] T003 [P] Create `lib/discount-codes-api.ts` with the `ApiDiscountCode` type, `mapApiDiscountCodeToDiscountCode`, and scaffolding for `fetchDiscountCodesApi`, `createDiscountCodeApi`, `updateDiscountCodeApi`, `deleteDiscountCodeApi`, using `apiFetch`/`authHeaders` from `lib/api-client.ts` per `specs/001-admin-discount-codes/contracts/discount-codes-api.md`
- [X] T004 Create `app/admin/discount-codes/page.tsx` rendering `AdminShell` + `DiscountCodeManager`, with `metadata.title = "Mã giảm giá — Admin Dreamkit"`, matching `app/admin/contacts/page.tsx`
- [X] T005 Add a `{ href: "/admin/discount-codes/", label: "Mã giảm giá" }` entry to `ADMIN_LINKS` in `components/admin/admin-nav.tsx`
- [X] T006 Create `components/admin/discount-code-manager.tsx` skeleton: `"use client"` component using `useAuthModal()` for `accessToken`, `useState`/`useEffect` to load codes via `fetchDiscountCodesApi` on mount, loading/error/empty states, matching the shape of `components/admin/contact-manager.tsx`

**Checkpoint**: Types, domain module, API client, and an empty (but loading) admin page all exist — user story implementation can now begin

---

## Phase 3: User Story 1 - Create a discount code (Priority: P1) 🎯 MVP

**Goal**: An admin can submit a new, valid discount code and see it appear in the list; invalid/duplicate submissions are rejected with clear errors

**Independent Test**: Open `/admin/discount-codes/`, submit a unique code with a valid type/value, confirm it appears; retry with a duplicate code or out-of-range value and confirm a field error appears with no new record created

### Tests for User Story 1

- [X] T007 [P] [US1] Unit tests in `lib/discount-codes.test.ts` for `normalizeDiscountCode` (trim + uppercase) and `validateDiscountCode` covering: required code, case/whitespace-insensitive duplicate detection, percentage range 1–100, non-negative fixed amount, and expiry-before-start rejection (FR-002, FR-003, FR-007)
- [X] T008 [P] [US1] Unit tests in `lib/discount-codes-api.test.ts` for `createDiscountCodeApi` covering success mapping (`_id` → `id`) and `409`/`400` error passthrough, mocking `apiFetch`

### Implementation for User Story 1

- [X] T009 [US1] Implement `normalizeDiscountCode` and `validateDiscountCode` in `lib/discount-codes.ts` per the validation rules in `specs/001-admin-discount-codes/data-model.md` (depends on T002, T007)
- [X] T010 [US1] Implement `createDiscountCodeApi` in `lib/discount-codes-api.ts`, `POST /api/discount-codes` (depends on T003, T008)
- [X] T011 [US1] Add a create form to `components/admin/discount-code-manager.tsx`: fields for code, description, discount type, value, min order amount, start/expiry dates, max uses, per-customer limit; on submit, run `validateDiscountCode`, show field errors, else call `createDiscountCodeApi` and show a success/failure message (mirrors the form pattern in `components/admin/product-manager.tsx`) (depends on T006, T009, T010)
- [X] T012 [US1] On successful create, prepend/insert the new code into the manager's local list state so it's visible without a full reload (depends on T011)

**Checkpoint**: User Story 1 is fully functional and independently testable — an admin can create codes and see validation errors

---

## Phase 4: User Story 2 - View and monitor discount codes (Priority: P2)

**Goal**: An admin sees every discount code with a correctly computed status and can search the list

**Independent Test**: Seed codes covering all five statuses (scheduled/active/expired/exhausted/disabled) and confirm each renders the correct status label; type into search and confirm the list filters by code/description

### Tests for User Story 2

- [X] T013 [P] [US2] Unit tests in `lib/discount-codes.test.ts` for `computeDiscountCodeStatus`, one case per status (`disabled`, `expired`, `exhausted`, `scheduled`, `active`) and precedence between them, per the derivation rules in `specs/001-admin-discount-codes/data-model.md` (FR-008)
- [X] T014 [P] [US2] Unit tests in `lib/discount-codes-api.test.ts` for `fetchDiscountCodesApi` covering success mapping of a list response and failure passthrough

### Implementation for User Story 2

- [X] T015 [US2] Implement `computeDiscountCodeStatus` in `lib/discount-codes.ts` (depends on T002, T013)
- [X] T016 [US2] Implement `fetchDiscountCodesApi` in `lib/discount-codes-api.ts`, `GET /api/discount-codes` (depends on T003, T014)
- [X] T017 [US2] Render the discount codes table in `components/admin/discount-code-manager.tsx` with columns for code, type/value, validity dates, usage (`usedCount` / `maxUses`), and a computed status badge using `computeDiscountCodeStatus`, matching the table style in `components/admin/product-manager.tsx` (depends on T011, T015, T016)
- [X] T018 [US2] [P] Add a search input above the table in `components/admin/discount-code-manager.tsx` that filters the rendered rows by `code` or `description` substring (FR-009) (depends on T017)

**Checkpoint**: User Stories 1 AND 2 both work independently — codes can be created and the full list is visible, correctly statused, and searchable

---

## Phase 5: User Story 3 - Edit or remove a discount code (Priority: P3)

**Goal**: An admin can edit an existing code's rules/active flag, or delete it, with a stronger confirmation when it has already been used

**Independent Test**: Edit an existing code's value/dates and confirm the row updates; delete a code with `usedCount === 0` and confirm it disappears with standard confirmation; delete a code with `usedCount > 0` and confirm a stronger warning appears first

### Tests for User Story 3

- [X] T019 [P] [US3] Unit tests in `lib/discount-codes-api.test.ts` for `updateDiscountCodeApi` (`PATCH`) and `deleteDiscountCodeApi` (`DELETE`, expects `204`) covering success and error passthrough

### Implementation for User Story 3

- [X] T020 [US3] Implement `updateDiscountCodeApi` and `deleteDiscountCodeApi` in `lib/discount-codes-api.ts` per `specs/001-admin-discount-codes/contracts/discount-codes-api.md` (depends on T003, T019)
- [X] T021 [US3] Add an edit action to each row in `components/admin/discount-code-manager.tsx` that loads the code into the existing create/edit form (reusing `validateDiscountCode`) and calls `updateDiscountCodeApi` on submit instead of create (depends on T011, T017, T020)
- [X] T022 [US3] Add a delete action to each row in `components/admin/discount-code-manager.tsx`: `window.confirm` with the standard message when `usedCount === 0`, and a stronger message noting historical usage when `usedCount > 0`, then call `deleteDiscountCodeApi` and remove the row on success (FR-011) (depends on T017, T020)
- [X] T023 [US3] Add an active/disable toggle control to each row in `components/admin/discount-code-manager.tsx` that calls `updateDiscountCodeApi` with the flipped `isActive` value (FR-006) (depends on T017, T020)

**Checkpoint**: All three user stories are independently functional — create, view/monitor, and edit/delete all work

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories

- [ ] T024 Walk through every scenario in `specs/001-admin-discount-codes/quickstart.md` manually against the running app and confirm each passes — **not completed**: this sandbox has no live NestJS backend for `/api/discount-codes` and no browser automation tool installed, so the 8 interactive scenarios could not be driven end-to-end; only confirmed the route builds, is statically generated, and is gated by the same admin middleware as its sibling routes (see completion report)
- [X] T025 Run `yarn test`, `tsc --noEmit`, and `yarn build` — all green (105/105 tests, 0 type errors, successful production build including `/admin/discount-codes`). `yarn lint` fails but with a pre-existing, repo-wide cause unrelated to this feature: no `eslint.config.js` exists anywhere in the repo (confirmed before this feature's changes)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (needs `DiscountCode` type) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion only
- **User Story 2 (Phase 4)**: Depends on Foundational completion; its table/search UI builds on the form T011 added in US1, so implement after US1 (though its domain/API tasks T013-T016 have no US1 dependency)
- **User Story 3 (Phase 5)**: Depends on Foundational completion and on the table (T017) from US2 to attach row actions to
- **Polish (Phase 6)**: Depends on all three user stories being complete

### Within Each User Story

- Tests (T007-T008, T013-T014, T019) MUST be written and FAIL before their corresponding implementation tasks
- Domain/API implementation before UI wiring
- Story complete before moving to the next priority

### Parallel Opportunities

- T002 and T003 (Phase 2) can run in parallel — different files
- T007 and T008 (US1 tests) can run in parallel — different files
- T013 and T014 (US2 tests) can run in parallel — different files
- T018 can run in parallel with finishing touches on T017 if staffed separately, though both touch the same file so coordinate merges

---

## Parallel Example: Phase 2 (Foundational)

```bash
Task: "Create lib/discount-codes.ts scaffolding"
Task: "Create lib/discount-codes-api.ts scaffolding"
```

## Parallel Example: User Story 1 tests

```bash
Task: "Unit tests for normalizeDiscountCode/validateDiscountCode in lib/discount-codes.test.ts"
Task: "Unit tests for createDiscountCodeApi in lib/discount-codes-api.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T006)
3. Complete Phase 3: User Story 1 (T007-T012)
4. **STOP and VALIDATE**: create a code end-to-end, confirm duplicate/invalid rejection
5. Demo if ready — this alone delivers a working "add a discount code" capability

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. Add User Story 1 → validate independently → demo (MVP)
3. Add User Story 2 → validate independently (status + search) → demo
4. Add User Story 3 → validate independently (edit/delete/toggle) → demo
5. Polish (T024-T025)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
- No backend/NestJS work is included here — `/api/discount-codes` is assumed to already exist per plan.md; if it does not, these tasks will need a corresponding backend implementation before T009-T023 can be verified against a real server
