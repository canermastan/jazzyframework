---
title: Routing
description: Define routes, groups, and middleware.
---

Routing in Jazzy is expressive, simple, and designed to be readable. It connects incoming HTTP requests to your application's logic.

<div class="docs-hero" data-wordmark="ROUTE">
  <p class="docs-kicker">REQUEST IN. CODE OUT.</p>
  <h2>Keep an entire HTTP surface readable from one route file.</h2>
  <p>Start with a handler, capture parameters where they belong, and group routes when a prefix or guard is shared.</p>
  <div class="docs-badges"><span>typed Context</span><span>async handlers</span><span>groupPath()</span></div>
</div>

<div class="journey-path">
  <a href="#basic-routing"><strong>01</strong><span>Handle</span><small>Map a method and path to code.</small></a>
  <a href="#route-parameters"><strong>02</strong><span>Capture</span><small>Read dynamic URL segments.</small></a>
  <a href="#route-groups"><strong>03</strong><span>Group</span><small>Share a prefix or middleware.</small></a>
  <a href="#handling-404-not-found"><strong>04</strong><span>Finish</span><small>Define the edge of the app.</small></a>
</div>

## Basic Routing
The easiest way to define a route is using a closure. This is great for small apps, quick prototypes, or single-file scripts.

**Note:** All route handlers in Jazzy must be `{.async.}`.

```nim
import jazzy

# Basic GET route
Route.get("/", proc(ctx: Context) {.async.} =
  ctx.text("Welcome Home")
)

# POST route
Route.post("/users", proc(ctx: Context) {.async.} =
  ctx.status(201).text("User Created")
)
```

### Available Router Methods
Jazzy supports all standard HTTP verbs.

```nim
Route.get("/posts", listPosts)
Route.post("/posts", createPost)
Route.put("/posts/:id", updatePost)
Route.patch("/posts/:id", patchPost)
Route.delete("/posts/:id", deletePost)
Route.options("/posts", handleOptions)
```

## Route Parameters
You can capture dynamic segments of the URI using the `:` syntax. The captured values are available in `ctx.request.params`.

```nim
Route.get("/users/:id", proc(ctx: Context) {.async.} =
  let userId = ctx.param("id")
  ctx.text("Showing user profile for ID: " & userId)
)

Route.get("/posts/:postId/comments/:commentId", proc(ctx: Context) {.async.} =
  let postId = ctx.param("postId")
  let commentId = ctx.param("commentId")
  ctx.text("Post " & postId & ", Comment " & commentId)
)
```

## Route Groups
Groups allow you to share attributes, such as URI prefixes or **Middleware**, across a large number of routes without needing to define them on each individual route.

### Path Prefixing
Useful for versioning APIs.

```nim
Route.groupPath("/api/v1"):
  Route.get("/users", listUsers)  # matches /api/v1/users
  Route.get("/posts", listPosts)  # matches /api/v1/posts
```

### Middleware Groups
You can protect a group of routes (e.g., ensuring a user is logged in).

```nim
import jazzy/auth/middlewares

Route.group(guard):
  Route.get("/dashboard", dashboard)
  Route.post("/settings", updateSettings)
```

### Nested Groups & Combinations
You can nest groups to build complex API structures.

```nim
# Admin Routes: /admin/...
Route.groupPath("/admin", guard): # Protected by 'guard' (Login check)
  
  # Dashboard
  Route.get("/dashboard", adminDashboard)

  # System Management: /admin/system/...
  Route.groupPath("/system"):
    Route.get("/logs", viewLogs)
    Route.delete("/cache", clearCache)
```

## Handling 404 Not Found
By default, Jazzy returns a simple 404 response. If you want to customize this, you can define a catch-all route at the very end of your route definitions, though typically the framework handles this gracefully. 

*Currently, generic 404 handling is built-in.*
