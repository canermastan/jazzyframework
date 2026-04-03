---
title: Cache
description: Simple, fast, in-memory caching system bound to your request context.
---

Jazzy includes a lightweight, built-in memory cache system. Caching frequently accessed data or expensive operations can drastically improve your application's performance.

The cache is globally shared across requests but can be conveniently accessed directly from the `Context` object via `ctx.cache`.

## Storing Items

You can store data in the cache using the `put` method. The third parameter is the Time-To-Live (TTL) in **seconds**. If omitted, it defaults to **3600 seconds (1 hour)**.

```nim
# Put a string. By default, it stays for 1 hour (3600 seconds)
ctx.cache.put("token", "xyz123")

# Put a string that only lasts for 15 seconds
ctx.cache.put("sms_code", "1234", 15)
```

### Storing JSON

The cache is heavily optimized to store and retrieve Nim `JsonNode` types, which makes it perfect for API responses.

```nim
import std/json

let data = %*{
  "name": "Jazzy",
  "role": "admin"
}

# Cache the JsonNode (defaults to 1 hour)
ctx.cache.put("user_data", data)
```

## Retrieving Items

You can retrieve standard string values using the `get` method.

```nim
let value = ctx.cache.get("token")

# If the key doesn't exist (or expired), it returns an empty string "".
# You can provide a custom fallback default value:
let fallback = ctx.cache.get("missing_key", "default_value")
```

### Retrieving JSON

To safely retrieve JSON data, use the `getJson` method. If the key doesn't exist, has expired, or contains invalid JSON, it returns `JNull`.

```nim
let retrieved = ctx.cache.getJson("user_data")

if retrieved.kind == JObject:
  echo "Welcome back, ", retrieved["name"].getStr()
```

You can also provide a default JSON node to be returned if the cache misses:

```nim
let defJson = %*{"default": true}
let missingDef = ctx.cache.getJson("missing_json", defJson)
```

## Checking for Existence

To quickly check if a key exists and hasn't expired, use the `has` method.

```nim
if ctx.cache.has("token"):
  echo "Cache hit!"
```

## Removing Items

You can manually remove items from the cache using `delete`.

```nim
ctx.cache.delete("to_delete")
```

## Expiration & Pruning

Jazzy's cache handles expiration lazily by default. This means if you `.get()` or `.has()` a key whose TTL has already passed, the cache will automatically delete it and return the default value/`false`.

However, if you want to aggressively clean up all expired memory in the background, you can manually call the `prune` method.

```nim
ctx.cache.prune()
```

## Controller Example

Here is a full example of a controller utilizing the cache to avoid unnecessary database queries:

```nim
import jazzy

proc getProfile*(ctx: Context) {.async.} =
  let userId = ctx.request.params.getOrDefault("id")
  let cacheKey = "user_profile_" & userId

  # 1. Check if the profile is in the cache
  if ctx.cache.has(cacheKey):
    let cachedData = ctx.cache.getJson(cacheKey)
    ctx.json(%*{
      "source": "cache",
      "data": cachedData
    })
    return

  # 2. Simulate an expensive database query
  # In a real app, you would query your DB here
  let dbData = %*{
     "id": userId,
     "username": "jazzy_dev",
     "rank": "diamond"
  }

  # 3. Store the result in the cache for 15 minutes (900 seconds)
  ctx.cache.put(cacheKey, dbData, 900)

  # 4. Return the freshly fetched data
  ctx.json(%*{
    "source": "database",
    "data": dbData
  })
```
