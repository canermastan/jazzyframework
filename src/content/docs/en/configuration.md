---
title: Configuration
description: Environment variables and settings.
---

Jazzy utilizes standard `.env` files for configuration. This keeps your sensitive credentials out of your code.

## Automatic Loading
When you start your Jazzy application, it automatically looks for a `.env` file in the project root and loads variables into the environment.

```env
# .env
APP_ENV=development
LOG_LEVEL=debug
DEV_UI_ENABLED=true
CSRF_ENABLED=false
JWT_SECRET=replace-with-a-random-secret-of-at-least-32-characters
```

## Security Settings

### `JWT_SECRET`

`JWT_SECRET` signs the tokens created by `ctx.login()`. Use a cryptographically
random value of at least 32 characters, keep it outside version control, and
do not change it casually: changing it invalidates every existing JWT.

Projects created with `jazzy new` receive a random 64-character secret in their
local `.env` file. For production, set the value through your deployment
environment or secret manager.

### `CSRF_ENABLED`

Set `CSRF_ENABLED=true` for browser applications that use Jazzy's `auth_token`
cookie. Jazzy will then protect unsafe requests (`POST`, `PUT`, `PATCH`, and
`DELETE`) with a CSRF token.

Stateless APIs that authenticate exclusively with `Authorization: Bearer` can
leave it disabled. This is the default for projects created by `jazzy new`:

```env
CSRF_ENABLED=false
```

### `DEV_UI_ENABLED`

The Dev UI can execute SQL and inspect application state. It is disabled unless
both `APP_ENV=development` and `DEV_UI_ENABLED=true` are set. This setting is
ignored in production.

### Upgrading Existing Applications

For backwards compatibility, existing applications that do not set `JWT_SECRET`
still start. Jazzy does not reuse the known legacy secret: it creates a random
ephemeral signing secret instead. Existing JWTs are invalid after the next
restart until you configure a persistent secret. Jazzy prints this startup
warning:

```text
[WARN ] [Jazzy Deprecation] JWT_SECRET is missing, too short, or uses the legacy default.
Jazzy generated an ephemeral signing secret for this process, so all JWTs will
be invalid after restart. Set JWT_SECRET to a cryptographically random value.
```

Add a secure `JWT_SECRET` before the next major release. If the old application
used Jazzy's legacy default secret, rotating it will invalidate old login tokens
and users will need to sign in again.

Production applications with no `CSRF_ENABLED` setting also receive a warning.
They continue with CSRF disabled until you explicitly opt in, so a framework
update does not break existing forms or clients.

## Accessing Configuration
You can access these values anywhere in your application using `getConfig`.

```nim
import jazzy

let secret = getConfig("JWT_SECRET")
```

## Type-Safe Config
If you prefer type safety, you can wrap `getConfig` in your own logic.

```nim
proc getPort*(): int =
  try:
    getConfig("APP_PORT").parseInt
  except:
    8080
```
