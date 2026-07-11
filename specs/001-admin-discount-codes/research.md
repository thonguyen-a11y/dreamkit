# Phase 0 Research: Admin Discount Code Management

No `NEEDS CLARIFICATION` markers remain in the Technical Context — this feature reuses
the stack and conventions already established by the sibling `products`/`contacts`/
`users` admin domains. The items below record the concrete decisions made while
translating the spec into an implementation approach.

## Decision: Follow the existing `lib/<domain>.ts` + `lib/<domain>-api.ts` split

**Rationale**: Every existing admin domain in this repo separates pure, framework-free
domain logic (validation, normalization, id/slug helpers) from the REST API client
(fetch calls, request/response mapping). `lib/product-admin.ts` + `lib/products-api.ts`
is the closest precedent: `product-admin.ts` holds `validateProduct`/`upsertProduct`/
`deleteProduct` (pure array operations used by client state), while `products-api.ts`
holds the fetch + response-mapping code. Discount codes get the same split:
`lib/discount-codes.ts` (validate, normalize code string, compute status) and
`lib/discount-codes-api.ts` (list/create/update/delete against `/api/discount-codes`).

**Alternatives considered**: A single combined `lib/discount-codes.ts` file — rejected
because it would break the established convention and mix pure logic with network
calls, making the domain logic harder to unit test in isolation (the existing
`product-admin.test.ts` tests the pure module without any fetch mocking).

## Decision: Status is computed, not stored

**Rationale**: Spec FR-008 requires the status (Scheduled/Active/Expired/Exhausted/
Disabled) to always reflect current date/time vs. the code's rules. Computing it in a
pure function `computeDiscountCodeStatus(code, now)` in `lib/discount-codes.ts` means
the manager component and any future consumer get a single source of truth, and the
function is trivially unit-testable across all five outcomes without mocking the
clock via `Date.now()` directly (pass `now` as a parameter).

**Alternatives considered**: Storing/deriving status server-side and trusting the API
response — rejected because the spec explicitly frames this as a point-in-time
computation ("displayed status ... always matches what the code's rules and usage
would produce"), and computing client-side avoids staleness between page load and the
admin viewing the list.

## Decision: Code string normalization (trim + uppercase) happens before validation and before send

**Rationale**: FR-002 and the edge case list require case-insensitive, whitespace-
insensitive uniqueness. Normalizing in the pure `lib/discount-codes.ts` module (a
`normalizeDiscountCode(code: string): string` helper, mirroring `slugifyProductId` in
`lib/product-admin.ts`) keeps the rule in one place, applied identically on create and
edit.

**Alternatives considered**: Relying on the backend to normalize and reject duplicates
— rejected as the sole mechanism because the spec requires a specific, immediate
field-level error in the admin form (SC-002), which needs client-side pre-validation
for a responsive UX; the backend remains the source of truth for the actual uniqueness
constraint.

## Decision: Delete confirmation is a client-side interstitial, not a new modal component

**Rationale**: Existing managers (`product-manager.tsx`) use `window.confirm(...)` for
destructive actions. FR-011 only requires confirmation when usage count is non-zero;
the manager will branch: usage count 0 → confirm like existing delete flows; usage
count > 0 → confirm with a stronger message noting historical usage. This keeps the
interaction pattern consistent with the rest of the admin area rather than
introducing a new dialog component for a single case.

**Alternatives considered**: A dedicated confirmation dialog component — rejected as
unnecessary UI surface area beyond what the existing codebase uses for equivalent
destructive actions elsewhere in admin.

## Decision: Discount type modeled as a discriminated pair (`discountType` + `value`), not two separate optional fields

**Rationale**: FR-003 requires exactly one of "percentage" or "fixed amount" with a
type-appropriate value range. A single `discountType: "percentage" | "fixed"` plus one
`value: number` field (validated against the type-specific range) avoids having two
mutually-exclusive optional fields that could both be set or both be empty.

**Alternatives considered**: Separate `percentageValue?: number` and
`fixedValue?: number` fields — rejected because it allows an invalid state (both set,
or neither set) to be representable, requiring extra validation to rule out that the
type system already prevents with the discriminated form.
