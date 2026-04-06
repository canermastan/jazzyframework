---
title: Getting Started
description: Learn how to create and build a modern web application with Jazzy.
---

Jazzy is a modern, high-performance web framework for Nim. This guide will walk you through creating a new project, setting up your database, and building your first API.

## 1. Create a New Project

The easiest way to start is using the Jazzy CLI. Run the following command to bootstrap a new project:

```bash
# Create a new project
jazzy new my_project

# Enter the directory
cd my_project

# Install project dependencies
nimble install -y
```

This creates a project structure with `app.nim`, `router.nim`, `schema.nim`, a `.env` file, and an `app.db` SQLite database.

## 2. Configuration (.env)

Your project includes a `.env` file for environment-specific configuration. Here are the key variables:

```env
APP_ENV=development      # development or release
LOG_LEVEL=info           # debug, info, warn, error, none
TRUST_PROXY=false        # set to true if running behind Nginx/Proxy
BODY_LIMIT_MB=10         # global request body size limit

JWT_SECRET=your_secret   # if you use guard for JWT auth
# BASIC_AUTH_USER=admin    # if you use basicAuthGuard
# BASIC_AUTH_PASSWORD=pass # if you use basicAuthGuard
```

## 3. Database Schema (schema.nim)

Jazzy uses a simple, fluent migration system. Define your tables in `schema.nim`:

```nim
import jazzy

proc initSchema*() =
  # Create todos table
  createTable("todos")
    .increments("id")
    .string("title")
    .boolean("completed", default = false)
    .execute()

  # Create users table
  createTable("users")
    .increments("id")
    .string("username")
    .string("password")
    .execute()
```

## 4. Controllers and Validation

Controllers handle request logic. You can use Laravel-style validation directly in your handlers:

```nim
# controllers/todo_controller.nim
import jazzy

proc create*(ctx: Context) {.async.} =
  # Validate incoming JSON
  let data = ctx.validate(%*{
    "title": "required|min:3",
    "completed": "bool"
  })

  # Validation passed! 'data' is a JsonNode with validated values.
  let title = data["title"].getStr
  
  # Insert into database using the Query Builder
  DB.table("todos").insert(%*{
    "title": title,
    "completed": false
  })

  ctx.status(201).json(%*{"status": "created"})

proc list*(ctx: Context) {.async.} =
  # Fetch all todos
  let todos = DB.table("todos").get()
  ctx.json(todos)
```

## 5. Routing (router.nim)

Organize your routes in `router.nim` and use route groups for common prefixes or middlewares:

```nim
# router.nim
import jazzy
import controllers/todo_controller

proc registerRoutes*() =
  # Public route
  Route.get("/ping", proc(ctx: Context) {.async.} = ctx.text("pong"))

  # Grouped routes with path prefix and middleware
  Route.groupPath("/todos", guard): # Protected by JWT guard
    Route.get("/", todo_controller.list)
    Route.post("/", todo_controller.create)
```

## 6. Putting it All Together (app.nim)

Your main entry point connects to the database, initializes the schema, registers routes, and starts the server:

```nim
# app.nim
import jazzy
import schema
import router

proc main() =
  # 1. Connect to SQLite
  connectDB("app.db")

  # 2. Run migrations (creates tables if they don't exist)
  initSchema()

  # 3. Register routes from router.nim
  registerRoutes()

  # 4. Start the server
  Jazzy.serve(8080)

if isMainModule:
  loadEnv(".env")
  main()
```

## Running Your App

Simply run your `app.nim`:

```bash
nim c -r app.nim
```

Your API is now running on `http://localhost:8080`. You can access the **Dev UI** at `http://localhost:8080/dev-ui` to inspect routes, database tables, and system logs.
