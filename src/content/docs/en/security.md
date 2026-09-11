---
title: Security Guide
description: Secure configuration, authentication boundaries, and production deployment for Jazzy applications.
---

# Security Guide

Jazzy provides security primitives, not a blanket guarantee that every
application is secure. A production application still needs correct
authorization rules, HTTPS, secure secret management, and review of its own
business logic.

Use this page as the production baseline for every Jazzy application.

## Production checklist

Set these values in your deployment environment or secret manager, not in
version control:

```env
APP_ENV=production
JWT_SECRET=replace-with-a-cryptographically-random-secret-at-least-32-characters
CSRF_ENABLED=false
DEV_UI_ENABLED=false
```

- Set `CSRF_ENABLED=true` when a browser authenticates through Jazzy's
  `auth_token` cookie. Keep it `false` for a Bearer-token-only API.
- `DEV_UI_ENABLED` has no effect outside development. It must be explicitly
  enabled with `APP_ENV=development` before the Dev UI is registered.
- Terminate TLS at your reverse proxy or load balancer and expose only HTTPS to
  users. Passwords and JWTs must never travel over plain HTTP.
- Keep `JWT_SECRET` private. Rotating it invalidates all current Jazzy JWTs.

## JWT authentication

`ctx.login()` creates a signed JWT and sets an `HttpOnly`, `SameSite=Lax`
`auth_token` cookie. In production the cookie also receives the `Secure` flag,
so browsers send it only over HTTPS.

### Use an allowlist for claims

JWT payloads are signed, but they are **not encrypted**. Anyone who possesses a
token can decode its claims. Never put a password hash, API key, reset token,
email address, or other sensitive field in a JWT.

```nim
# Good: explicitly choose the fields a client may see.
let token = ctx.login(%*{
  "id": user.getInt("id"),
  "role": user.getString("role")
})

# Never pass an entire database record to ctx.login().
```

Jazzy's Todo example follows this pattern by creating a separate authentication
claim object before it issues a token.

### Require a real secret in production

Projects created with `jazzy new` receive a random `JWT_SECRET`. Production
deployments must provide their own random value of at least 32 characters.

For compatibility with old applications, a missing, short, or legacy secret
does not stop the process. Jazzy instead creates a random **ephemeral** signing
secret and logs a deprecation warning. This applies in every environment, so a
forgotten `APP_ENV=production` cannot reactivate the known legacy secret.
Existing tokens become invalid after the next restart, so setting a persistent
`JWT_SECRET` is still required before production use.

```text
[Jazzy Deprecation] JWT_SECRET is missing, too short, or uses the legacy default.
Jazzy generated an ephemeral signing secret for this process, so all JWTs will
be invalid after restart. Set JWT_SECRET to a cryptographically random value.
```

## Credentials belong in the request body

Do not accept passwords, reset tokens, or API secrets from the query string.
URLs are commonly retained in browser history, proxy logs, and access logs.

Use `ctx.bodyInput()` for credentials. It accepts JSON and
`application/x-www-form-urlencoded` bodies, while deliberately ignoring query
parameters.

```nim
proc handleLogin(ctx: Context) {.async.} =
  let email = ctx.bodyInput("email")
  let password = ctx.bodyInput("password")

  # Verify password, then issue a deliberately small claim set.
```

`ctx.input()` is still convenient for ordinary filters and search parameters,
but it checks the query string first and is not appropriate for credentials.

## Password storage

Use `hashPassword()` when registering a user and `verifyPassword()` when they
sign in. Jazzy stores a versioned PBKDF2-HMAC-SHA256 hash with a unique random
salt and a 600,000-iteration work factor. `passwordHashNeedsRehash()` helps
upgrade legacy password hashes after a successful login.

```nim
if verifyPassword(password, user.getString("password")):
  if passwordHashNeedsRehash(user.getString("password")):
    DB.table("users").where("id", user.getInt("id")).update(%*{
      "password": hashPassword(password)
    })
```

Choose an application password policy that supports long passphrases and apply
rate limiting to login endpoints. Jazzy's rate limiter is opt-in; it is not
automatically attached to login routes.

## CSRF: choose by authentication mechanism

| Client authentication | `CSRF_ENABLED` | What to do |
|---|---:|---|
| Server-to-server or mobile Bearer API | `false` | Send `Authorization: Bearer …`; do not depend on browser cookies. |
| Browser forms using `auth_token` | `true` | Include `ctx.csrfToken()` as a hidden `_csrf` form field. |
| Browser JavaScript using `auth_token` | `true` | Read `csrf_token` and send it in `X-CSRF-Token`. |

CSRF protection is a browser-cookie concern. `SameSite=Lax` is useful defense
in depth, but it does not replace a CSRF token for cookie-authenticated state
changes.

## Dev UI

The Dev UI can inspect configuration, clear cache, and execute SQL. It is
therefore disabled unless both conditions are true:

```env
APP_ENV=development
DEV_UI_ENABLED=true
```

Never enable it on a public or production deployment. The setting is ignored
when `APP_ENV` is anything other than `development`.

## API and browser hardening

- Attach `rateLimit()` to public and authentication endpoints. The built-in
  store is in-memory, so use infrastructure-level protection as well when you
  run more than one process.
- `cors()` defaults to `Access-Control-Allow-Origin: *`. Restrict
  `allowedOrigin` for browser clients that should be trusted.
- Enforce authorization in every handler. A valid JWT proves authentication;
  it does not prove a user may access a particular record.
- Do not use `GET` routes for state-changing operations.
- Configure TLS, redirects, HSTS, backups, and network access controls at the
  reverse proxy or platform layer.

## Security testing

Jazzy tests its password hashes, JWT validation, CSRF behavior, configuration
warnings, and generated project defaults. Add application tests for ownership
checks, role changes, sensitive workflows, and the exact data returned by your
own login endpoints.
