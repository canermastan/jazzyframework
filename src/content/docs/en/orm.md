---
title: ORM
description: Define typed Jazzy models on top of the await-first query builder.
---

Jazzy's ORM is optional. It is a typed layer over the same `DB.table()` query
builder, not a second database client. Models use the same `.env` driver,
SQLite locking, PostgreSQL async pool, timestamps, and soft-delete behavior as
raw builder code.

Use it when a typed model makes application code clearer. Keep using the query
builder for ad-hoc joins, aggregates, or custom SQL; both work in one project.

> **First model?** The [Database Quickstart](/jazzyframework/en/database-quickstart/)
> shows the matching migration, a small model file, and real awaited CRUD in
> one continuous example. This page is the complete ORM reference.

<div class="docs-hero" data-wordmark="MODEL">
  <p class="docs-kicker">TYPED MODELS, OPTIONAL MAGIC</p>
  <h2>Write Nim objects. Keep the query builder whenever it is the clearer tool.</h2>
  <p>The ORM is a thin typed layer over Jazzy’s existing database connection and await-first API—not a second client or a separate runtime.</p>
  <div class="docs-badges"><span>single model block</span><span>typed CRUD</span><span>batched relations</span></div>
</div>

<div class="journey-path">
  <a href="#define-a-model"><strong>01</strong><span>Model</span><small>Declare an object and its mapping together.</small></a>
  <a href="#read-models"><strong>02</strong><span>Read</span><small>Find, filter, order, and paginate typed data.</small></a>
  <a href="#create-update-and-patch"><strong>03</strong><span>Write</span><small>Create and safely change records.</small></a>
  <a href="#relations"><strong>04</strong><span>Relate</span><small>Batch related records without N+1 queries.</small></a>
</div>

## ORM at a glance

Already comfortable with an ORM? This is the fast path. Every operation that
talks to the database uses `await`; query methods build a chain and only run at
`get()`, `first()`, `count()`, or `paginate()`.

| You need to… | Use this |
| --- | --- |
| Fetch one by key | `await User.find(id)` → `Option[User]` |
| Fetch one or fail | `await User.findOrFail(id)` → `User` |
| Fetch all | `await User.all()` → `seq[User]` |
| Filter records | `await User.where("active", true).get()` |
| Compare with an operator | `User.where("age", ">=", 18)` |
| Add alternatives | `.orWhere(...)`, `.orWhereNull(...)`, `.orWhereIn(...)` |
| Match NULL or a list | `.whereNull(...)`, `.whereNotNull(...)`, `.whereIn(...)`, `.whereNotIn(...)` |
| Sort and slice | `.orderBy("id", "DESC").limit(20).offset(40)` |
| Select columns | `User.where(...).select("id", "email").get()` |
| Count or paginate | `await User.where(...).count()` / `.paginate(page = 1, perPage = 20)` |
| Create one model | `await User.create(User(name: "Ada"))` |
| Replace writable fields | `await User.update(id, User(...))` → `Option[User]` |
| Patch request fields safely | `await User.patch(id, %*{"name": "Ada"})` → `Option[User]` |
| Update a filtered group | `await User.where(...).patch(%*{...})` → affected rows |
| Persist local changes | `user = await user.save()` |
| Delete one / a filtered group | `await User.destroy(id)` / `await User.where(...).delete()` |
| Include deleted records | `User.withTrashed()` / `User.onlyTrashed()` |
| Restore or force-delete | `await User.onlyTrashed().where(...).restore()` / `.forceDelete()` |
| Eager-load relations | `await User.with("posts.comments", "roles").get()` |
| Build test/demo records | `User.make(...)` / `await User.factory(...)` |
| Serialize one or many models | `modelData(user)` / `modelData(users)` |

The familiar chain is the recommended reading order:

```nim
let users = await User
  .where("active", true)
  .orderBy("id", "DESC")
  .limit(20)
  .get()
```

`User.orderBy(...).get()` is equally valid for an unfiltered list. `query()`
exists as a low-level starting point, but normal application code rarely needs
to call it directly.

### Need the database API instead?

The ORM is optional, not a wall around the database. For joins, aggregates,
unmapped reports, or a small one-off update, use the same configured pool
through `DB.table()` or `DB.raw()`. You can freely mix these with models in one
application:

