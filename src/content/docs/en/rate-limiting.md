---
title: Rate Limiting
description: Protect your API from abuse with built-in rate limiting.
---

Jazzy includes a powerful rate-limiting middleware to protect your application from brute-force attacks and API abuse.

## Basic Usage

The `rateLimit` middleware tracks requests per IP address and automatically blocks users who exceed the defined threshold.

```nim
import jazzy
import jazzy/core/middlewares

# Allow 100 requests per minute (60 seconds)
Route.groupPath("/api", rateLimit(100, 60)):
  Route.get("/data", getData)
```

## Headers

When rate limiting is active, Jazzy automatically adds the following standard headers to every response:

- `X-RateLimit-Limit`: Maximum number of requests allowed.
- `X-RateLimit-Remaining`: Number of requests remaining in the current window.
- `X-RateLimit-Reset`: Time when the rate limit window resets (in seconds).

### Handling Exceeded Limits

When a user exceeds the limit, Jazzy returns a `429 Too Many Requests` status code with the following JSON body:

```json
{
  "error": "Too Many Requests",
  "retry_after": 42
}
```

It also includes a `Retry-After` header indicating how many seconds to wait before trying again.

## Storage

By default, the Rate Limiter uses the built-in `AppCache` (In-memory storage). This is extremely fast and suitable for most applications.

> **Note:** Since it uses in-memory storage, restarting the server will reset all rate limit counters.
