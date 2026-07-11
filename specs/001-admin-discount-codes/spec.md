# Feature Specification: Admin Discount Code Management

**Feature Branch**: `001-admin-discount-codes`

**Created**: 2026-07-11

**Status**: Draft

**Input**: User description: "create page to admin manage discount code"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a discount code (Priority: P1)

An admin creates a new discount code (a code string, a discount type and value, and optional validity rules) so it can later be shared with customers as a promotion.

**Why this priority**: Without the ability to create codes, there is no discount program at all. This is the minimum capability that delivers value.

**Independent Test**: Can be fully tested by opening the admin discount codes page, submitting a new code with valid rules, and confirming it appears in the list with the correct status.

**Acceptance Scenarios**:

1. **Given** the admin is on the discount codes page, **When** they submit a new code with a unique code string, a discount type (percentage or fixed amount), and a value, **Then** the code is saved and appears in the list marked "Active" (or "Scheduled" if its start date is in the future).
2. **Given** the admin submits a code string that already exists (case-insensitive), **When** they try to save, **Then** the system rejects the submission and shows a clear "code already exists" error without creating a duplicate.
3. **Given** the admin submits a percentage value outside 1-100, or a negative fixed amount, **Then** the system rejects the submission and shows a field-level validation error.

---

### User Story 2 - View and monitor discount codes (Priority: P2)

An admin views the full list of discount codes, along with each code's current status (Active, Scheduled, Expired, Exhausted, Disabled) and usage count, to understand which promotions are currently live.

**Why this priority**: Once codes exist, admins need visibility to manage the promotion program day-to-day (e.g., confirm a seasonal code is live, or see how much a code has been used).

**Independent Test**: Can be fully tested by seeding a few discount codes with different date ranges/usage limits and confirming the list displays the correct computed status for each, independent of create/edit/delete actions.

**Acceptance Scenarios**:

1. **Given** discount codes exist with different start/expiry dates and active flags, **When** the admin opens the page, **Then** each code shows one correct status: "Active" (within date range, enabled, under usage limit), "Scheduled" (start date in future), "Expired" (past expiry date), "Exhausted" (usage limit reached), or "Disabled" (manually turned off).
2. **Given** many discount codes exist, **When** the admin types into a search field, **Then** the list filters to codes whose code string or description matches the query.

---

### User Story 3 - Edit or remove a discount code (Priority: P3)

An admin edits an existing discount code's rules, temporarily disables it, or deletes it entirely, so the promotion program stays accurate and clean.

**Why this priority**: Adjusting and retiring codes is common but less critical than the initial ability to launch and observe promotions; the feature is still useful with just create + view.

**Independent Test**: Can be fully tested by editing an existing code's value/dates and confirming the change is saved, and by deleting a code and confirming it disappears from the list.

**Acceptance Scenarios**:

1. **Given** an existing discount code, **When** the admin updates its value, dates, or active flag and saves, **Then** the list reflects the updated rules and recomputed status immediately.
2. **Given** an existing discount code that has never been used, **When** the admin deletes it, **Then** it is permanently removed from the list.
3. **Given** an existing discount code that has already been used by at least one customer, **When** the admin attempts to delete it, **Then** the system asks for confirmation before removing it, since historical usage tied to that code will lose its reference.

---

### Edge Cases

- What happens when the admin sets an expiry date earlier than the start date? The system must reject the save with a validation error.
- What happens when a code's usage count reaches its maximum uses while the admin is viewing the list? It should display as "Exhausted" the next time the list is loaded/refreshed.
- What happens when the admin leaves maximum uses blank? The code is treated as having unlimited uses.
- What happens when the admin leaves the expiry date blank? The code never expires on its own (still respects the active flag and usage limit).
- How does the system handle a code string with mixed case or surrounding whitespace on entry? It is normalized (trimmed, uppercased) before uniqueness checks and storage.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an admin-only page for listing, creating, editing, and deleting discount codes, accessible only to authenticated admin users (consistent with other admin sections).
- **FR-002**: System MUST require each discount code to have a unique, non-empty code string, compared case-insensitively and independent of leading/trailing whitespace.
- **FR-003**: System MUST require each discount code to specify a discount type of either "percentage" or "fixed amount", and a corresponding value (percentage between 1 and 100, or a non-negative fixed amount).
- **FR-004**: System MUST allow an optional description/label per code so admins can note the promotion's purpose.
- **FR-005**: System MUST allow optional validity rules per code: a start date, an expiry date, a minimum order amount to qualify, a maximum total number of uses, and a per-customer use limit.
- **FR-006**: System MUST allow an admin to manually enable or disable a code independent of its date range or usage limit.
- **FR-007**: System MUST reject saving a code when the expiry date is earlier than the start date.
- **FR-008**: System MUST compute and display a status for every code at view time: Scheduled, Active, Expired, Exhausted, or Disabled, derived from its dates, active flag, and usage against its maximum uses.
- **FR-009**: System MUST let the admin search/filter the code list by code string or description.
- **FR-010**: System MUST let the admin edit all fields of an existing code and re-validate them the same way as on creation.
- **FR-011**: System MUST let the admin delete a code, and MUST prompt for confirmation before deleting a code that has a non-zero usage count.
- **FR-012**: System MUST track and display how many times each code has been used so far.

### Key Entities

- **Discount Code**: A promotional rule an admin defines. Key attributes: code string (unique identifier customers enter), description, discount type (percentage or fixed amount) and value, minimum order amount, start date, expiry date, maximum total uses, per-customer use limit, active flag, usage count so far, and a computed status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An admin can create a new, valid discount code in under 1 minute from opening the page.
- **SC-002**: 100% of invalid discount code submissions (duplicate code, out-of-range value, expiry before start) are rejected with a specific, understandable error message rather than a silent failure or generic error.
- **SC-003**: For any discount code and the current date/time, the displayed status (Scheduled/Active/Expired/Exhausted/Disabled) always matches what the code's rules and usage would produce — verified across all five status outcomes.
- **SC-004**: An admin can locate a specific discount code among 50+ codes in under 10 seconds using search.

## Assumptions

- This feature covers admin-side management of discount codes only (create, view, edit, delete, monitor). Customer-facing redemption of a code during checkout is a separate, future feature and is out of scope here; usage counts are assumed to be incremented by that (not-yet-built) redemption flow, and this feature only needs to display them.
- Discount codes apply store-wide (to the whole order) rather than to specific products or categories, matching the simplest common discount-code pattern and keeping v1 scope focused on code management itself.
- Only users with the admin role can access this page, consistent with the existing admin section's access control.
- A discount code's status is computed on read (not stored), based on current date/time, its active flag, its date range, and its usage vs. maximum uses.
