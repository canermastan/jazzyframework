---
title: Installation
description: Get up and running with Jazzy.
---

## Meet Jazzy 🎷
Jazzy is a productive, developer-friendly web framework for Nim. It's designed to let you write less code while building more features. If you love clean syntax and high performance, you're in the right place.

## Server Requirements
Jazzy runs on the **Nim** programming language. Ensure you have Nim installed:
- Nim >= 2.0.0

## Installing Jazzy
You can install Jazzy via Nimble, the Nim package manager:

```bash
nimble install jazzy
```

## Your First Project
Let's spin up a "Hello World" application in seconds.

### 1. Create `app.nim`
Create a new file named `app.nim` and start the server:

```nim
import jazzy

# Define a simple route handler
proc home(ctx: Context) =
  ctx.text("Hello Jazzy!")

# Register the route
Route.get("/", home)

# Serve on port 8080
Jazzy.serve(8080)
```

### 2. Run It
Run your application using the Nim compiler:

```bash
nim c -r app.nim
```

You should see:
```
🎷 Jazzy is dancing on http://localhost:8080
```

Open your browser and visit `http://localhost:8080`. Welcome to Jazzy!
