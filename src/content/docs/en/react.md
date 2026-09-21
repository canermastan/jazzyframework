---
title: React Frontend
description: Use Jazzy as a JSON API for a React application built with Vite or another frontend toolchain.
---

Jazzy works well as a JSON API for a separately built React application. This
guide uses React + TypeScript with Vite, but the API layout applies to any
React toolchain.

```text
React application  ->  /api/*  ->  Jazzy
```

Keep browser-specific rendering, routing, and asset bundling in React. Keep
validation, authentication, database access, and API responses in Jazzy.

## Create the React application

Create the frontend beside the Jazzy application:

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm run dev
```

Vite serves the application from `http://localhost:5173` by default. Keep the
Jazzy application on a different port during development, for example `8080`.

## Expose an API from Jazzy

Apply CORS to the API group and set the development origin explicitly. Do not
use `"*"` for a production API unless it is intentionally public.

```nim
import jazzy
import jazzy/core/middlewares

proc health(ctx: Context) {.async.} =
  ctx.json(%*{"status": "ok"})

Route.groupPath("/api", @[cors("http://localhost:5173")]):
  Route.get("/health", health)

Jazzy.serve(8080)
```

`cors()` handles `OPTIONS` preflight requests and permits the `Authorization`
request header by default. When the React development server uses another
origin, pass that exact origin to `cors()` instead. See [CORS](/jazzyframework/en/cors/)
for the complete middleware reference.

Run the server with the normal project command. For a single source file this
is, for example:

```bash
nim c -r --path:src app.nim
```

## Call Jazzy from React

Put the API base URL in the frontend environment so production does not depend
on a development port:

```dotenv
# frontend/.env.development
VITE_API_BASE_URL=http://localhost:8080
```

Then keep HTTP calls in a small client module:

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

export async function getHealth(): Promise<{ status: string }> {
  const response = await fetch(`${apiBaseUrl}/api/health`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}
```

For authenticated APIs, send a bearer token in the `Authorization` header.
Jazzy's built-in CORS middleware does not add `Access-Control-Allow-Credentials`,
so a cookie-based cross-origin setup needs either a same-origin deployment or a
dedicated credential-aware middleware.

## Build and deploy

Build the React application:

```bash
cd frontend
npm run build
```

The recommended production arrangement is a reverse proxy or static host that
serves `frontend/dist` at `/` and forwards `/api/` to Jazzy. This makes the
application same-origin, so CORS is unnecessary in production and browser
cookies can use their usual same-origin behavior.

Jazzy can also serve the built assets itself:

```nim
Jazzy.serveStatic("frontend/dist", "/")
```

Register that middleware before `Jazzy.serve()`. Requests for files in the
build directory are served directly; requests such as `/api/health` continue
to the router. See [Static Files](/jazzyframework/en/static-files/) for static
file serving options.

This static middleware serves existing files and directory `index.html`
files. It does not provide a single-page-app history fallback for arbitrary
paths such as `/settings`. Use React hash routing, configure the proxy/static
host with an `index.html` fallback, or add explicit Jazzy routes when using
browser history routing.
