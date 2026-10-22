---
name: nest-module
description: Backend architecture for RedRelay (NestJS, TypeScript, MongoDB via Mongoose, Swagger, BullMQ, Socket.io, Redis). Use when adding a module, endpoint, schema, DTO, guard, interceptor, queue job, gateway, or integration in backend/.
---

# NestJS module pattern

## Folder structure

```
backend/src/
├── main.ts                  # bootstrap: helmet, cors, cookie-parser, global pipes/filters, swagger
├── app.module.ts            # imports config, database, infra, modules
├── config/                  # typed config namespaces, zod-validated env
│   ├── env.schema.ts
│   ├── app.config.ts  database.config.ts  redis.config.ts  auth.config.ts  ...
│   └── index.ts
├── common/                  # PROJECT-AGNOSTIC — copyable to any Nest project
│   ├── constants/           # error codes, header names, pagination defaults
│   ├── decorators/          # @CurrentUser, @Roles, @Public, @ApiPaginatedResponse, @ApiStandardErrors
│   ├── guards/              # JwtAuthGuard, RolesGuard, ThrottlerBehindProxyGuard
│   ├── interceptors/        # ResponseEnvelopeInterceptor, LoggingInterceptor, TimeoutInterceptor
│   ├── filters/             # AllExceptionsFilter → standard error body
│   ├── pipes/               # ParseObjectIdPipe
│   ├── dto/                 # PaginationQueryDto, PaginatedResponseDto<T>, IdParamDto
│   ├── database/            # BaseRepository<T>, base schema options (timestamps, toJSON transform)
│   ├── utils/               # crypto (hmac), time, geo helpers, retry/backoff
│   ├── testing/             # test module builders, in-memory Mongo helper, factories
│   └── types/
├── infra/                   # adapters to outside services, each behind an interface
│   ├── database/            # MongooseModule.forRootAsync
│   ├── redis/               # RedisModule (ioredis), cache service (cache-aside helper)
│   ├── queue/               # BullMQ module registration, queue names
│   ├── mail/                # MailService interface + Resend/Brevo adapter
│   ├── push/                # Web Push (VAPID) adapter
│   ├── storage/             # Cloudinary adapter
│   ├── payments/            # Razorpay adapter
│   └── realtime/            # Socket.io adapter with Redis adapter, WsAuthGuard
└── modules/                 # RedRelay domain
    └── <name>/
        ├── <name>.module.ts
        ├── <name>.controller.ts     # HTTP only: decorators, DTO in, call service, return DTO
        ├── <name>.service.ts        # business logic, orchestration, transactions
        ├── <name>.repository.ts     # extends BaseRepository; all Mongo queries live here
        ├── <name>.rules.ts          # pure functions (policies, calculations) — unit tested
        ├── <name>.constants.ts
        ├── <name>.events.ts         # event names + payload types (internal + socket + webhook)
        ├── schemas/<name>.schema.ts
        ├── dto/create-<name>.dto.ts  update-<name>.dto.ts  <name>-response.dto.ts  query-<name>.dto.ts
        ├── jobs/<name>.processor.ts  # BullMQ workers, if any
        ├── gateways/<name>.gateway.ts # socket handlers, if any
        └── __tests__/
```

Modules: `auth`, `users`, `donors`, `hospitals`, `memberships`, `requests`, `dispatch`, `responses`,
`donations`, `chat`, `notifications`, `webhooks`, `payments`, `analytics`, `audit`, `health`.

## Layer rules

- **Controller**: no `if` about business, no Mongoose. Swagger + guards + DTO + `return this.service.x()`.
- **Service**: business logic; calls repositories and other services through their module exports;
  emits domain events (`EventEmitter2`) instead of calling notifications/webhooks directly.
- **Repository**: the only place that touches the Mongoose model. Returns lean plain objects.
- **Rules**: pure, no Nest imports, no I/O → trivially unit-testable.
- Cross-module: import the other module and inject its exported service. Never import another module's repository or schema.

## Every endpoint has

```ts
@ApiTags('requests')
@Controller('requests')
export class RequestsController {
  constructor(private readonly requests: RequestsService) {}

  @Post()
  @Roles(Role.HospitalStaff, Role.HospitalAdmin)          // Sprint 4
  @Throttle({ default: { limit: 5, ttl: minutes(10) } })  // Sprint 12
  @ApiEnvelopedResponse(RequestResponseDto, { status: HttpStatus.CREATED })
  @ApiStandardErrors()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateRequestDto): Promise<RequestResponseDto> {
    return this.requests.create(user, dto);
  }

  @Get()
  @ApiPaginatedResponse(RequestResponseDto)
  list(@Query() query: PaginationQueryDto): Promise<PaginatedResult<RequestResponseDto>> {
    return this.requests.list(query);
  }
}
```

