---
title: Database Quickstart
description: Build a complete typed PostgreSQL or SQLite CRUD API with Jazzy's CLI.
---

<div class="database-hero">
  <p class="database-kicker">THE JAZZY DATABASE PATH</p>
  <h2>From <code>.env</code> to a working CRUD API.</h2>
  <p>Generate the migration, model, and controller. Then wire five routes and ship a typed JSON API with the same code on SQLite or PostgreSQL.</p>
  <div class="database-badges">
    <span>CLI-first</span><span>SQLite</span><span>PostgreSQL</span><span>Typed ORM</span><span>Async</span>
  </div>
</div>

This is the database page to read first. In one pass, you will build a Notes
API with list, show, create, update, and delete endpoints.

New Jazzy projects include a small Todo starter. This guide deliberately adds
`Note` alongside it, so every CLI command works in a brand-new project without
overwriting the starter files.

## Start with a project

```bash
jazzy new notes_api
cd notes_api
```

## The complete path

<div class="database-path">
  <a href="#1-configure-the-driver"><strong>01</strong><span>Configure</span><small>Choose SQLite or PostgreSQL.</small></a>
  <a href="#2-generate-and-run-a-migration"><strong>02</strong><span>Migrate</span><small>Version the notes table.</small></a>
  <a href="#3-generate-the-model"><strong>03</strong><span>Model</span><small>Generate a typed ORM mapping.</small></a>
  <a href="#4-generate-the-controller"><strong>04</strong><span>CRUD</span><small>Implement five awaited actions.</small></a>
  <a href="#6-run-it"><strong>05</strong><span>Run</span><small>Register routes and make requests.</small></a>
</div>

## 1. Configure the driver

Jazzy loads `.env` automatically. New code does not call `connectDB()`.

### SQLite

```env title=".env"
DB_CONNECTION=sqlite
DB_DATABASE=database.sqlite
```

### PostgreSQL

Replace the SQLite lines with a PostgreSQL URL:

```env title=".env"
DB_CONNECTION=postgres
DATABASE_URL=postgresql://jazzy:secret@127.0.0.1:5432/notes_api

# Per Mummy OS worker. Start small and measure before raising these.
DB_POOL_MIN=1
DB_POOL_MAX=1
```

<aside class="db-callout db-callout-info">
  <strong>One application API.</strong> Migrations, the query builder, and the
  ORM read <code>DB_CONNECTION</code>. Switching drivers does not mean adding
  <code>connectPostgres()</code> or changing controller code.
</aside>

## 2. Generate and run a migration

Ask the CLI to create the versioned migration file:

```bash
jazzy make:migration create_notes
```

It creates a timestamped file under `src/migrations/`, including an `id`,
timestamps, and a matching rollback. Keep the generated migration name, then
add the two domain fields:

```nim title="src/migrations/m20260918143000_create_notes.nim"
import jazzy

migration "20260918143000_create_notes":
  up:
    await createTable("notes")
      .increments("id")
      .string("title")
      .string("body")
      .timestamps()
      .execute()
  down:
    await dropTable("notes")
```

Preview, apply, and inspect it:

```bash
# Lists pending files. It does not execute the migration body.
jazzy migrate --pretend

# Applies every pending migration.
jazzy migrate

# Shows applied batches and pending files.
jazzy migrate:status
```

<aside class="db-callout db-callout-warn">
  <strong>A migration protects you from schema surprises.</strong>
  <code>createTable()</code> now fails if the table already exists, so Jazzy
  cannot silently mark a migration as applied against a different table. Do
  not change a migration that has been applied in another environment; create
  a new migration with <code>alterTable(...)</code> instead.
</aside>

Only intentionally idempotent local setup should opt in to a collision being
ignored:

```nim
await createTable("local_cache")
  .ifNotExists()
  .increments("id")
  .execute()
```

## 3. Generate the model

Generate the ordinary Nim source file:

```bash
jazzy make:model Note
```

The CLI creates `src/models/note.nim`. Replace its skeleton with fields that
match the migration exactly:

```nim title="src/models/note.nim"
import jazzy

model Note:
  table "notes"

  id int64
  title string
  body string
  timestamps()
```

That one block gives you `Note.find()`, `Note.create()`, `Note.patch()`,
`Note.destroy()`, fluent typed queries, and `modelData(...)` for JSON
responses. It is still normal Nim source—there is no base class, hidden
connection, or second database package.

## 4. Generate the controller

Generate the five-action controller skeleton:

```bash
jazzy make:controller NoteController
```

