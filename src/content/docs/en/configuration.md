---
title: Configuration
description: Environment variables and settings.
---

Jazzy utilizes standard `.env` files for configuration. This keeps your sensitive credentials out of your code.

## Automatic Loading
When you start your Jazzy application, it automatically looks for a `.env` file in the project root and loads variables into the environment.

```env
# .env
APP_PORT=8080
JWT_SECRET=secret-key
DATABASE_URL=app.db
```

## Accessing Configuration
You can access these values anywhere in your application using `getConfig`.

```nim
import jazzy

let secret = getConfig("JWT_SECRET")
```

## Type-Safe Config
If you prefer type safety, you can wrap `getConfig` in your own logic.

```nim
proc getPort*(): int =
  try:
    getConfig("APP_PORT").parseInt
  except:
    8080
```
