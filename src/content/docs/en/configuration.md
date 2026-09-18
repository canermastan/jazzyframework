---
title: Configuration
description: Environment variables and settings.
---

Jazzy utilizes standard `.env` files for configuration. This keeps your sensitive credentials out of your code.

<div class="docs-hero" data-wordmark=".ENV">
  <p class="docs-kicker">CONFIGURE ONCE</p>
  <h2>Keep the app code portable. Let the environment choose the runtime.</h2>
  <p>Jazzy loads the project’s <code>.env</code> automatically for the server, migrations, seeders, and first database query.</p>
  <div class="docs-badges"><span>one .env</span><span>local SQLite</span><span>production PostgreSQL</span></div>
</div>

<div class="choice-grid">
  <a class="choice-card" href="#database-settings"><strong>LOCAL</strong><span>SQLite without a server</span><small>One database file; no manual connection call.</small></a>
  <a class="choice-card" href="#postgresql"><strong>PRODUCTION</strong><span>PostgreSQL pool settings</span><small>A compact per-worker pool and a single URL.</small></a>
  <a class="choice-card" href="#security-settings"><strong>SECURITY</strong><span>JWT, CSRF, Dev UI</span><small>Settings whose defaults deserve attention.</small></a>
</div>

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

## A Good Starting `.env`

This is a complete, safe starting point for a local SQLite application. Copy
it into `.env`, then replace `JWT_SECRET` with a private random value.

```env
# Application
APP_ENV=development
LOG_LEVEL=debug

# Local developer tools
DEV_UI_ENABLED=true

# Database
DB_CONNECTION=sqlite
DB_DATABASE=database.sqlite

# HTTP and proxies
BODY_LIMIT_MB=10
TRUST_PROXY=false

# Browser cookie authentication
CSRF_ENABLED=false

# Keep this private. Use at least 32 random characters.
JWT_SECRET=replace-with-a-random-secret-of-at-least-32-characters
```

For PostgreSQL, replace only the database block:

```env
DB_CONNECTION=postgres
DATABASE_URL=postgresql://jazzy:secret@127.0.0.1:5432/my_app
DB_POOL_MIN=1
DB_POOL_MAX=1
```

## Database Settings

Jazzy configures the database automatically from `.env`. New applications do
not need an explicit `connectDB()` call.

### SQLite (default)

```env
DB_CONNECTION=sqlite
DB_DATABASE=database.sqlite
```

`DB_CONNECTION` defaults to `sqlite` and `DB_DATABASE` defaults to
`database.sqlite`, so a minimal local project can omit both values.

### PostgreSQL

```env
DB_CONNECTION=postgres
DATABASE_URL=postgresql://jazzy:secret@127.0.0.1:5432/my_app
DB_POOL_MIN=1
DB_POOL_MAX=1
```

| Variable | Required | Description |
| --- | --- | --- |
| `DB_CONNECTION` | No | `sqlite` (default) or `postgres`. |
| `DB_DATABASE` | SQLite | SQLite file path. |
| `DATABASE_URL` | PostgreSQL | PostgreSQL connection URL. |
| `DB_POOL_MIN` | No | Minimum PostgreSQL connections per Mummy worker. Defaults to `1`. |
| `DB_POOL_MAX` | No | Maximum PostgreSQL connections per Mummy worker. Defaults to `1`. |

Pool settings apply to each HTTP worker. Keep them small at first: with four
workers and `DB_POOL_MAX=1`, Jazzy can use at most four PostgreSQL
connections. MySQL and MariaDB are not supported yet.

Migrations and the first query both load this configuration lazily. Run
migrations before starting the server:

```bash
jazzy migrate
```

When `APP_ENV=production`, Jazzy requires `--force` for database-changing
migration and seeder commands. This prevents an unattended deployment from
resetting or changing the wrong database by accident:

```bash
jazzy migrate --force
jazzy db:seed --force
```

## Application, HTTP, and Proxy Settings

| Variable | Default | What it changes |
| --- | --- | --- |
| `APP_ENV` | `development` | Use `development` locally and `production` after deployment. Production disables Dev UI and requires a secure `JWT_SECRET`. |
| `LOG_LEVEL` | `DEBUG` in development, `INFO` in production | One of `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`, or `NONE`. `NONE` disables framework logs. |
| `DEV_UI_ENABLED` | `false` | Set `true` only for local development. It has no effect unless `APP_ENV=development`. |
| `BODY_LIMIT_MB` | `10` | Default maximum request body size, in MiB, when your app uses `bodyLimit()` without a size. |
| `TRUST_PROXY` | `false` | Set `true` only when a reverse proxy you control sets `X-Forwarded-For` / `Forwarded` headers. It changes `ctx.ip()`. |

### Production Example

```env
APP_ENV=production
LOG_LEVEL=info
DEV_UI_ENABLED=false
TRUST_PROXY=true
BODY_LIMIT_MB=10

DB_CONNECTION=postgres
DATABASE_URL=postgresql://jazzy:secret@db.internal:5432/my_app
DB_POOL_MIN=1
DB_POOL_MAX=1

CSRF_ENABLED=true
JWT_SECRET=use-a-private-random-value-with-at-least-32-characters
```

Only set `TRUST_PROXY=true` when your deployment is actually behind a trusted
proxy or load balancer. Otherwise a client could forge forwarding headers and
make `ctx.ip()` report the wrong address.

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

Jazzy also keeps custom values, so `.env` is a convenient home for your own
settings:

```env
PAYMENTS_API_URL=https://payments.example.com
FEATURE_NEW_CHECKOUT=true
```

```nim
let paymentsUrl = getConfig("PAYMENTS_API_URL")
let newCheckoutEnabled = getConfig("FEATURE_NEW_CHECKOUT") == "true"
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
