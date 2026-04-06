---
title: Logging & Tracking
description: Understanding Jazzy's structured logging system and request identifiers.
---

Jazzy includes a modern, structured logging system that provides clear visibility into your application's behavior and performance.

## Request ID

Every request processed by Jazzy is automatically assigned a unique, UUID-like **Request ID**. This ID is crucial for tracking a single user's journey through your logs and across distributed systems.

### Accessing Request ID

You can access the current Request ID anywhere within your handlers using `ctx.requestId`.

```nim
import jazzy

Route.get("/", proc(ctx: Context) {.async.} =
  let rid = ctx.requestId
  ctx.text("Your unique request ID is: " & rid)
)
```

Jazzy also automatically adds an `X-Request-Id` header to every response.

---

## Structured Logging

Jazzy's built-in logger provides color-coded, structured terminal output for every incoming request.

### Log Output Example

```text
2026-04-06 15:42:01 [INFO] GET /api/users - 200 OK (12ms) [rid: 550e8400-e29b-41d4-a716-446655440000]
2026-04-06 15:42:05 [DEBUG] Cache HIT for key: user_profile_1
2026-04-06 15:42:10 [ERROR] Failed to connect to database [rid: 550e8400-e29b-41d4-a716-446655440001]
```

### Configuration

You can control the verbosity of your logs by setting the `LOG_LEVEL` in your `.env` file.

```env
# Possible values: DEBUG, INFO, WARN, ERROR, FATAL, NONE
LOG_LEVEL=INFO
```

The logger automatically adapts to your environment:
- **Development:** Full color-coded output for better readability.
- **Production:** Clean output suitable for log aggregators and cloud environments.

---

## Custom Logs

You can also use Jazzy's logger for your own application logic.

```nim
import jazzy/core/logger

Log.info("Starting the worker process...")
Log.warn("User is attempting to access restricted data!")
Log.error("Unexpected error in calculation module")
```
