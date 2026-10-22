# 05 Data model

MongoDB, 15 collections. All have `createdAt`/`updatedAt`. `id` is exposed instead of `_id`.

| Collection | Key fields | Indexes |
|---|---|---|
| **User** | email, passwordHash?, googleId?, name, phone?, role (`donor` \| `platform_admin` \| `hospital_user`), emailVerifiedAt, status | email unique, googleId unique sparse |
| **DonorProfile** | userId, bloodGroup, location (GeoJSON Point), approxArea, isAvailable, lastDonationAt, dob, weightKg, notificationPrefs { push, email, quietHours {start,end,tz} }, alertsToday {date,count} | userId unique, `location 2dsphere`, compound (bloodGroup, isAvailable) |
| **Hospital** | name, type (`hospital` \| `blood_bank`), address, location (Point), contactPhone, verification { status, documents[], reviewedBy, reviewedAt, note } | `location 2dsphere`, verification.status |
| **Membership** | userId, hospitalId, role (`staff` \| `admin`), status (`invited` \| `active` \| `removed`) | (userId, hospitalId) unique, hospitalId |
| **BloodRequest** | hospitalId, createdBy, bloodGroup, acceptCompatible (bool), unitsNeeded, unitsConfirmed, urgency (`normal` \| `urgent` \| `critical`), status, deadlineAt, currentWave, patientRef (opaque), note | (hospitalId, status, createdAt), (status, deadlineAt), `location 2dsphere` (copied from hospital) |
| **DispatchWave** | requestId, waveNo, radiusKm, donorIds[], sentAt, timeoutAt, result | (requestId, waveNo) unique |
| **DonorResponse** | requestId, donorId, waveNo, status (`alerted` \| `accepted` \| `confirmed` \| `standby` \| `declined` \| `en_route` \| `arrived` \| `no_show`), respondedAt | (requestId, donorId) unique, (donorId, status) |
| **Donation** | donorId, requestId?, hospitalId, units, donatedAt, recordedBy | (donorId, donatedAt -1) |
| **Message** | requestId, senderId, body, readBy[] | (requestId, createdAt) |
| **Notification** | userId, type, title, body, data, channel[], readAt | (userId, readAt, createdAt) |
| **HospitalWebhook** | hospitalId, url, secret (encrypted), events[], active | hospitalId |
| **WebhookDelivery** | webhookId, eventId, event, payload, attempt, status, responseCode, nextAttemptAt, durationMs | (webhookId, createdAt), (status, nextAttemptAt) |
| **WebhookEvent** | provider, providerEventId, type, processedAt | (provider, providerEventId) unique — idempotency |
| **Payment** | userId?, amount, currency, razorpayOrderId, razorpayPaymentId, status | razorpayOrderId unique |
| **AuditLog** | actorId, hospitalId?, action, target {type,id}, meta, ip | (hospitalId, createdAt), (actorId, createdAt) |

## Notes

- **Live donor position** is not stored in Mongo. Redis key `loc:{requestId}:{donorId}` with a TTL,
  latest position only.
- **Tenant scope**: BloodRequest, Membership, HospitalWebhook, Donation, AuditLog carry `hospitalId`;
  repositories filter by the caller's active membership.
- **Counters** (`unitsConfirmed`) change only through atomic `$inc` with conditions.
- **Retention**: Notifications and WebhookDelivery older than 90 days are deleted by a TTL index or repeatable job (M0 is 512 MB).
