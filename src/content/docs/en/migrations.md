---
title: Migrations and seeders
description: Version, deploy, reset, and seed database changes with Jazzy.
---

Migrations are reviewed, versioned database changes. Instead of recreating a
schema every time the server starts, create a migration, commit it, and apply
it once with the Jazzy CLI. Jazzy records completed migrations in the
`jazzy_migrations` table.

`jazzy new my_app` already creates `src/migrations/` and an initial migration.
Configure `.env`, then run:

```bash
jazzy migrate
```

`jazzy migrations:init` is only for an existing project created before
migrations were available. It creates the visible `src/migrations/` folder.

> **Want the whole first-project flow?** Read the [Database
> Quickstart](/jazzyframework/en/database-quickstart/) first. It configures the
> driver, fills in a migration, creates a matching model, seeds data, and
> deploys it safely.

<div class="docs-hero" data-wordmark="UP / DOWN">
  <p class="docs-kicker">A CHANGE YOU CAN REVIEW</p>
  <h2>Every schema change has a name, a history entry, and a way back.</h2>
  <p>Generate a small source file, describe the forward and reverse changes, then let the CLI compile and apply it against the database selected by <code>.env</code>.</p>
  <div class="docs-badges"><span>timestamped files</span><span>transactional</span><span>production guard</span></div>
</div>

<div class="journey-path">
  <a href="#create-a-migration"><strong>01</strong><span>Make</span><small>Create a reviewed source file.</small></a>
  <a href="#evolve-or-remove-an-existing-schema"><strong>02</strong><span>Describe</span><small>Write up and down together.</small></a>
  <a href="#run-migrations"><strong>03</strong><span>Preview</span><small>Inspect what will run.</small></a>
  <a href="#seeders"><strong>04</strong><span>Seed</span><small>Add deliberate demo data.</small></a>
</div>

## Create a Migration

Use a descriptive name. Jazzy gives the file a sortable timestamp.

```bash
jazzy make:migration create_users
```

This creates a file like `src/migrations/m20260917143000_create_users.nim`.

The timestamp is the current time, so your exact filename and migration name
will differ. Because this is an unambiguous `create_users` name, Jazzy gives
you a working table skeleton and its matching rollback immediately:

:::note[The exact generated file]

```nim title="src/migrations/m20260917143000_create_users.nim"
import jazzy

migration "20260917143000_create_users":
  up:
    await createTable("users")
      .increments("id")
      .timestamps()
      .execute()
  down:
    await dropTable("users")
```

:::

Add the columns your application needs to the generated `up:` block. For
example, a first `users` table might become:

```nim
import jazzy

migration "20260917143000_create_users":
  up:
    await createTable("users")
      .increments("id")
      .string("name")
      .string("email")
      .timestamps()
      .execute()
  down:
    await dropTable("users")
```

Jazzy only fills in that rollback when the name clearly means “create one
table.” For `add_due_date_to_tasks`, `rename_users_name`, or a migration that
creates several tables, it does not make a destructive guess. Its generated
`down:` comment includes `await dropTable("TABLE_NAME")` for the table-create
case; for every other change, write the inverse operation shown in the next
section.

`up` moves the schema forward. `down` must reverse that exact change so
`jazzy migrate:rollback` can undo the latest batch. Use the [Schema](/jazzyframework/en/schema/)
builder where possible; use trusted static DDL with `DB.rawExec()` for a change
the builder cannot express yet.

Never edit a migration after it has been deployed. Write a new corrective
migration instead.

## Evolve or Remove an Existing Schema

The migration above is only the first table. For the everyday case--adding,
renaming, or removing a field--make a new migration:

```bash
jazzy make:migration remove_users_legacy_timezone
```

```nim
migration "20260918110000_remove_users_legacy_timezone":
  up:
    await alterTable("users").dropColumn("legacy_timezone").execute()
  down:
    # Restores the column definition, not the values that were removed.
    await alterTable("users")
      .addString("legacy_timezone", nullable = true)
      .execute()
```

Use `alterTable("users").addString(...)`, `.addInteger(...)`,
`.addBigInteger(...)`, `.addBoolean(...)`, or `.addTimestamp(...)` to add
columns. Use `await renameColumn("users", "old", "new")` for a rename;
`await dropTable("temporary_imports")` removes a whole table. See
[Schema](/jazzyframework/en/schema/) for the full add/rename/drop workflow and
the data-loss precautions around destructive changes.

## Run Migrations

```bash
# Apply every pending migration in one batch.
jazzy migrate

# Apply each pending migration in its own batch.
jazzy migrate --step

# Read-only preview: list the migrations that would run.
jazzy migrate --pretend

# List completed migrations, batch numbers, and pending files.
jazzy migrate:status

# Reverse the newest batch, or every batch.
jazzy migrate:rollback
jazzy migrate:reset
```

Nim migration bodies are ordinary compiled code, not a restricted SQL DSL.
For that reason `--pretend` honestly lists the pending migration names; it does
not claim to print SQL it cannot know without running your code. It does not
create the migration-history table.

`jazzy migrate:fresh` drops the tables in Jazzy's default database namespace
and runs every migration again. It is useful for disposable local databases,
but destructive:

```bash
jazzy migrate:fresh
```

Run migrations as an explicit deploy or startup step, before starting the web
server. All database-changing migration commands require `--force` when
`APP_ENV=production`:

```bash
jazzy migrate --force
jazzy migrate:fresh --force
```

## No `migrate.nim` to Maintain

Projects only keep the migration files you review in `src/migrations/`. When a
migration command runs, Jazzy scans those files and creates a short-lived
compiled runner at `.jazzy/migration_runner.nim`. The `.jazzy/` folder is in
the generated `.gitignore` and is recreated automatically if it is removed.

There is no visible registry file and no `migrate.nim` that a developer can
accidentally delete. This keeps Nim's compile-time imports while keeping the
project tree clean.

## Seeders

Seeders insert intentional demo, development, or reference data. They never
run as part of a normal `jazzy migrate`, so deploying a schema cannot silently
insert sample data.

```bash
jazzy make:seeder demo_users
jazzy db:seed
```

The CLI creates a file such as `src/seeders/s20260917150000_demo_users.nim`:

```nim
import jazzy

seed "20260917150000_demo_users":
  discard await DB.table("users").insert(%*{
    "name": "Ada Lovelace"
  })
```

Every declared `model` also has a typed `factory()` helper. It persists the
models built by your closure; Jazzy deliberately does not invent random values
for your application fields. This is the same seeder written with a `User`
model instead of `DB.table()`:

```nim title="src/seeders/s20260917150100_demo_users_with_factory.nim"
import jazzy
import models/user

seed "20260917150100_demo_users_with_factory":
  discard await User.factory(3, proc(index: int): User =
    User(
      name: "Demo user " & $(index + 1),
      email: "demo-" & $index & "@example.com",
      active: true
    )
  )
```

Use one approach for a given demo row set: `DB.table()` is ideal for a small
direct insert, while `User.factory()` keeps fixture values typed and is useful
when creating several records.

Seeders run in deterministic filename/name order. For a fresh local database
with seed data in one command, use:

```bash
jazzy migrate:fresh --seed
```

Like migrations, `jazzy db:seed` and `migrate:fresh --seed` require `--force`
in production.

## Transaction Safety

Every migration and its history row run in one transaction. SQLite uses an
immediate transaction on its shared connection. PostgreSQL pins one async pool
connection for the complete migration, even when the normal application pool
has more than one connection.

A failing migration therefore does not leave a half-created table or a false
history record. Seeders are intentionally independent application data code;
make each seeder idempotent when it may be run more than once.
