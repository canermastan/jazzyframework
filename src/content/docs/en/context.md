---
title: Context
description: Understanding the heart of every Jazzy request.
---

# The Context Object

The `Context` object is the "heart" of every request in Jazzy. It is passed to every route handler and middleware, providing a unified interface to interact with both the incoming request and the outgoing response.

## Structure of Context

A `Context` object contains several key components:

- **`request`**: Access incoming data (headers, body, query params, etc.).
- **`response`**: Control the outgoing response (status, body, headers).
- **`auth`**: Manage user authentication and sessions.
- **`cache`**: Direct access to the application-level cache.
- **`requestId`**: A unique ID generated for every request (useful for logging).

---

## Accessing Information

### Basic Helpers
- `ctx.ip()`: Automatically detects and returns the client's IP address (respects `TRUST_PROXY`).
- `ctx.param(key)`: Retrieves dynamic route parameters (e.g., `/users/:id`).
- `ctx.input(key)`: Retrieves data from query strings or JSON bodies automatically.
- `ctx.header(key)`: (Response) Sets a response header.
- `ctx.status(code)`: (Response) Sets the HTTP status code.

### Request Properties
You can access raw request data via `ctx.request`:
- `ctx.request.headers`: A table of incoming HTTP headers.
- `ctx.request.httpMethod`: The HTTP method (HttpGet, HttpPost, etc.).
- `ctx.request.path`: The requested URL path.
- `ctx.request.body`: The raw request body as a string.

---

## Generating Responses

Context provides fluent methods for sending different types of content:

```nim
proc handler(ctx: Context) {.async.} =
  ctx.status(200)
     .header("X-Powered-By", "Jazzy")
     .json(%*{"message": "Hello World"})
```

See the [Responses](responses.md) documentation for more details.

## Dependency Injection via Context

Because `Context` is passed everywhere, it serves as the primary way to access global services like **Cache** or **Auth** in a thread-safe manner:

```nim
proc dashboard(ctx: Context) {.async.} =
  if ctx.check(): # Check if user is logged in
    let user = ctx.user()
    let stats = ctx.cache.get("global_stats")
    ctx.json(%*{"user": user, "stats": stats})
```
