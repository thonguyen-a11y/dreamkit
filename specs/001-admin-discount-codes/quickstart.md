# Quickstart: Validating Admin Discount Code Management

## Prerequisites

- `yarn install` completed.
- An admin account (see `AdminGuard` in `components/admin/admin-guard.tsx` — the
  signed-in user's role must be `admin`).
- A running backend that serves `/api/discount-codes` per
  [contracts/discount-codes-api.md](./contracts/discount-codes-api.md), reachable at
  `NEXT_PUBLIC_API_URL` (see `.env.example`).

## Run

```sh
yarn dev
```

Sign in as an admin, then open `/admin/discount-codes/`.

## Validation scenarios (map to spec Acceptance Scenarios)

1. **Create** (User Story 1): Fill in a unique code, choose "percentage", enter `20`,
   leave dates blank, save. Expect the new row to appear with status "Active".
2. **Duplicate rejected** (US1, scenario 2): Create a second code using the same
   string in a different case/with extra spaces (e.g. `" summer20 "` vs `SUMMER20`).
   Expect a field error on `code`, no new row created.
3. **Invalid value rejected** (US1, scenario 3): Try `discountType: percentage`,
   `value: 150`. Expect a field error on `value`.
4. **Status computation** (User Story 2): Seed codes covering all five states —
   future `startsAt` (Scheduled), no dates + `isActive: true` (Active), past
   `expiresAt` (Expired), `usedCount === maxUses` (Exhausted), `isActive: false`
   (Disabled) — and confirm the list shows each correctly.
5. **Search** (US2, scenario 2): Type a substring of one code's `code` or
   `description` into the search field; confirm only matching rows remain.
6. **Edit** (User Story 3): Change an existing code's `value` and `expiresAt`, save,
   confirm the row updates and status recomputes.
7. **Delete, unused** (US3, scenario 2): Delete a code with `usedCount === 0`; confirm
   it's removed without an extra warning beyond the standard confirmation.
8. **Delete, used** (US3, scenario 3): Delete a code with `usedCount > 0`; confirm a
   stronger confirmation message about historical usage appears before removal.

## Automated checks

```sh
yarn test        # vitest run — lib/discount-codes.test.ts, lib/discount-codes-api.test.ts
yarn lint
tsc --noEmit
yarn build
```

All four must pass per Constitution Principle V before this feature is considered
done.
