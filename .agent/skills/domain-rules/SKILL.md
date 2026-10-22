---
name: domain-rules
description: RedRelay business rules — donor eligibility, blood type compatibility, request state machine, dispatch waves, atomic unit confirmation, and donor privacy. Use whenever code touches donors, blood requests, dispatch, responses, or donations.
---

# RedRelay domain rules

Full detail: `docs/06-dispatch-engine.md` and `docs/05-data-model.md`. These rules are enforced on the
**server**; the UI only mirrors them for feedback.

## Donor eligibility (`modules/donors/donors.rules.ts`)

A donor is eligible for a request when **all** hold:

- `isAvailable === true` and account active and email verified.
- Days since `lastDonationAt` ≥ `MIN_DONATION_GAP_DAYS` (default **90**, config-driven).
- Donor blood group can donate to the request's blood group (matrix below).
- Not already responded (accepted/declined) to this request.
- Under the daily alert cap (`MAX_ALERTS_PER_DONOR_PER_DAY`, default 3).
- Not in quiet hours, unless the request urgency is `critical`.
- Age and weight limits are captured at signup (18–65, ≥ 50 kg) — confirm the exact medical rules with
  your country's blood-bank guidelines before launch; keep them as constants, not literals.

Write as pure functions: `isEligible(donor, request, now): EligibilityResult` returning `{ ok, reasons[] }`
so the UI can show why someone is not eligible.

## Red-cell compatibility (donor → recipient)

| Donor | Can give to |
|---|---|
| O− | everyone |
| O+ | O+, A+, B+, AB+ |
| A− | A−, A+, AB−, AB+ |
| A+ | A+, AB+ |
| B− | B−, B+, AB−, AB+ |
| B+ | B+, AB+ |
| AB− | AB−, AB+ |
| AB+ | AB+ |

Store as a constant map; cache the inverse (`recipient → donors[]`) in Redis/in-memory. Prefer exact
group matches in wave 1, widen to compatible groups after.

## Request state machine (`modules/requests/requests.rules.ts`)

```
open ──(first unit confirmed)──▶ partially_matched ──(all units confirmed)──▶ fulfilled
  │                                    │
  ├──(deadline passed)──▶ expired ◀────┤
  └──(staff cancels)────▶ cancelled ◀──┘
```

- Only transitions in `ALLOWED_TRANSITIONS` are legal; `assertTransition(from, to)` throws otherwise.
- `fulfilled`, `expired`, `cancelled` are terminal: stop waves, cancel pending jobs, notify accepted donors.

## Dispatch waves

- Wave 1: nearest `WAVE_SIZE` (10) eligible donors within `WAVE_RADII_KM[0]` (5 km) via `$geoNear`.
- Each wave schedules a delayed BullMQ job at `WAVE_TIMEOUT_MIN` (10). On fire: if still not fulfilled,
  start the next wave with the next radius (5 → 10 → 20 → 40 km), excluding everyone already alerted or declined.
- Max waves `MAX_WAVES` (4); after that, mark request as needing manual action and alert hospital staff.
- Job IDs deterministic: `wave:${requestId}:${n}`.

## Accepting a unit (concurrency)

Ten donors may accept a request needing two units. Confirm with **one conditional atomic update**:

```ts
const res = await this.model.updateOne(
  { _id: requestId, status: { $in: ['open', 'partially_matched'] },
    $expr: { $lt: ['$unitsConfirmed', '$unitsNeeded'] } },
  { $inc: { unitsConfirmed: 1 } },
);
if (res.modifiedCount === 0) throw new ConflictException(REQUEST_FULL);
```

Then set the status from the new count. Late acceptors get "Thanks — this request is already covered" and are
put on standby. Never read-then-write. A test must fire concurrent accepts and assert exactly `unitsNeeded` confirmations.

## Privacy

- Before accepting: hospital sees donor count and approximate distance band only.
- After accepting: hospital sees that donor's name, phone, and live position while en route.
- Donor home location is never returned by any endpoint; live position is kept in Redis with a TTL and
  dropped when the donation is completed or cancelled.
- Request posting requires a **verified** hospital and is rate limited.
