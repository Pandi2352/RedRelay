# 01 Product

## Problem

When a patient needs blood urgently, hospitals still phone donor lists and post on social media.
Calls go to people who donated last month, live across the city, or have the wrong blood group.
RedRelay replaces that with a dispatch system: the right donors, nearest first, alerted in waves,
with exactly the needed units confirmed.

## Why this project stands out

- A real algorithm: nearest eligible donors, timeouts, widening fallback waves.
- Real business rules: 90-day donation gap, blood compatibility, alert caps, quiet hours.
- Every advanced backend concept appears for a reason (table below).

| Concept | Where it shows up |
|---|---|
| Realtime (Socket.io) | Live request board, accept/decline updates, donor en-route marker, request chat |
| Caching (Redis) | Compatibility lookups, hospital lists, nearby-donor counts |
| Rate limiting | Request creation, OTP, login |
| Geospatial | `$geoNear` donors near a hospital, radius widening per wave |
| Queues (BullMQ) | Wave timeouts, reminders, eligibility re-activation, reports, webhook retries |
| Incoming webhooks | Razorpay events for medical-fund donations |
| Outgoing webhooks | Hospitals receive signed `request.created`, `donor.accepted`, `request.fulfilled` |
| Integrations | Google OAuth, Leaflet + OSM, Web Push, email, Cloudinary, Razorpay test mode |
| Concurrency | Ten donors accept a 2-unit request → exactly two confirmed |
| RBAC | Donor, hospital staff, hospital admin, platform admin |
| Multi-tenancy | Each hospital/blood bank is a tenant with its own staff and data scope |
| Analytics | Response time, fulfillment rate, demand heatmap, donor retention |
| PWA | Installable, push alerts |

## Users and roles

| Role | Can |
|---|---|
| Donor | Manage profile, blood group, location, availability, notification prefs; accept/decline; share live location while en route; chat on accepted requests; see donation history |
| Hospital staff | Post and manage requests for their hospital; watch live board; chat with accepted donors; mark donation complete |
| Hospital admin | Everything staff can + invite/remove staff, upload verification documents, manage webhooks, see hospital analytics |
| Platform admin | Approve/reject hospitals, view platform analytics, audit log, suspend accounts |

## Core flows

1. **Hospital onboarding** — admin signs up → creates hospital → uploads documents → platform admin approves → hospital can post.
2. **Donor onboarding** — sign up (email or Google) → verify email → blood group, location, last donation → enable push.
3. **Post request** — staff enters blood group, units, urgency, deadline → engine starts wave 1.
4. **Donor responds** — push alert → open request (distance, hospital, urgency) → accept or decline.
5. **Confirm and travel** — first N acceptors confirmed atomically → contact details revealed → donor shares live position → staff sees "on the way".
6. **Complete** — staff marks donation done → donor's `lastDonationAt` set → eligibility pauses 90 days → reminder job scheduled.
7. **Close** — request fulfilled/expired/cancelled → waves stop → outgoing webhooks fire.

## MVP scope (phases 1–6)

Auth + roles, hospital verification, donor profile + eligibility, geo matching, dispatch engine, realtime board.
Notifications, caching, webhooks, payments, dashboards, and PWA follow (see [11 Roadmap](11-roadmap.md)).

## Out of scope

Blood stock inventory management, SMS (no reliable free tier), native mobile apps (PWA instead), medical records.