```nim
# Fluent builder: useful for joins, aggregates, and ad-hoc result shapes.
let publishedCount = await DB.table("posts")
  .where("author_id", ctx.param("id"))
  .where("published", true)
  .count()

# Raw SQL: `?` placeholders stay portable between SQLite and PostgreSQL.
let rows = await DB.raw(
  "SELECT id, title FROM posts WHERE author_id = ? ORDER BY id DESC",
  ctx.param("id")
)
```

Read [Query Builder](/jazzyframework/en/database/) for joins, returning
records, portable raw placeholders, and the full `DB` API.

## Define a Model

A model is declared in one block. Jazzy creates the Nim object type and its
mapping helpers, so there is no separate `type User = object` declaration.

```nim
# src/models/user.nim
import jazzy

model User:
  table "users"

  id int64
  name string
  email string
  active bool
  timestamps()
```

`table` is explicit. `id` is the default primary key and `timestamps()` adds
`created_at` and `updated_at` string fields.

### Send a model as JSON

Every `model` declaration generates `modelData(value)`. It converts one typed
Nim object, or the `seq[Model]` returned by `get()`, to the `JsonNode` expected
by `ctx.json()`:

```nim
let user = await User.findOrFail(ctx.param("id"))
ctx.json(modelData(user))

let users = await User.orderBy("id", "DESC").get()
ctx.json(modelData(users))
```

Create the matching table in a [migration](/jazzyframework/en/migrations/):

```nim
await createTable("users")
  .increments("id")
  .string("name")
  .string("email")
  .boolean("active", default = false)
  .timestamps()
  .execute()
```

## Nullable Fields, Column Names, and Keys

Use `Option[T]` for a nullable scalar column. A field normally uses its Nim
name as the column name; override it with `column = "..."`. A non-`id` key can
be declared on its field with `primaryKey = true`.

```nim
model ApiKey:
  table "api_keys"

  token string, column = "api_token", primaryKey = true
  displayName string, column = "display_name"
  revokedAt Option[string], column = "revoked_at"
```

`string`, `int`, `int64`, `float`, `bool`, `JsonNode`, native Nim enums,
`DateTime`, and `Option[...]` of these scalar types are supported. Enums are
stored by their Nim name; `DateTime` is stored as an ISO-style timestamp. Add
`import std/times` in a model module that uses `DateTime`. Model queries accept
either the Nim field name or the real database column name:

```nim
let key = await ApiKey.where("displayName", "deploy").first()
let sameKey = await ApiKey.where("display_name", "deploy").first()
```

## Read Models

All ORM database work is asynchronous. Use `await` in a handler or `waitFor`
during startup.

```nim
let user = await User.find(ctx.param("id"))

if user.isNone:
  ctx.status(404).json(%*{"error": "User not found"})
  return

let activeUsers = await User
  .where("active", true)
  .orderBy("id", "DESC")
  .limit(20)
  .get()
```

`find()` and `first()` return `Option[User]`. Model queries support `where`,
`orWhere`, NULL and IN variants, `orderBy`, `select`, `limit`, `offset`, and
soft-delete helpers. `where`, `whereNull`, `whereIn`, and `whereNotIn` can
also start a query directly from the model type.

## Create, Update, and Patch

```nim
let created = await User.create(User(
  name: "Ada Lovelace",
  email: "ada@example.com",
  active: true
))

# Replaces every writable field from the model value.
let updated = await User.update(created.id, User(
  name: "Ada King",
  email: created.email,
  active: true
))

# Changes only named writable fields. It rejects primary keys and timestamps.
let renamed = await User.patch(created.id, %*{"name": "Ada Byron"})

# The same safe partial update can affect a filtered group.
let changed = await User.where("active", false).patch(%*{"active": true})

discard await User.delete(created.id)
```

`create()` returns the saved model. `update()` and `patch(id, ...)` return an
`Option[User]`; `none(User)` means the ID did not match a row. A filtered
`query.patch(...)`, `query.update(...)`, `query.delete()`, `query.restore()`,
and `query.forceDelete()` return their affected-row count.

## Change Tracking and Save

Models loaded from the database remember their original loaded values. This
lets you inspect changes and save only changed, loaded columns:

