# 06 Dispatch engine

The heart of RedRelay. Rules summary for agents lives in `.claude/skills/domain-rules/SKILL.md`; this doc
explains the design.

## Configuration (all in `modules/dispatch/dispatch.constants.ts`, overridable by env)

| Name | Default | Meaning |
|---|---|---|
| `WAVE_SIZE` | 10 | Donors alerted per wave |
| `WAVE_RADII_KM` | [5, 10, 20, 40] | Radius per wave |
| `WAVE_TIMEOUT_MIN` | 10 (critical: 5) | Wait before next wave |
| `MAX_WAVES` | 4 | Then escalate to staff |
| `MIN_DONATION_GAP_DAYS` | 90 | Eligibility gap |
| `MAX_ALERTS_PER_DONOR_PER_DAY` | 3 | Fatigue cap |

## State machine

`open → partially_matched → fulfilled`, plus `expired` and `cancelled` from either non-terminal state.
Transitions are validated by `assertTransition` in `requests.rules.ts`. Terminal states remove pending
wave jobs (`queue.remove('wave:{id}:{n}')`) and notify confirmed donors.

## Finding donors

```ts
DonorProfile.aggregate([
  { $geoNear: { near: hospital.location, distanceField: 'distanceM', maxDistance: radiusKm * 1000,
      spherical: true,
      query: { bloodGroup: { $in: compatibleDonorGroups }, isAvailable: true,
               lastDonationAt: { $not: { $gt: gapCutoff } }, userId: { $nin: alreadyAlerted } } } },
  { $limit: WAVE_SIZE * 3 },
]);
```

Then the pure `isEligible()` filters what Mongo cannot (quiet hours, daily cap), sorted by distance,
exact blood-group matches first, take `WAVE_SIZE`.

## Wave job

1. Load request; if terminal → stop.
2. Find donors for wave `n`; create `DispatchWave` and `DonorResponse(alerted)` rows.
3. Emit `dispatch.wave_sent` → notifications module sends push/email.
4. Schedule `wave:{id}:{n+1}` delayed by the timeout.
5. If `n > MAX_WAVES` → emit `dispatch.exhausted`, staff get an in-app alert to act manually.

## Accept

1. `DonorResponse` must be `alerted` for this donor (guards against random accepts).
2. Atomic conditional `$inc` on `unitsConfirmed` (see domain-rules skill).
3. Success → response `confirmed`, status → `partially_matched` or `fulfilled`, emit `donor.accepted`.
4. No modification → response `standby`, return 409 `REQUEST_FULL` with a friendly message.
5. Wrap the response update + request update in a transaction.

## Decline

Response → `declined`; donor is excluded from later waves of this request. Declines don't count against the donor.

## Completion

Staff marks a confirmed donor `arrived` → creates `Donation`, sets `DonorProfile.lastDonationAt`,
schedules a repeatable/delayed job to remind the donor when eligible again.

## Tests that must exist

- Eligibility: each rule passes and fails in isolation; boundary at exactly 90 days.
- Compatibility matrix: all 64 pairs.
- State machine: every legal and illegal transition.
- Concurrency: 10 parallel accepts on a 2-unit request → exactly 2 `confirmed`, 8 `standby`.
- Wave job: idempotent when run twice with the same jobId; stops on terminal request.
