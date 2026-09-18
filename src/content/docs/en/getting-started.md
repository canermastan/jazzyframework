---
title: Getting Started
description: Build a small JSON API with Jazzy, SQLite or PostgreSQL, and the query builder.
---

This guide builds a small Todo API. The same application works with SQLite for
local development or PostgreSQL in production.

<div class="docs-hero" data-wordmark="START">
  <p class="docs-kicker">YOUR FIRST JAZZY API</p>
  <h2>Six small steps. One working Todo API.</h2>
  <p>Follow the path in order, or jump straight to the part you need. The application code stays the same for local SQLite and production PostgreSQL.</p>
  <div class="docs-badges"><span>~10 minutes</span><span>SQLite or PostgreSQL</span><span>await-first</span></div>
</div>

<div class="journey-path">
  <a href="#1-create-a-project"><strong>01</strong><span>Create</span><small>Generate a clean app.</small></a>
  <a href="#2-configure-the-database"><strong>02</strong><span>Configure</span><small>Pick SQLite or PostgreSQL.</small></a>
  <a href="#3-apply-the-first-migration"><strong>03</strong><span>Migrate</span><small>Create the Todo table once.</small></a>
  <a href="#4-create-a-controller"><strong>04</strong><span>Write</span><small>Add awaited CRUD actions.</small></a>
  <a href="#5-register-routes"><strong>05</strong><span>Route</span><small>Connect HTTP to code.</small></a>
  <a href="#6-start-the-application"><strong>06</strong><span>Run</span><small>Send the first request.</small></a>
</div>

## 1. Create a Project

```bash
jazzy new todo_app
cd todo_app
nimble install -y
```

The generated project includes `app.nim`, `router.nim`, a first migration, a
controller, and `.env`. There is no migration runner file to manage: the CLI
generates its ignored runner in `.jazzy/` when needed.

## 2. Configure the Database

For SQLite, the generated `.env` is already enough:

```dotenv
APP_ENV=development
DEV_UI_ENABLED=true
DB_CONNECTION=sqlite
DB_DATABASE=database.sqlite
JWT_SECRET=replace-with-a-random-secret-of-at-least-32-characters
```

For PostgreSQL, replace the SQLite settings with a URL:

```dotenv
DB_CONNECTION=postgres
DATABASE_URL=postgresql://jazzy:secret@127.0.0.1:5432/todo_app
DB_POOL_MIN=1
DB_POOL_MAX=1
```

Jazzy reads `.env` automatically. Do not add `connectDB()` to a new project.

## 3. Apply the First Migration

The generated `src/migrations/m00000000000000_create_todos.nim` creates the
Todo table. Apply it once before starting the app:

```bash
jazzy migrate
```

The migration selects SQLite or PostgreSQL from `DB_CONNECTION`. To evolve the
schema later, create another migration with `jazzy make:migration <name>`.

## 4. Create a Controller

Create `controllers/todo_controller.nim`:

```nim
import jazzy

proc list*(ctx: Context) {.async.} =
  let todos = await DB.table("todos")
    .orderBy("id", "DESC")
    .get()
  ctx.json(todos)

proc create*(ctx: Context) {.async.} =
  let data = ctx.validate(%*{
    "title": "required|min:3"
  })

  let todo = await DB.table("todos")
    .returning("id", "title", "completed", "created_at")
    .insert(%*{
      "title": data["title"].getStr,
      "completed": false
    })

  ctx.status(201).json(todo)

proc complete*(ctx: Context) {.async.} =
  let changed = await DB.table("todos")
    .where("id", ctx.param("id"))
    .update(%*{"completed": true})

  if changed == 0:
    ctx.status(404).json(%*{"error": "Todo not found"})
    return

  ctx.json(%*{"status": "completed"})
```

Notice that each database operation uses `await`. The route parameter in
`ctx.param("id")` is a string; Jazzy automatically handles the PostgreSQL
numeric cast when the column is a normal numeric ID.

## 5. Register Routes

Create `router.nim`:

```nim
import jazzy
import controllers/todo_controller

proc registerRoutes*() =
  Route.groupPath("/todos"):
    Route.get("/", todo_controller.list)
    Route.post("/", todo_controller.create)
    Route.patch("/:id/complete", todo_controller.complete)
```

## 6. Start the Application

Connect the pieces in `app.nim`:

```nim
import jazzy
import router

proc main() =
  registerRoutes()
  Jazzy.serve(8080)

when isMainModule:
  main()
```

Run the application:

```bash
nimble c -r src/app.nim
```

Try it:

```bash
curl -X POST http://localhost:8080/todos/ ^
  -H "Content-Type: application/json" ^
  -d "{\"title\": \"Learn Jazzy\"}"
```

Then open `http://localhost:8080/todos/` in a browser or HTTP client.

## Next Steps

- Learn the complete [Database](/jazzyframework/en/database/) API.
- Learn how [Migrations](/jazzyframework/en/migrations/) and the optional [ORM](/jazzyframework/en/orm/) work.
- Add [validation](/jazzyframework/en/validation/) rules to controllers.
- Learn how [routing](/jazzyframework/en/routing/) and middleware work.
- Use the local-only [Dev UI](/jazzyframework/en/dev-ui/) while developing.
