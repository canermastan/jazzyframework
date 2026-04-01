---
title: Requests & Validation
description: Handling input, type-safe parsing, and validation rules.
---

Retrieving input from users and validating it is the bread and butter of web development. Jazzy makes this painless.

## Easiest Access: `input()`
The `input()` helper retrieves values from both query string parameters and the JSON body automatically. It unifies input access.

```nim
proc store(ctx: Context) =
  # Works for /store?name=Jazzy OR {"name": "Jazzy"}
  let name = ctx.input("name")
  
  # With a default value
  let role = ctx.input("role", "guest")
  
  ctx.text("Hello " & name)
```

## Type-Safe Body Parsing
If you have a strict JSON structure, you can parse it directly into a type using `bodyAs`.

```nim
type UserDto = object
  username: string
  age: int

proc create(ctx: Context) =
  let dto = ctx.bodyAs(UserDto)
  # dto.username and dto.age are now typed values!
  echo dto.username
```

## Validation
Jazzy includes a powerful validation engine inspired by Laravel. It automatically validates input and returns a `422 Unprocessable Entity` response with error details if validation fails.

```nim
proc register(ctx: Context) =
  let data = ctx.validate(%*{
    "username": "required|min:3|max:20",
    "email":    "required|string",
    "age":      "int|min:18"
  })

  # If we reach here, validation PASSED.
  # 'data' contains the validated JsonNode.
  
  let user = DB.table("users").insert(data)
  ctx.json(%*{"status": "success", "id": user})
```

### Available Rules
- `required`: The field must be present and not empty.
- `string`, `int`, `bool`: Type checks.
- `min:X`: Minimum length (string) or value (int).
- `max:X`: Maximum length (string) or value (int).
- `in:foo,bar,baz`: Value must be one of the listed options.

### Handling Validation Errors manually
If you want to handle errors yourself instead of the automatic 422 response, you can wrap the call in a try/except block catching `ValidationError`.
