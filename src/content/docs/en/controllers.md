---
title: Controllers
description: Organizing your request handling logic.
---

While you can define all your logic in closures within the `router.nim` file, realistic applications organize this behavior into **Controllers**.

In Jazzy, a "Controller" is simply a Nim module containing procedures that accept a `Context`.

## Writing a Controller

Controllers typically live in `src/controllers/`.

**Important:** All controller procedures must be marked with `{.async.}`.

```nim
# src/controllers/user_controller.nim
import jazzy

# Display a user profile
proc show*(ctx: Context) {.async.} =
  let id = ctx.param("id")
  
  # Fetch user from database
  let user = DB.table("users").where("id", id).first()
  
  ctx.json(%*{
    "id": id, 
    "user": user,
    "role": "member"
  })

# Create a new user
proc create*(ctx: Context) {.async.} =
  let email = ctx.input("email")
  let password = ctx.input("password")
  
  # Hash the password
  let hashedPassword = hashPassword(password)
  
  # Insert the new user into the database
  let newId = DB.table("users").insert(%*{
    "email": email,
    "password": hashedPassword,
    "role": "user"
  })
  
  ctx.status(201).text("Created")
```

## Registering Controllers
Once your controller is written, you simply import it and register it in your router.

```nim
# src/router.nim
import jazzy
import controllers/user_controller

Route.get("/users/:id", user_controller.show)
Route.post("/users", user_controller.create)
```

## Common Scenarios

### 1. Returning JSON Data
Ideal for APIs.

```nim
proc apiIndex*(ctx: Context) {.async.} =
  ctx.json(%*{
    "version": "1.0",
    "status": "healthy",
    "timestamp": 123456789
  })
```

### 2. Handling File Uploads
Checking for files and saving them.

```nim
import std/os

proc uploadAvatar*(ctx: Context) {.async.} =
  let file = ctx.file("avatar")
  
  if file.filename.len == 0:
    ctx.status(400).text("No file uploaded")
    return

  # Save the file content
  writeFile("public/uploads/" & file.filename, file.content)
  
  ctx.text("File uploaded successfully: " & file.filename)
```

### 3. Reading Headers
Useful for custom authentication or tracking.

```nim
proc debugInfo*(ctx: Context) {.async.} =
  if ctx.request.headers.hasKey("X-Debug-Mode"):
    ctx.text("Debug mode enabled")
  else:
    ctx.text("Normal mode")
```

### 4. Dependency Injection (Service Pattern)
To keep controllers thin, move business logic to Services.

```nim
# src/controllers/auth_controller.nim
import ../services/auth_service

proc login*(ctx: Context) {.async.} =
  let email = ctx.input("email")
  let password = ctx.input("password")
  
  # Delegate complex logic to service
  let token = auth_service.attemptLogin(email, password)
  
  if token.len > 0:
    ctx.json(%*{"token": token})
  else:
    ctx.status(401).json(%*{"error": "Invalid credentials"})
```
