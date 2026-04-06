---
title: Requests
description: Handling input, query params, headers, and file uploads.
---

# Handling Incoming Requests

Every handler in Jazzy receives a `Context` object, which provides simple ways to access incoming data from the client.

## Request Input

### Unified Access: `input()`
The `input()` helper simplifies data retrieval by checking both **query string parameters** and **JSON bodies** automatically.

```nim
proc search(ctx: Context) {.async.} =
  # Works for /search?q=query OR {"q": "query"}
  let query = ctx.input("q")
  
  # With a default value
  let page = ctx.input("page", "1")
  
  ctx.text("Searching for: " & query & " (Page " & page & ")")
```

### Route Parameters: `param()`
For dynamic routes (e.g., `Route.get("/users/:id", ...)`), use the `param()` helper to retrieve values from the URL path.

```nim
proc showUser(ctx: Context) {.async.} =
  let id = ctx.param("id")
  ctx.text("Viewing user with ID: " & id)
```

### Type-Safe Body Parsing: `bodyAs()`
If you want to parse the entire request body into a typed object, use `bodyAs`. This is ideal for structured API payloads.

```nim
type UserDto = object
  username: string
  age: int

proc create(ctx: Context) {.async.} =
  let dto = ctx.bodyAs(UserDto)
  # dto.username and dto.age are now typed values!
  echo dto.username
```

---

## Headers and IP

### Accessing Request Headers
You can access raw request headers directly from the `ctx.request.headers` table.

```nim
proc debugHeaders(ctx: Context) {.async.} =
  if ctx.request.headers.hasKey("User-Agent"):
    let ua = ctx.request.headers["User-Agent"]
    ctx.text("Your browser is: " & ua)
```

### Client IP: `ip()`
Retrieves the client's IP address. It automatically detects and respects the `X-Forwarded-For` or `X-Real-IP` headers if `TRUST_PROXY=true` is set in your `.env`.

```nim
proc checkIp(ctx: Context) {.async.} =
  let ipAddress = ctx.ip()
  ctx.text("Your IP is: " & ipAddress)
```

---

## File Uploads

Jazzy makes handling multi-part file uploads simple. Use the `file()` helper to retrieve uploaded files.

```nim
proc upload(ctx: Context) {.async.} =
  let myFile = ctx.file("avatar")
  
  if myFile.filename.len > 0:
    # myFile.filename: "photo.jpg"
    # myFile.contentType: "image/jpeg"
    # myFile.content: "raw file bytes..."
    
    # Save the file
    writeFile("uploads/" & myFile.filename, myFile.content)
    ctx.text("File uploaded successfully!")
  else:
    ctx.status(400).text("No file uploaded.")
```
