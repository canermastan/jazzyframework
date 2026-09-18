---
title: Database
description: Query SQLite and PostgreSQL with Jazzy's await-first query builder.
---

Jazzy ships with an await-first query builder for **SQLite** and
**PostgreSQL**. The API is intentionally small: start with `DB.table()`, add
conditions, then finish with an operation such as `get()`, `first()`,
`insert()`, or `update()`.

It has the familiar flow of Laravel's query builder, while returning Nim
`JsonNode` values.

```nim
let user = await DB.table("users")
  .where("email", "ada@example.com")
  .first()
```

Every database operation is asynchronous, so call it with `await` inside a
route handler or `waitFor` during application startup.

> **New to Jazzy's database workflow?** Start with the [Database
> Quickstart](/jazzyframework/en/database-quickstart/). It walks through the
> complete `.env` to migration to model to CRUD path before this API reference.

<div class="docs-hero" data-wordmark="DB">
  <p class="docs-kicker">QUERY WITHOUT DRIVER TAX</p>
  <h2>One fluent API for SQLite and PostgreSQL.</h2>
  <p>Compose a query, then await the final operation. Jazzy binds values, quotes builder identifiers, and adapts parameters to the selected driver.</p>
  <div class="docs-badges"><span>DB.table()</span><span>await get()</span><span>SQLite + PostgreSQL</span></div>
</div>

## Choose the right layer

<div class="choice-grid">
  <a class="choice-card" href="/jazzyframework/en/orm/"><strong>TYPE IT</strong><span>Use a model</span><small>Typed records, relations, factories, hooks, and pagination.</small></a>
  <a class="choice-card" href="#2-read-rows"><strong>BUILD IT</strong><span>Use DB.table()</span><small>Direct fluent queries, joins, reports, and partial updates.</small></a>
  <a class="choice-card" href="#raw-sql"><strong>ESCAPE HATCH</strong><span>Use raw SQL</span><small>Trusted driver-specific structure with bound values.</small></a>
</div>

These layers are complementary, not competing: they use the same `.env`
configuration, pool, timestamps, and await-first public API. A project can use
models for normal records and `DB.table()` for reporting in the same handler.

## 1. Choose a Database

New Jazzy applications read the database configuration from `.env`
automatically. You do **not** need to call `connectDB()` in a new project.

### SQLite

SQLite is the default and needs no server process.

```env
DB_CONNECTION=sqlite
DB_DATABASE=database.sqlite
```

### PostgreSQL

Use a PostgreSQL connection URL. Jazzy creates an async connection pool for
each Mummy worker when that worker first needs the database.

```env
DB_CONNECTION=postgres
DATABASE_URL=postgresql://jazzy:secret@127.0.0.1:5432/my_app
DB_POOL_MIN=1
DB_POOL_MAX=1
```

Start with `1` for both pool settings. They apply **per server worker**, so a
four-worker process can use up to four PostgreSQL connections with this
configuration.

`connectDB("old.db")` remains available for existing SQLite applications, but
environment configuration is the recommended approach going forward.

## 2. Read Rows

### Get many rows

`get()` returns a JSON array.

```nim
let publishedPosts = await DB.table("posts")
  .where("published", true)
  .orderBy("created_at", "DESC")
  .limit(20)
  .get()
```

### Get one row

`first()` returns a JSON object, or `newJNull()` when no row matches.

```nim
let user = await DB.table("users")
  .where("email", "ada@example.com")
  .first()

if user.isNull():
  ctx.status(404).json(%*{"error": "User not found"})
  return
```

### Select specific columns

Use `select()` when the response does not need every column.

```nim
let users = await DB.table("users")
  .select("id", "name", "email")
  .orderBy("name")
  .get()
```

### Count rows

```nim
let total = await DB.table("users").count()
let admins = await DB.table("users").where("role", "admin").count()
```

## 3. Add Conditions

Multiple `where()` calls use `AND` logic.

```nim
let posts = await DB.table("posts")
  .where("published", true)
  .where("views", ">=", 100)
  .get()
```

Supported comparison operators are `=`, `!=`, `<>`, `<`, `>`, `<=`, `>=`,
and `LIKE`. Operators are validated by Jazzy instead of being inserted into
SQL unchecked.

### OR conditions

Use `orWhere()` when either condition may match.

```nim
let users = await DB.table("users")
  .where("role", "admin")
  .orWhere("role", "editor")
  .get()
```

### NULL conditions

```nim
let drafts = await DB.table("posts").whereNull("published_at").get()
let published = await DB.table("posts").whereNotNull("published_at").get()

let visible = await DB.table("posts")
  .where("author_id", 7)
  .orWhereNull("author_id")
  .get()
```

`orWhereNotNull()` is available too.

### IN conditions

```nim
let users = await DB.table("users")
  .whereIn("id", [1, 3, 8])
  .whereNotIn("status", ["blocked", "deleted"])
  .get()
```

`orWhereIn()` and `orWhereNotIn()` are available for OR logic. An empty
`whereIn()` safely matches no rows; an empty `whereNotIn()` does not filter
anything out.

### Pagination