It creates `src/controllers/note_controller.nim`. Import the model and replace
the placeholder actions with this complete JSON CRUD controller:

```nim title="src/controllers/note_controller.nim"
import jazzy
import std/json
import ../models/note

# GET /notes
proc index*(ctx: Context) {.async.} =
  let notes = await Note.orderBy("id", "DESC").get()
  ctx.json(modelData(notes))

# GET /notes/:id
proc show*(ctx: Context) {.async.} =
  let note = await Note.find(ctx.param("id"))
  if note.isNone:
    ctx.status(404).json(%*{"error": "Note not found"})
    return

  ctx.json(modelData(note.get()))

# POST /notes
proc store*(ctx: Context) {.async.} =
  let data = ctx.validate(%*{
    "title": "required|min:3",
    "body": "required|min:3"
  })

  let note = await Note.create(Note(
    title: data["title"].getStr,
    body: data["body"].getStr
  ))

  ctx.status(201).json(modelData(note))

# PATCH /notes/:id
proc update*(ctx: Context) {.async.} =
  # Rules without `required` validate a supplied field and allow it to be absent.
  let data = ctx.validate(%*{
    "title": "min:3",
    "body": "min:3"
  })

  # Whitelist patchable fields. Unknown request keys never reach the model.
  var changes = newJObject()
  for field in ["title", "body"]:
    if data.hasKey(field):
      changes[field] = data[field]

  if changes.len == 0:
    ctx.status(422).json(%*{"error": "Send title or body"})
    return

  let note = await Note.patch(ctx.param("id"), changes)
  if note.isNone:
    ctx.status(404).json(%*{"error": "Note not found"})
    return

  ctx.json(modelData(note.get()))

# DELETE /notes/:id
proc destroy*(ctx: Context) {.async.} =
  let deleted = await Note.destroy(ctx.param("id"))
  if deleted == 0:
    ctx.status(404).json(%*{"error": "Note not found"})
    return

  ctx.status(204).text("")
```

<aside class="db-callout db-callout-tip">
  <strong>The important rhythm:</strong> every database action is awaited, but
  its name stays natural: <code>await Note.find(...)</code>,
  <code>await Note.patch(...)</code>, and <code>await Note.orderBy(...).get()</code>.
  There are no <code>findAsync</code>-style method names.
</aside>

## 5. Register the routes

Import the generated controller and add the five routes to `src/router.nim`:

```nim title="src/router.nim"
import jazzy
import controllers/note_controller

proc registerRoutes*() =
  Route.groupPath("/notes"):
    Route.get("/", note_controller.index)
    Route.post("/", note_controller.store)
    Route.get("/:id", note_controller.show)
    Route.patch("/:id", note_controller.update)
    Route.delete("/:id", note_controller.destroy)
```

Your project may keep the starter Todo routes too. This group is independent.

## 6. Run it

Start the app:

```bash
nimble c -r src/app.nim
```

In another terminal, exercise every endpoint:

```bash
# Create
curl -X POST http://localhost:8080/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Ship the docs","body":"Finish the PostgreSQL CRUD guide."}'

# List and show
curl http://localhost:8080/notes
curl http://localhost:8080/notes/1

# Partial update, then delete
curl -X PATCH http://localhost:8080/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Ship the polished docs"}'
curl -X DELETE http://localhost:8080/notes/1
```

You now have a complete CRUD API. The same controller and model work on
SQLite and PostgreSQL; only `.env` changes.

## Continue from here

- For joins, aggregates, raw SQL, and lower-level updates, read [Query Builder](/jazzyframework/en/database/).
- For foreign keys, indexes, rename/drop operations, and new schema changes, read [Schema Builder](/jazzyframework/en/schema/).
- For rollbacks, seeders, production safeguards, and `migrate:fresh`, read [Migrations & Seeders](/jazzyframework/en/migrations/).
- For relations, factories, casts, model events, eager loading, and pagination, read [Typed ORM](/jazzyframework/en/orm/).

## Existing Jazzy projects

Existing SQLite projects stay compatible with `connectDB("database.sqlite")`
and hand-written schema setup. Adopt `.env`, migrations, and the ORM gradually.
The current database API is await-first; preview the safe conversion for an
older project before applying it:

```bash
# Shows a colorized diff; does not write files.
jazzy upgrade db-async

# Writes only safe conversions.
jazzy upgrade db-async --apply

# Useful in CI: exits non-zero if conversion work remains.
jazzy upgrade db-async --check
```
