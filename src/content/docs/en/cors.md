---
title: CORS (Cross-Origin Resource Sharing)
description: Configure CORS settings and middleware to allow cross-origin requests effortlessly.
---

Working with APIs often means handling Cross-Origin Resource Sharing (CORS). Jazzy makes CORS configuration effortless—prioritizing developer experience (DX) out of the box with intelligent defaults and automatic preflight handling.

## The CORS Middleware

Jazzy provides a built-in `cors()` middleware. You can apply it to specific routes, or globally to a group of routes.

```nim
import jazzy
import jazzy/core/middlewares

# Apply default CORS to all routes in this group
Route.group(cors()):
  Route.get("/api/data", proc(ctx: Context) {.async.} =
    ctx.json(%*{"status": "success"})
  )
```

### Default Behavior

When used without arguments, `cors()` automatically:
- Allows all origins (`Access-Control-Allow-Origin: *`)
- Allows common HTTP methods (`GET, POST, PUT, DELETE, OPTIONS, PATCH`)
- Automatically intercepts and handles `OPTIONS` preflight requests for you

## Customizing CORS

Need a stricter policy for production? You can customize the CORS middleware by passing specific allowed origins.

```nim
# Restrict to a specific origin
Route.group(cors(allowedOrigin = "https://example.com")):
  Route.get("/custom", proc(ctx: Context) {.async.} =
    ctx.text("custom")
  )
```

## How It Handles Preflight (OPTIONS)

If your client sends an `OPTIONS` preflight request (common when using `fetch` or `axios` in frontend frameworks like React, Vue, or Astro), Jazzy's CORS middleware intercepts it before it reaches your handler.

If the requested path matches *any* defined route within that group (even if it's a `POST` or `PUT` route), Jazzy automatically responds with a `204 No Content` and the correct CORS headers. This means you **don't** need to manually define an `.options()` route for your endpoints.

If the path doesn't exist, it correctly falls through to a `404 Not Found`.

### Example Preflight Flow

```nim
Route.group(cors(allowedOrigin = "https://myfrontend.com")):
  Route.post("/submit", proc(ctx: Context) {.async.} =
    ctx.text("Data submitted!")
  )
```

1. Browser sends an `OPTIONS /submit` preflight request.
2. Middleware intercepts, sees `/submit` is a registered route, and returns `204` with `Access-Control-Allow-Origin: https://myfrontend.com`.
3. Browser performs the actual `POST /submit` request.
4. Handler processes it and returns success.

No repetitive boilerplate required! Just wrap your routes in the middleware and you are ready to go.
