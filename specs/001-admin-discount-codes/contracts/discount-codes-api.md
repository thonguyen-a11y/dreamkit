# Contract: Discount Codes REST API (frontend client expectations)

This documents the REST contract `lib/discount-codes-api.ts` is written against, on
the existing external NestJS backend — the same backend already serving
`/api/products`, `/api/contacts`, and `/api/users`. All endpoints require an admin
bearer token (`Authorization: Bearer <accessToken>`), matching `authHeaders()` in the
sibling `*-api.ts` modules.

## `GET /api/discount-codes`

List all discount codes.

**Response `200`**:
```jsonc
{
  "data": [
    {
      "_id": "string",
      "code": "string",
      "description": "string | null",
      "discountType": "percentage" | "fixed",
      "value": 0,
      "minOrderAmount": 0,
      "startsAt": "ISO date | null",
      "expiresAt": "ISO date | null",
      "maxUses": 0,
      "perCustomerLimit": 0,
      "isActive": true,
      "usedCount": 0,
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  ]
}
```

## `POST /api/discount-codes`

Create a discount code.

**Request body**: same shape as one list item, minus `_id`/`usedCount`/`createdAt`/
`updatedAt` (server assigns these; `usedCount` starts at `0`).

**Response `201`**: the created record (same shape as a list item).

**Response `409`**: code already exists (case-insensitive) — surfaced to the admin
form as the `code` field error per FR-002/SC-002.

**Response `400`**: validation failure (e.g. `expiresAt` before `startsAt`, out-of-range
`value`) — surfaced as a field-level or form-level error.

## `PATCH /api/discount-codes/:id`

Update a discount code. Request body: partial version of the create body. Response
`200`: the updated record. Same `409`/`400` semantics as create.

## `DELETE /api/discount-codes/:id`

Delete a discount code. Response `204`. No special handling required server-side for
the "used at least once" confirmation — that check is done client-side against the
already-fetched `usedCount` before this call is made (FR-011).

## Frontend mapping

`lib/discount-codes-api.ts` maps each `_id` → `id` and passes other fields through,
matching the `mapApiProductToProduct` / `mapApiContactToContact` precedent in
`products-api.ts` / `contacts-api.ts`. Errors use the shared `ApiFetchResult<T>` /
`parseApiError` helpers in `lib/api-client.ts`, so no new error-handling primitive is
introduced.
