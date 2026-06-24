---
title: JSON Helpers
description: Simple and robust utilities for working with JSON.
---

# JSON Helpers

Jazzy provides robust utility methods for `JsonNode` out of the box to make working with JSON data as simple as Laravel. 

When dealing with HTTP requests and JSON data, you often need to handle missing fields, invalid types, or convert string payloads into booleans or integers safely without throwing exceptions (like `KeyError` or `JsonKindError`).

## Checking Existence

### `isNull`
Checks if a key doesn't exist in the JSON object or if its value is explicitly `JNull`.

```nim
let data = %*{"name": "Alice", "age": 30, "address": newJNull()}

if data.isNull("email"):
  echo "Email is missing"

if data.isNull("address"):
  echo "Address is null"
```

### `has`
The inverse of `isNull`. Returns `true` only if the key exists and its value is not null.

```nim
if data.has("name"):
  echo "Name is present!"
```

## Safe Value Retrieval

All retrieval methods gracefully fallback to a default value if the key is missing or invalid.

### `getString`
Safely retrieves a string. If the value is an integer or boolean, it automatically converts it to a string (`"123"`, `"true"`, etc.).

```nim
let email = data.getString("email", "unknown@example.com")
```

### `getInt`
Safely retrieves an integer. If the JSON payload sends the number as a string (e.g., `"30"`), it will automatically parse it into an integer.

```nim
# Even if age was provided as "30" (string), this returns int 30
let age = data.getInt("age", 18)
```

### `getFloat`
Safely retrieves a float. Automatically parses strings and converts integers.

```nim
let price = data.getFloat("price", 0.0)
```

### `getBool`
Safely retrieves a boolean. It handles true/false booleans, but also intelligently catches common string or integer boolean representations: `"true"`, `"1"`, `"false"`, `"0"`.

```nim
# Safely parses "1" or "true" string to boolean true
let isAdmin = data.getBool("is_admin", false)
```

## Nested Structures

### `getObject` & `getArray`
Retrieve nested JSON Objects and Arrays safely. If the key is missing or not of the expected type, they return an empty `JObject` (`{}`) or empty `JArray` (`[]`).

```nim
let tags = data.getArray("tags")
for tag in tags:
  echo tag.getStr()

let preferences = data.getObject("preferences")
if preferences.getBool("dark_mode"):
  echo "Dark mode enabled"
```
