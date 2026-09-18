---
title: Schema
description: Define SQLite and PostgreSQL tables with Jazzy's fluent schema builder.
---

The schema builder creates tables with Nim code. It supports SQLite and
PostgreSQL and follows the database selected in your `.env` file.

For a new application, put table definitions in a versioned
[migration](/jazzyframework/en/migrations/) instead of running them on every
HTTP server start.

<div class="docs-hero" data-wordmark="DDL">
  <p class="docs-kicker">SCHEMA CHANGES ARE CODE</p>
  <h2>Define, evolve, and reverse tables with the same fluent style.</h2>
  <p>Keep the table shape beside its rollback. Jazzy maps the schema safely to SQLite or PostgreSQL from the project environment.</p>
  <div class="docs-badges"><span>createTable()</span><span>alterTable()</span><span>reversible migrations</span></div>
</div>

<div class="journey-path">
  <a href="#1-define-a-table"><strong>01</strong><span>Create</span><small>Start with an explicit table shape.</small></a>
  <a href="#indexes-and-foreign-keys"><strong>02</strong><span>Protect</span><small>Add indexes and foreign keys.</small></a>
  <a href="#change-an-existing-table"><strong>03</strong><span>Evolve</span><small>Add, rename, or remove fields.</small></a>
  <a href="#schema-builder-vs-migrations"><strong>04</strong><span>Deploy</span><small>Version each reviewed change.</small></a>
</div>

## 1. Define a Table

```nim
# src/migrations/m20260917143000_create_todos.nim
import jazzy

migration "20260917143000_create_todos":
  up:
    await createTable("todos")
      .increments("id")
      .string("title")
      .boolean("completed", default = false)
      .timestamps()
      .softDeletes()
      .execute()
  down:
    await dropTable("todos")
```

`execute()` performs database I/O, so it must be prefixed with `await`.

The code above creates a table with this shape:

| Column | Purpose |
| --- | --- |
| `id` | Auto-incrementing primary key |
| `title` | Required text |
| `completed` | Required boolean, defaulting to `false` |
| `created_at` / `updated_at` | Automatic timestamps |
| `deleted_at` | Enables soft deletes |

## 2. Run It Through a Migration

Place the builder call inside a migration's `up:` section, then apply it once:

```bash
jazzy make:migration create_todos
jazzy migrate
```

Jazzy loads `.env` when the migration runs. No manual `connectDB()` call is
needed in a new application. Use the same migration code for SQLite and
PostgreSQL; only the `.env` settings change.

## Available Column Types

| Builder method | SQLite | PostgreSQL | Use it for |
| --- | --- | --- | --- |
| `.increments("id")` | `INTEGER PRIMARY KEY AUTOINCREMENT` | `BIGSERIAL PRIMARY KEY` | Numeric primary keys |
| `.string("name")` | `TEXT` | `TEXT` | Text, names, emails |
| `.string("code", length = 20)` | `VARCHAR(20)` | `VARCHAR(20)` | Length-limited text |
| `.integer("views")` | `INTEGER` | `INTEGER` | Whole numbers |
| `.bigInteger("user_id")` | `INTEGER` | `BIGINT` | Large IDs and foreign keys |
| `.boolean("active")` | `INTEGER` (`1`/`0`) | `BOOLEAN` | True/false values |
| `.timestamp("published_at")` | `DATETIME` | `TIMESTAMP` | Date and time values |
| `.timestamps()` | two `DATETIME` columns | two `TIMESTAMP` columns | `created_at`, `updated_at` |
| `.softDeletes()` | `deleted_at DATETIME` | `deleted_at TIMESTAMP` | Soft deletes |

## Nullable Columns and Defaults

Columns are required by default. Pass `nullable = true` for a column that may
contain `NULL`.

```nim
await createTable("profiles")
  .increments("id")
  .string("display_name")
  .string("bio", nullable = true)
  .integer("reputation", default = 0)
  .boolean("is_public", default = true)
  .timestamp("published_at", nullable = true)
  .execute()
```

