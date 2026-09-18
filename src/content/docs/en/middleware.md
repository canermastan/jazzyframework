---
title: Middleware
description: Understanding and using built-in middleware in Jazzy.
---

Middleware functions are components that execute before your route handlers. They can modify requests, check authentication, or handle cross-cutting concerns like logging and rate limiting. In Jazzy, a middleware is a `Middleware` object consisting of a `name` (for debugging/Dev UI) and a `handler` (a `MiddlewareProc`).

<div class="docs-hero" data-wordmark="NEXT">
  <p class="docs-kicker">THE PIPELINE AROUND A ROUTE</p>
  <h2>Put cross-cutting decisions in one deliberate layer.</h2>
  <p>Use the built-ins for common HTTP protection, compose a few middlewares in order, or define a small named middleware for application rules.</p>
  <div class="docs-badges"><span>body limits</span><span>auth guards</span><span>rate limits</span></div>
</div>

<div class="journey-path">
  <a href="#built-in-middleware"><strong>01</strong><span>Choose</span><small>Start with a built-in guard.</small></a>
  <a href="#body-limit-middleware"><strong>02</strong><span>Limit</span><small>Protect uploads and request bodies.</small></a>
  <a href="#multiple-middleware"><strong>03</strong><span>Compose</span><small>Make ordering explicit.</small></a>
  <a href="#creating-custom-middleware"><strong>04</strong><span>Extend</span><small>Write a named reusable policy.</small></a>
</div>

## Built-in Middleware

Jazzy comes with several built-in middleware to handle common tasks:

- **Logging:** Automatically logs every request (Standard).
- **Static Files:** Serves static content.
- **Auth Guard (`guard`):** Validates JWT tokens.
- **Basic Auth Guard (`basicAuthGuard`):** Handles HTTP Basic authentication.
- **Rate Limiter (`rateLimit`):** Protects from abuse.
- **Body Limit (`bodyLimit`):** Controls maximum payload size.
- **CORS (`cors`):** Handles Cross-Origin Resource Sharing.

---

## Body Limit Middleware

Prevent server overload by restricting the size of request bodies (e.g., file uploads).

### Global Configuration
You can set a global limit in your `.env` file (in Megabytes).

```env
# Limit all requests to 5MB
BODY_LIMIT_MB=5
```

### Usage
Use the `bodyLimit` middleware to enforce size restrictions on specific routes.

```nim
import jazzy

# Limit this specific route to 10MB
Route.post("/upload", bodyLimit(10), uploadHandler)

# Pass -1 to use the value from .env (defaults to 10MB if not set)
Route.post("/data", bodyLimit(-1), dataHandler)
```

If a request exceeds the limit, Jazzy returns `413 Payload Too Large`.

---

## Multiple Middleware

You can apply multiple middlewares to a single route or a group by passing them in a sequence using the Nim sequence literal `@[]`.

```nim
import jazzy
import jazzy/core/middlewares
import ../middlewares/admin_guard

# Multiple middleware on a route group
Route.groupPath("/admin", @[customMiddleware(), cors(), rateLimit(100, 60)]):
  Route.get("/dashboard", adminDashboard)
  Route.post("/settings", updateSettings)
```

Middlewares are executed in the **order they are defined** in the sequence.

---

## Creating Custom Middleware

You can easily create your own middleware by defining a `Middleware` object.

```nim
import jazzy

# A middleware that adds a custom header to every response
let customHeaderMiddleware* = Middleware(
  name: "CustomHeader",
  handler: proc(ctx: Context, next: HandlerProc) {.async.} =
    ctx.header("X-Framework", "Jazzy")
    
    # Crucial: Always call next(ctx) to continue the chain
    await next(ctx)
)

# Applying it to a route
Route.get("/", customHeaderMiddleware, indexHandler)
```

### Middleware as a Function
If your middleware needs parameters (like `rateLimit`), you should create a function that returns a `Middleware` object:

```nim
proc myCustomMiddleware*(param: string): Middleware =
  let handler: MiddlewareProc = proc(ctx: Context, next: HandlerProc) {.async, gcsafe.} =
    echo "Param is: ", param
    await next(ctx)
  
  return Middleware(name: "MyCustom(" & param & ")", handler: handler)
```
