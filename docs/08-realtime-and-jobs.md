# 08 Realtime and jobs

## Socket.io

- Namespace `/rt`. Handshake carries the access token; `WsAuthGuard` validates it. Expired token → client refreshes and reconnects.
- Redis adapter so multiple instances share rooms.

| Room | Who may join | Events |
|---|---|---|
| `user:{userId}` | that user (auto-joined) | `notification.new`, `response.updated` |
| `hospital:{hospitalId}` | active members | `request.created`, `request.updated`, `donor.accepted`, `donor.en_route` |
| `request:{requestId}` | hospital members + confirmed donors | `request.updated`, `donor.location`, `message.new`, `message.read` |

Every join is an ack'd event the server authorizes (`join:request` → checks membership or confirmed response). No client-chosen room names.

### Live donor location

Client sends `donor.location` at most every 10 s and only after moving > 50 m. Server stores the
latest point in Redis (`loc:{requestId}:{donorId}`, TTL 15 min) and broadcasts to `request:{id}`. Not persisted.

### Missed events

Each event carries `seq` per room (Redis `INCR`). On reconnect the client sends its last `seq`; the
server replays from a short Redis list (last 100 events, 1 h TTL) or tells the client to refetch via RTK Query.

### Chat

Messages persisted in Mongo, broadcast to the room. Unread counts = messages after the user's last read marker.

## Queues (BullMQ)

| Queue | Jobs | Kind |
|---|---|---|
| `dispatch` | `wave` | delayed, jobId `wave:{requestId}:{n}` |
| `requests` | `expire` | delayed to `deadlineAt` |
| `notifications` | `push`, `email` | immediate, 3 retries |
| `webhooks` | `deliver` | backoff 1m → 12h |
| `donors` | `eligibility-reminder` | delayed 90 days after donation |
| `reports` | `daily-analytics` | repeatable, nightly |

All processors are idempotent and check current state before acting.

## Notifications

- Channels: Web Push (primary), email (fallback when no push subscription or push fails), in-app (always).
- Respect donor preferences, quiet hours (critical urgency overrides), and the daily cap.
- Notification rows power the in-app center; `notification.new` socket event updates the bell count.
