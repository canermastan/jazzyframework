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

```nim
import jazzy/auth/security

proc login*(ctx: Context) {.async.} =
  let email = ctx.input("email")
  let password = ctx.input("password")

  let user = DB.table("users").where("email", email).first()

  if user.kind == JNull or not verifyPassword(password, user["password"].getStr):
    ctx.status(401).json(%*{"error": "Invalid credentials"})
    return

  # Login successful - Issue Token
  # The payload can contain anything you need (ID, Role, etc.)
  let token = ctx.login(%*{
    "id": user["id"],
    "role": user["role"]
  })
    
  ctx.json(%*{"token": token})
```

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
    if user.hasKey("role") and user["role"].getStr == "admin":
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