```nim
let page = 3
let perPage = 20

let users = await DB.table("users")
  .orderBy("id", "DESC")
  .limit(perPage)
  .offset((page - 1) * perPage)
  .get()
```

An `offset()` without a `limit()` works on both supported drivers as well.

## 4. Insert Rows

Pass a `%*` JSON object to `insert()`. For a regular numeric `id` column it
returns the new `int64` ID.

```nim
let id = await DB.table("users").insert(%*{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "active": true
})
```

If a table has `created_at` and/or `updated_at`, Jazzy fills them with
`CURRENT_TIMESTAMP` when they were not supplied explicitly.

### Get the inserted row with `returning()`

Use `returning()` when you need columns from the record you just changed. It
is especially useful with UUID or custom primary keys, where an integer ID is
not meaningful.

```nim
let user = await DB.table("users")
  .returning("id", "name", "created_at")
  .insert(%*{
    "name": "Ada Lovelace",
    "email": "ada@example.com"
  })

ctx.status(201).json(user)
```

The example above returns one JSON object. Use `returning()` for a mutation
that is expected to affect one record. PostgreSQL uses native SQL `RETURNING`;
Jazzy provides the same result on SQLite as well.

For PostgreSQL tables without an implicit numeric `id` column, prefer
`returning(...).insert(...)`:

```nim
let apiKey = await DB.table("api_keys")
  .returning("token", "created_at")
  .insert(%*{"token": "ef8ed7cf-879d-4ee0-99f4-5c20e92324f4"})
```

## 5. Update Rows

`update()` returns the number of rows changed. This makes a normal “update or
404” controller straightforward.

```nim
let changed = await DB.table("users")
  .where("id", ctx.param("id"))
  .update(%*{"name": "New name"})

if changed == 0:
  ctx.status(404).json(%*{"error": "User not found"})
  return

ctx.json(%*{"status": "updated"})
```

When `updated_at` exists, Jazzy updates it automatically.

To receive the changed record instead, use `returning()`:

```nim
let user = await DB.table("users")
  .where("id", ctx.param("id"))
  .returning("id", "name", "updated_at")
  .update(%*{"name": "New name"})
```

## 6. Delete Rows

`delete()` returns the number of affected rows.

```nim
let deleted = await DB.table("posts").where("id", 42).delete()
```

Always add a `where()` clause unless intentionally changing every row in the
table.

## Soft Deletes

If a table was created with `.softDeletes()`, `delete()` sets `deleted_at`
instead of removing the row. Regular queries automatically ignore those rows.

```nim
# Normal query: deleted rows are hidden.
let posts = await DB.table("posts").get()

# Include active and deleted rows.
let allPosts = await DB.table("posts").withTrashed().get()

# Show only deleted rows.
let trash = await DB.table("posts").onlyTrashed().get()

# Undo a soft delete, or remove the row permanently.
let restored = await DB.table("posts").where("id", 42).restore()
let removed = await DB.table("posts").where("id", 42).forceDelete()
```

`restore()` and `forceDelete()` also return affected-row counts.

## PostgreSQL Type-Aware Parameters

PostgreSQL distinguishes a text parameter from a UUID, `BIGINT`, JSONB, and
other database types. Jazzy looks up the table schema and adds the appropriate
cast for builder operations.

That means route parameters work naturally even though route parameters are
strings:

```nim
# ctx.param("id") is a string; id may be BIGSERIAL/BIGINT in PostgreSQL.
let user = await DB.table("users").where("id", ctx.param("id")).first()
```

The same behaviour applies to booleans, UUIDs, JSON/JSONB, dates, timestamps,
and byte arrays when using the query builder.

## Raw SQL

Use raw SQL for database-specific features or a query shape that the builder
does not yet provide, such as joins. Only send trusted SQL structure; bind
values as parameters.

### Read data

```nim
let rows = await DB.raw(
  "SELECT name, email FROM users WHERE id = ?",
  7
)
```

### Run a statement

```nim
let changed = await DB.rawExec(
  "UPDATE users SET active = ? WHERE email = ?",
  false,
  "ada@example.com"
)
```

Use portable `?` placeholders in raw SQL. Jazzy keeps `?` for SQLite and
converts it to PostgreSQL's `$1`, `$2`, and so on automatically.

PostgreSQL's JSON operators also use a question mark. Write `??` when you
need a literal question mark in a PostgreSQL raw query:

```nim
let result = await DB.raw(
  "SELECT ?::jsonb ?? 'admin' AS has_admin",
  "{\"admin\": true}"
)
```

Raw SQL does not have a table/column name from which Jazzy can infer a
PostgreSQL type. Add an explicit cast when necessary, as in `?::uuid` or
`?::jsonb` above.

## Safety and Portability

- Jazzy quotes table and column identifiers generated by the builder, so names
  such as `order` and `group` work on both SQLite and PostgreSQL.
- Builder values are bound parameters; do not concatenate user input into raw
  SQL.
- Builder identifiers intentionally accept only letters, numbers, and
  underscores. Use raw SQL only for trusted, static SQL syntax.
- SQLite and PostgreSQL are supported today. MySQL/MariaDB support is planned
  but is not available yet.

For table definitions, continue with the [Schema](/jazzyframework/en/schema/)
guide.
