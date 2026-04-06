---
title: Static Files
description: High-performance static content serving with ETag caching and traversal protection.
---

# Static File Serving

Jazzy provides built-in methods for efficiently serving static assets like images, CSS, and JavaScript. You can serve files globally for your entire application or protect specific directories using route-specific static routes.

## Global Static Serving

Use `Jazzy.serveStatic` to mount a directory to a URL prefix globally. This is the recommended way for public assets.

```nim
import jazzy

# Mount the "public" directory to the "/public" URL path (default)
Jazzy.serveStatic("public")

# Mount a different directory to a custom path
# Access via: http://localhost:8080/static/logo.png
Jazzy.serveStatic("assets", "/static")

Jazzy.serve(8080)
```

### Parameters
- **directory**: The local path to the directory containing your static files.
- **urlPrefix**: (Optional) The URL prefix where the files will be served. Defaults to `"/public"`.

---

## Route-Specific Static Serving (Protected)

If you need to serve static files only for specific paths or want to apply **middleware** (like authentication) to your static assets, use `Route.staticRoute`.

```nim
import jazzy

# Protected Static File Serving with Basic Auth
# Only accessible with valid credentials (configured in .env)
Route.staticRoute("admin_docs", "/admin/docs", basicAuthGuard)

# You can also pass a list of multiple middlewares
Route.staticRoute("private_files", "/private", @[authGuard, loggingMiddleware])

Jazzy.serve(8081)
```

### Parameters
- **directory**: The local path to the directory containing your static files.
- **urlPath**: The URL path where the files will be served.
- **middlewares**: (Optional) A single `Middleware` or a sequence `seq[Middleware]` to be applied before serving the files.

---

## Features

Jazzy's static file handler is optimized for production use:

- **Async I/O:** Uses high-performance asynchronous file reading.
- **Smart Mime Types:** Automatically detects content types based on file extensions.
- **ETag Caching:** Automatically generates and validates ETags to reduce bandwidth.
- **Last-Modified Header:** Full support for standard browser caching mechanisms.
- **Security:** Built-in protection against directory traversal attacks.
- **Default Index:** Automatically serves `index.html` when a directory is requested.

## Caching Strategy

By default, Jazzy sets a `Cache-Control` header of `public, max-age=3600` for all static files. It also handles `If-None-Match` headers and returns `304 Not Modified` when appropriate, saving server resources and speeding up page loads.
