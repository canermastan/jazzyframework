---
title: Dev UI
description: Interactive developer console for route management, database exploration, and more.
---

Jazzy includes a powerful, built-in developer console accessible at `/dev-ui`. It provides real-time insights into your application's state, environment, and data.

## Features

### 1. Dashboard
Get a high-level overview of your application, including total routes, environment variables, and database status.

### 2. Route Inspector
View all registered routes, HTTP methods, and their associated middleware stacks. This is extremely useful for debugging complex routing logic.

### 3. Environment Viewer
Inspect your current `.env` configuration and environment variables securely (only available in development mode).

### 4. Database Explorer
A full-featured SQL client built into your browser:
- **Table Browser:** List all tables and row counts.
- **Schema Viewer:** View detailed column definitions, types, and constraints.
- **SQL Console:** Execute raw SQL queries and see real-time results.
- **Insert Generator:** Automatically generate `INSERT` templates for any table.

### 5. Cache Management
View all active keys in `AppCache` and clear them with a single click.

---

## Security

Jazzy takes security seriously. The Dev UI is designed **exclusively for development**.

- **Auto-Disabled in Production:** If `APP_ENV` is set to `production` in your `.env`, the `/dev-ui` route is completely disabled and will return `404`.
- **Automatic Registration:** You don't need to import or configure anything. Calling `Jazzy.serve()` will automatically register the Dev UI if the app is in development mode.

```env
# .env
APP_ENV=development # Enables Dev UI
```

## Accessing

Once your application is running, navigate to:
`http://localhost:8080/dev-ui`