Controllers return plain DTOs or a `PaginatedResult` (`{ items, meta }`); the global
`ResponseEnvelopeInterceptor` wraps them as `{ data }` / `{ data, meta }`. Always document with
`@ApiEnvelopedResponse` / `@ApiPaginatedResponse`, never bare `@ApiOkResponse({ type })`, or the
frontend's generated types won't match the envelope.

## What already exists (reuse it)

| Need | Use |
|---|---|
| Domain error with a code | `throw new AppException(HttpStatus.CONFLICT, REQUEST_FULL, 'This request is already covered.')` |
| Response/error envelope utils | `createSuccessEnvelope(data, meta?)`, `createErrorEnvelope(code, message, details, requestId)` |
| Logger | `createLogger(context)` or `new AppLogger(context)` |
| Mongo CRUD + pagination | `class XRepository extends BaseRepository<X>` → `create`, `findById`, `findOne`, `updateById`, `deleteById`, `paginate` |
| Schema defaults & UUID | `class X extends BaseSchema` + `@Schema(baseSchemaOptions)` (UUID `_id` default via `generateUuid()`) |
| `:id` params | `@Param('id', ParseUuidPipe) id: string` (and `@IsUUID()` in DTOs) |
| List query | `PaginationQueryDto`; build results with `createPaginatedResult` |
| Swagger | `ApiEnvelopedResponse`, `ApiPaginatedResponse`, `ApiStandardErrors` |
| Config | `config/*.config.ts` namespaces; add vars to `config/env.schema.ts` and `.env.example` |
| App bootstrap | `common/bootstrap` (generic) + `src/app.setup.ts` (RedRelay values) |
| e2e app | `test/utils/create-test-app.ts` (in-memory replica set via `common/testing/mongo-memory.ts`) |

- DTOs use `class-validator` + `class-transformer`; global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`.
- Use `@nestjs/swagger` CLI plugin (in `nest-cli.json`) so DTO properties are documented without repeating `@ApiProperty`.
- Response DTOs control what leaves the server — never return a raw document (privacy).

## Standard responses

Success: `{ data, meta? }` (meta for pagination). Error (from `AllExceptionsFilter` / `createErrorEnvelope`):

```json
{ "error": { "code": "REQUEST_ALREADY_FULFILLED", "message": "This request already has all units confirmed.", "details": [], "requestId": "...", "timestamp": "2026-10-22T10:00:00.000Z" } }
```

Error codes are constants in `common/constants/error-codes.ts` (generic) or `<module>.constants.ts` (domain).

## Data rules

- All collections use RFC 4122 UUID v4 strings for `_id` (via `BaseSchema` + `generateUuid()`), never Mongo ObjectIds.
- Schemas: extend `BaseSchema`, `@Schema(baseSchemaOptions)`, `timestamps: true`, `toJSON` transform removes `__v` and maps `_id` → `id`.
- Index every field used in a filter or sort; geo fields use `2dsphere`.
- Concurrency: conditional atomic updates. Example — confirm a unit only if still needed:
  `updateOne({ _id, status: { $in: ['open','partially_matched'] }, $expr: { $lt: ['$unitsConfirmed', '$unitsNeeded'] } }, { $inc: { unitsConfirmed: 1 } })`
  and check `modifiedCount`.
- Multi-tenancy: every hospital-scoped query takes `hospitalId` from the authenticated membership,
  never from the request body. `BaseRepository` offers `scoped(hospitalId)` helpers.
- Multi-document consistency uses a session/transaction (Atlas M0 supports replica-set transactions).

## Queues (BullMQ)

- Queue names in `infra/queue/queue.constants.ts`. One processor class per queue.
- Jobs are idempotent: use deterministic `jobId` (e.g. `wave:${requestId}:${waveNo}`) so retries don't duplicate.
- Delayed jobs for wave timeouts; repeatable jobs for daily eligibility re-activation and reminders.

## Config

- `@nestjs/config` with `registerAs` namespaces; env validated by zod at boot (app fails fast).
- Inject with `@Inject(authConfig.KEY) cfg: ConfigType<typeof authConfig>`. Never read `process.env` elsewhere.

## Checklist for a new module

1. Read the related doc in `docs/` and the `domain-rules` skill if it touches donors or requests.
2. Reuse `common/` (BaseRepository, pagination DTOs, decorators). Missing generic piece → add it to `common` first.
3. Schema + indexes → repository → rules (with tests) → service → DTOs → controller → module.
4. Swagger: tags, response types, standard errors. Open `/docs` and check the endpoint.
5. Unit tests for rules and service; e2e test (Supertest + mongodb-memory-server) for the controller.
6. `npm run lint && npm run typecheck && npm test`.