```nim
var user = (await User.findOrFail(1))
user.name = "Ada Byron"

if user.isDirty("name"):
  echo user.dirty() # @["name"]
  user = await user.save()
```

`save()` returns the refreshed model. That explicit reassignment is important:
Nim value objects cannot safely mutate the caller's object across `await`.
`save()` also protects partial selects—columns that were not loaded are never
silently written back. Use `patch()` for a JSON/request-driven partial update.

## Relations

Declare relations in the same model block. Relation targets must already be in
scope when Nim compiles the source model, so related models are often kept in
one `models.nim` module (or imported in one direction).

```nim
model Post:
  table "posts"
  id int64
  authorId int64, column = "author_id"
  title string

model Role:
  table "roles"
  id int64
  name string

model Profile:
  table "profiles"
  id int64
  userId int64, column = "user_id"
  bio string

model User:
  table "users"
  id int64
  name string

  hasOne profile, Profile, foreignKey = "userId"
  hasMany posts, Post, foreignKey = "authorId"
  belongsToMany roles, Role,
    through = "role_user", foreignKey = "user_id", relatedKey = "role_id"
```

`belongsTo` and `hasOne` return `Future[Option[Target]]`; `hasMany` and
`belongsToMany` return `Future[seq[Target]]`:

```nim
let posts = await user.posts()
let roles = await user.roles()
let profile = await user.profile()
```

Use `with()` to load relations in batches and avoid one query per record:

```nim
let users = await User.with("posts", "roles")
  .orderBy("id")
  .get()

# No new query: posts were loaded by with().
let firstUsersPosts = await users[0].posts()
```

Nested paths stay batched too:

```nim
let users = await User.with("posts.comments", "profile").get()
let posts = await users[0].posts()       # already loaded
let comments = await posts[0].comments() # already loaded
```

For the inverse direction, declare it on the child model:

```nim
belongsTo author, User, foreignKey = "authorId"

let author = await post.author()
```

`foreignKey` is required so the generated query stays explicit. `localKey`
changes the source key, `ownerKey` changes a `belongsTo` target key, and the
many-to-many form needs `through`, `foreignKey`, and `relatedKey` for its
pivot table.

### Write Through Relations

Create a child without manually copying the parent ID, or manage a pivot table
through the declared relation:

```nim
let post = await user.createRelated("posts", Post(title: "Notes"))

discard await user.attach("roles", adminRole.id)
discard await user.detach("roles", adminRole.id)
discard await user.sync("roles", [editorRole.id, reviewerRole.id])
```

`attach()` is idempotent in normal use and returns whether it inserted a pivot
row. Add a composite unique index for the two pivot keys in your migration for
cross-process duplicate protection. `sync()` returns the number of pivot rows
inserted or removed. `createRelated()` supports declared `hasOne` and
`hasMany` relations.

## Factories and Lifecycle Hooks

`make()` builds a typed in-memory value; `factory()` builds and persists it:

```nim
let draft = User.make(proc(): User = User(name: "Draft"))
let users = await User.factory(3, proc(index: int): User =
  User(name: "Demo " & $index)
)
```

Register small synchronous lifecycle hooks on a model type:

```nim
User.beforeCreate(proc(user: var User) =
  user.name = user.name.strip()
)

User.afterDelete(proc(id: int64) =
  echo "Deleted user " & $id
)
```

Available hooks are `beforeCreate`, `afterCreate`, `beforeUpdate`,
`afterUpdate`, `beforeDelete`, and `afterDelete`. They run for `create()`,
typed `update()`, `save()`, and typed `delete()`. Bulk query-builder updates
and `patch()` intentionally skip model hooks because they do not load an
individual model first.

## Scopes and Pagination

Put a reusable query fragment in a `scope` block. The body uses the normal
model-query methods.

```nim
model Post:
  table "posts"
  id int64
  title string
  published bool

  scope public:
    where "published", true
    orderBy "id", "DESC"

let posts = await Post.public().get()
```

`paginate()` returns a typed `Page[T]` with `data`, `total`, `perPage`,
`currentPage`, and `lastPage`.

```nim
let page = await Post.public().paginate(page = 2, perPage = 20)
ctx.json(%*{
  "data": modelData(page.data),
  "total": page.total,
  "page": page.currentPage,
  "last_page": page.lastPage
})
```