For timestamps, use `default = "CURRENT_TIMESTAMP"` when the database should
create the value itself:

```nim
await createTable("events")
  .increments("id")
  .timestamp("happened_at", default = "CURRENT_TIMESTAMP")
  .execute()
```

## Indexes and Foreign Keys

Declare indexes and constraints alongside the table they protect. Jazzy quotes
all table, column, and generated-index identifiers for both supported drivers.

```nim
await createTable("posts")
  .increments("id")
  .foreignId("author_id")
    .constrained("users")
    .onDelete("CASCADE")
  .string("slug")
  .string("title")
  .unique("slug")
  .index("author_id", "created_at")
  .timestamps()
  .execute()
```

`foreignId()` adds a BIGINT-compatible column. Follow it with
`constrained("table")`, or use `references("id").onTable("users")` for an
explicit target. `onDelete()` and `onUpdate()` accept `CASCADE`, `RESTRICT`,
`SET NULL`, `SET DEFAULT`, and `NO ACTION`.

`unique()` and `index()` accept one or more column names. Their generated names
are stable, so they can be safely used by migrations on SQLite and PostgreSQL.

## Change an Existing Table

The first migration creates a table. Most real migrations evolve one that is
already in production: add a field, rename it, or remove an obsolete one.
Always make a **new** migration; do not rewrite a migration that is already
deployed.

```bash
jazzy make:migration add_due_date_to_tasks
```

Use `alterTable()` for portable column changes. The `down:` block must reverse
the schema shape deliberately:

```nim
migration "20260918103000_add_due_date_to_tasks":
  up:
    await alterTable("tasks")
      .addTimestamp("due_at", nullable = true)
      .addBoolean("remind_owner", default = false)
      .execute()
  down:
    # Rolling back removes the fields added above.
    await alterTable("tasks")
      .dropColumn("remind_owner")
      .dropColumn("due_at")
      .execute()
```

### Rename a column

```nim
migration "20260918104500_rename_users_name":
  up:
    await renameColumn("users", "name", "full_name")
  down:
    await renameColumn("users", "full_name", "name")
```

### Remove a column

```nim
migration "20260918110000_remove_tasks_legacy_note":
  up:
    await alterTable("tasks").dropColumn("legacy_note").execute()
  down:
    # The column shape comes back; deleted values cannot be recovered.
    await alterTable("tasks")
      .addString("legacy_note", nullable = true)
      .execute()
```

`dropColumn()` permanently removes the stored values. Back up or copy data to
a replacement column before dropping a field if you may need those values.

### Rename or remove a table

Use `await renameTable("old_name", "new_name")` for a table rename. To remove
a whole table, use `await dropTable("temporary_imports")` in `up:` and recreate
its complete schema in `down:` if rollback must restore the table definition.
Dropping a table, like dropping a column, does not preserve its rows.

For a portable operation the current builder does not expose yet, use reviewed
static DDL with `DB.rawExec()` in the migration.

## Table Options

`createTable()` is strict by default. This is deliberate: a migration must
fail if a table of the same name already exists, rather than being recorded as
applied against an unknown schema. For intentionally idempotent local setup,
opt in to `IF NOT EXISTS` explicitly.

```nim
await createTable("audit_logs")
  .ifNotExists()
  .increments("id")
  .string("message")
  .execute()
```

Jazzy quotes names generated by the schema builder, so a reserved word such as
`order` can be used as a table name:

```nim
await createTable("order")
  .increments("id")
  .string("status")
  .execute()
```

## Schema Builder vs. Migrations

The schema builder describes table changes. Migrations decide **when** a
change runs, record it, and provide a rollback path. Use both together for
production changes.

Once the table exists, use the [Database](/jazzyframework/en/database/) query
builder or the optional [ORM](/jazzyframework/en/orm/) to read and write rows.
