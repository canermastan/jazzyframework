---
title: Responses
description: Returning JSON, Text, and Status Codes.
---

Jazzy's `Context` object captures the HTTP response and provides fluent helpers to make sending data intuitive.

## Basic Responses

### Text
Send plain text. Content-Type is `text/plain` by default.

```nim
proc ping*(ctx: Context) {.async.} =
  ctx.text("pong")
```

### HTML
Send raw HTML. Content-Type is `text/html`.

```nim
proc home*(ctx: Context) {.async.} =
  ctx.html("<h1>Welcome to Jazzy</h1><p>Fast & Simple.</p>")
```

### JSON
Send a JSON object or array. Content-Type is `application/json`.

```nim
proc api*(ctx: Context) {.async.} =
  ctx.json(%*{
    "status": "success",
    "data": [1, 2, 3]
  })
```

## Status Codes & Headers

### Setting Status Codes
Chain `.status(code)` before sending content.

```nim
proc create*(ctx: Context) {.async.} =
  # Resource created
  ctx.status(201).json(%*{"id": 10})
```

### Custom Headers
Chain `.header(key, value)` to set headers.

```nim
proc caching*(ctx: Context) {.async.} =
  ctx.header("Cache-Control", "no-cache")
     .status(200)
     .text("Fresh Content")
```

## Advanced Scenarios

### Redirects
To redirect a user, set the status to `302` (Found) or `301` (Moved Permanently) and provide a `Location` header.

```nim
proc oldPage*(ctx: Context) {.async.} =
  # Redirect to the new homepage
  ctx.status(301)
     .header("Location", "/new-home")
     .text("Redirecting...") 
```

### File Downloads
To force the browser to download a response as a file, use the `Content-Disposition` header.

```nim
proc downloadReport*(ctx: Context) {.async.} =
  let csvContent = "id,name\n1,Jazzy\n2,Nim"
  
  ctx.header("Content-Type", "text/csv")
     .header("Content-Disposition", "attachment; filename=\"report.csv\"")
     .text(csvContent)
```

### Empty Responses (204 No Content)
Useful for DELETE operations.

```nim
proc deleteUser*(ctx: Context) {.async.} =
  # ... perform deletion ...
  ctx.status(204).text("") 
```
