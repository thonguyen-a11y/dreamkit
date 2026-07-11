# Phase 1 Data Model: Admin Discount Code Management

## Entity: DiscountCode

Frontend representation used by the admin UI (`lib/types.ts`), mapped from the
backend's API record by `lib/discount-codes-api.ts`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` | yes | Backend record id |
| `code` | `string` | yes | Normalized (trimmed, uppercased) on write; unique, case-insensitive |
| `description` | `string` | no | Free-text label for the promotion's purpose (FR-004) |
| `discountType` | `"percentage" \| "fixed"` | yes | Discriminates the meaning of `value` (FR-003) |
| `value` | `number` | yes | 1–100 when `discountType` is `"percentage"`; ≥ 0 when `"fixed"` |
| `minOrderAmount` | `number` | no | VND; order must meet or exceed this to qualify (FR-005) |
| `startsAt` | `string` (ISO date) | no | Code is not "Active" before this date; absent = always eligible to start |
| `expiresAt` | `string` (ISO date) | no | Code is "Expired" after this date; absent = never expires on its own |
| `maxUses` | `number` | no | Total redemption cap; absent = unlimited (FR-005) |
| `perCustomerLimit` | `number` | no | Per-customer redemption cap (FR-005) |
| `isActive` | `boolean` | yes | Manual enable/disable flag, independent of dates/usage (FR-006) |
| `usedCount` | `number` | yes (read-only) | Incremented by the (future, out-of-scope) checkout redemption flow; this feature only displays it (FR-012) |
| `createdAt` | `string` (ISO date) | yes | Set by backend |

### Derived value: `status`

Not stored — computed at read time by
`computeDiscountCodeStatus(code: DiscountCode, now: Date): DiscountCodeStatus`
(FR-008):

```text
type DiscountCodeStatus = "scheduled" | "active" | "expired" | "exhausted" | "disabled";
```

Precedence (first match wins):

1. `disabled` — `isActive === false`
2. `expired` — `expiresAt` is set and `now > expiresAt`
3. `exhausted` — `maxUses` is set and `usedCount >= maxUses`
4. `scheduled` — `startsAt` is set and `now < startsAt`
5. `active` — none of the above

### Validation rules (`validateDiscountCode`, mirrors `validateProduct` in `lib/product-admin.ts`)

- `code`: required after normalization; must not collide (case-insensitive) with any
  other existing code (excluding the record being edited).
- `discountType`: must be `"percentage"` or `"fixed"`.
- `value`: required, finite; `1–100` inclusive when `discountType === "percentage"`,
  `>= 0` when `"fixed"`.
- `minOrderAmount`, `maxUses`, `perCustomerLimit`: when present, must be finite and
  `>= 0` (`maxUses`/`perCustomerLimit` are whole redemption counts, so also integers).
- `startsAt`, `expiresAt`: when both present, `expiresAt` must not be earlier than
  `startsAt` (FR-007).

## State transitions

`status` is fully derived (see above) — there is no explicit state machine or stored
transition; any field edit (dates, `isActive`, `maxUses`) simply changes which branch
of `computeDiscountCodeStatus` matches on next read. The only mutable, non-derived
lifecycle field is `isActive` (admin-toggled) and `usedCount` (incremented externally
by checkout redemption, out of scope for this feature — this feature only reads it).

## Relationships

- `DiscountCode` is standalone in this feature's scope (spec assumption: store-wide
  discounts, no link to specific `Product`/category records).
- Historical usage (e.g., which `Order` used which code) is out of scope; FR-011 only
  requires knowing whether `usedCount > 0` to decide whether delete needs stronger
  confirmation — no join to `Order` is required in this repo.
