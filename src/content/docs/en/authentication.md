---
title: Authentication
description: Built-in JWT Authentication and Security.
---

# Security & Authentication

Jazzy comes batteries-included with JWT authentication and secure password hashing.

## Configuration
Set your secret key in `.env`.
```env
JWT_SECRET=super-secure-random-string-at-least-32-chars
```

## Authentication Flow

### 1. Hashing Passwords (Registration)
Never store plain-text passwords. Use Jazzy's `hashPassword` helper.

```nim
import jazzy
import jazzy/auth/security

proc register*(ctx: Context) {.async.} =
  let email = ctx.input("email")
  let plainPassword = ctx.input("password")
  
  # Securely hash the password (using Salt + PBKDF2/HMAC)
  let hashed = hashPassword(plainPassword)
  
  let newId = DB.table("users").insert(%*{
    "email": email,
    "password": hashed,
    "role": "user"
  })
  
  ctx.status(201).json(%*{"id": newId})
```

### 2. Verifying Passwords (Login)
Verify credentials and issue a JWT token.

`ctx.login(user)` does two things at once:
- **Returns the JWT token** as a string (for API clients using `Authorization: Bearer`).
- **Sets a secure `HttpOnly` cookie** named `auth_token` (for browsers to send automatically on every subsequent request).

```nim
import jazzy/auth/security

proc handleLogin*(ctx: Context) {.async.} =
  let email    = ctx.input("email")
  let password = ctx.input("password")

  let user = DB.table("users").where("email", email).first()

  if user.isNull() or not verifyPassword(password, user.getString("password")):
    ctx.status(401).json(%*{"error": "Invalid credentials"})
    return

  # The payload can contain anything you need (id, role, username, etc.)
  let token = ctx.login(%*{
    "id":   user["id"],
    "role": user["role"]
  })

  ctx.json(%*{"token": token})
```

### Remember Me

By default, `ctx.login` creates a **session login** — 1-hour JWT and a cookie that is cleared when the browser closes. Pass `remember = true` to extend both to **30 days**.

`ctx.input("remember")` works with any source — a JSON body from a mobile app, an HTML form from a Melody template, or a query parameter. Jazzy checks all of them automatically.

| | `remember = false` (default) | `remember = true` |
|---|---|---|
| **JWT lifetime** | 1 hour | 30 days |
| **Cookie `Max-Age`** | none (session cookie) | 2592000 seconds |
| **Expires when** | Browser closes | 30 days from login |
| **Best for** | Shared / public computers | Personal devices |

```nim
proc handleLogin*(ctx: Context) {.async.} =
  let email    = ctx.input("email")
  let password = ctx.input("password")
  # ctx.input checks JSON body, form data, and query params automatically
  let remember = ctx.input("remember") == "true" or ctx.input("remember") == "on"

  let user = DB.table("users").where("email", email).first()

  if user.isNull() or not verifyPassword(password, user.getString("password")):
    ctx.status(401).json(%*{"error": "Invalid credentials"})
    return

  let token = ctx.login(%*{
    "id":   user["id"],
    "role": user["role"]
  }, remember = remember)

  ctx.json(%*{"token": token})
```

> **Security:** The cookie is always `HttpOnly` (no JavaScript access) and `SameSite=Lax` (CSRF protection). In production (`APP_ENV=production`) the `Secure` flag is added automatically so the cookie travels over HTTPS only.

## Protecting Routes
Use the `guard` middleware to strictly require a valid JWT token.

```nim
import jazzy/auth/middlewares

Route.group(guard):
  Route.get("/profile", getProfile)
```

## Basic Authentication
Jazzy includes a `basicAuthGuard` for standard HTTP Basic Authentication. This is useful for simple internal tools or API protection.

### Configuration
Enable Basic Auth by setting the credentials in your `.env`.

```env
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=secret123
```

### Usage
Import the `basicAuthGuard` and apply it to your routes.

```nim
import jazzy/auth/middlewares

# Apply to a group of routes
Route.group(basicAuthGuard):
  Route.get("/admin/logs", getLogs)

# Apply to a group of routes with path prefix
Route.groupPath("/internal", basicAuthGuard):
  Route.get("/health", healthCheck)
  Route.get("/stats", getStats)
```

## Accessing User Data
In any route (especially protected ones), you can access the current user's JWT payload.

```nim
proc getProfile*(ctx: Context) {.async.} =
  if ctx.check(): # Returns true if authenticated
    let user = ctx.user().get() # Returns Option[JsonNode]
    ctx.json(user)
  else:
    ctx.status(401).text("Who are you?")
```

## Web Authentication & SSR (Templates)

Jazzy uses the same `ctx.login` for both API and SSR. Browsers send the `auth_token` cookie automatically on every page request, so no extra code is needed on the backend.

On each request, Jazzy checks the `Authorization: Bearer` header first, then falls back to the `auth_token` cookie. Both paths authenticate the user identically — the `guard` middleware and `ctx.check()` work the same way regardless of how the token arrived.

### Accessing the User in Templates

When a user is logged in, Jazzy automatically injects the JWT payload as `$user` into every Melody template. No manual data passing needed.

```html
<!-- views/layouts/app.html -->
<nav>
  @if($user)
    <span>Welcome, {{ $user.username }}!</span>
    <form method="POST" action="/logout">
      <button type="submit">Logout</button>
    </form>
  @else
    <a href="/login">Login</a>
    <a href="/register">Register</a>
  @endif
</nav>
```

You can access any field from the login payload:

```html
@if($user)
  @if($user.role == "admin")
    <a href="/admin/dashboard">Admin Panel</a>
  @endif
  <p>Your ID: {{ $user.id }}</p>
@endif
```

### Logging Out

`ctx.logout()` clears the auth state and removes the `auth_token` cookie by setting `Max-Age=0`.

```nim
proc handleLogout*(ctx: Context) {.async.} =
  ctx.logout()
  ctx.header("Location", "/").status(302).text("")
```

## Role Based Access Control (RBAC)

You can write custom middleware to enforce roles (e.g., only "admins" allowed).

### Creating Admin Middleware

```nim
# src/middlewares/auth_middleware.nim
import jazzy

let adminOnly* = Middleware(
  name: "AdminOnly",
  handler: proc(ctx: Context, next: HandlerProc) {.async.} =
    # First, ensure they are logged in
    if not ctx.check():
      ctx.status(401).json(%*{"error": "Unauthorized"})
      return
      
    # Check Role
    let user = ctx.user().get()
    if user.getString("role") == "admin":
      # User is Admin, proceed
      await next(ctx)
    else:
      # User is logged in but forbidden
      ctx.status(403).json(%*{"error": "Forbidden: Admins only"})
)
```

### Applying RBAC
Combine standard `guard` with your custom `adminOnly` middleware.

```nim
import jazzy/auth/middlewares
import middlewares/auth_middleware

Route.groupPath("/admin", @[guard, adminOnly]):
  Route.get("/dashboard", adminDashboard)
  Route.delete("/users/:id", deleteUser)
```
