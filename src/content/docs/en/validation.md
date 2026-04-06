---
title: Validation
description: Laravel-style input validation for Jazzy APIs.
---

# Input Validation

Jazzy includes a powerful validation engine inspired by Laravel. It allows you to define validation rules for incoming JSON data in a declarative way.

## Basic Usage

The `ctx.validate()` helper automatically parses the request body and validates it against your rules. If validation fails, Jazzy will automatically return a **422 Unprocessable Entity** response with detailed error messages.

```nim
import jazzy

proc register(ctx: Context) {.async.} =
  let data = ctx.validate(%*{
    "username": "required|min:3|max:20",
    "email":    "required|email",
    "age":      "int|min:18"
  })

  # If we reach here, validation PASSED.
  # 'data' is a JsonNode containing the validated input.
  
  let user = DB.table("users").insert(data)
  ctx.json(%*{"status": "success", "id": user})
```

---

## Available Validation Rules

- **`required`**: The field must be present and not empty.
- **`string`, `int`, `bool`, `float`, `json`**: Type checks.
- **`email`**: Validates basic email format.
- **`min:X`**: Minimum length (string/array) or minimum value (int/float).
- **`max:X`**: Maximum length (string/array) or maximum value (int/float).
- **`in:foo,bar,baz`**: The value must be one of the listed options.

---

## Advanced Usage

### Automatic 422 Handling
By default, if `ctx.validate()` fails, it throws a `ValidationError`. Jazzy catches this automatically and returns a standardized JSON response:

```json
{
  "errors": {
    "username": "Field 'username' is required",
    "age": "Field 'age' must be at least 18"
  }
}
```

### Manual Validation
If you want to validate a `JsonNode` manually without the automatic 422 response, you can catch the error:

```nim
proc manualValidation(ctx: Context) {.async.} =
  try:
    let data = ctx.validate(%*{"title": "required"})
  except ValidationError as e:
    # Custom error handling logic
    ctx.status(400).json(%*{"my_custom_errors": e.errors})
```
