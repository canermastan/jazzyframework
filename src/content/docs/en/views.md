---
title: Melody Templates
description: Build fast, dynamic HTML interfaces using Melody.
---

Jazzy includes a blazing-fast, zero-allocation template engine called **Melody**. It is heavily inspired by Laravel Blade, offering a clean, developer-friendly syntax to build dynamic HTML pages securely.

By default, Jazzy looks for your template files inside the `views/` directory at the root of your project.

:::tip[Developer Experience]
**No server restarts required!** When you are running Jazzy in **development mode**, Melody automatically re-reads your HTML templates from disk on every request. You can just edit your `.html` files, hit save, and refresh your browser.
:::

## Rendering a View

You can render a view and return it to the client using `ctx.render()`. Pass a JSON object to supply data to your template.

```nim
import jazzy
import std/json

Route.get("/", proc(ctx: Context) {.async.} =
  ctx.render("home", %*{
    "title": "Welcome to Jazzy",
    "user": {"name": "Caner"}
  })
)
```
*(This will look for `views/home.html`)*

In your template (`views/home.html`), you can access these variables using the `$` prefix:

```blade
<!DOCTYPE html>
<html>
<body>
  <h1>{{ $title }}</h1>
  <p>Hello, {{ $user.name }}! Welcome back.</p>
</body>
</html>
```

### Rendering Arrays

If you want to pass an array (e.g., results from a database query) to a view, you have two options.
By default, if you pass an array directly, you must iterate over it using the special `$data` variable in your template. 
However, for a better Developer Experience (DX), you can provide an explicit name for your array using the three-parameter render helper. This avoids having to wrap your array in a JSON object manually.

```nim
let dbArray = DB.table("users").get()

# Option 1: Passing an array directly. (Template uses $data)
ctx.render("users", dbArray)

# Option 2: Passing an array with an explicit name. (Template uses usersList)
ctx.render("users", "usersList", dbArray)
```

In your template (`views/users.html`):

```blade
<!-- If you used Option 1, iterate over $data -->
<ul>
  @for user in $data
    <li>{{ $user.name }}</li>
  @endfor
</ul>

<!-- If you used Option 2, iterate over the name you provided -->
<ul>
  @for user in usersList
    <li>{{ $user.name }}</li>
  @endfor
</ul>
```

---

## Template Syntax

### Displaying Variables
Variables passed from your controller can be displayed using double curly braces. This automatically **escapes HTML** to protect against XSS attacks.

```blade
<h1>Hello, {{ $user.name }}</h1>
```

If you need to render **raw HTML** (unescaped), use the `!!` syntax:
```blade
<div>{!! $trustedHtmlContent !!}</div>
```

### Conditionals (`@if`)
You can conditionally render HTML based on boolean variables in your data.

```blade
@if success
  <div class="success">Operation completed!</div>
@else
  <div class="error">Something went wrong.</div>
@endif
```

### Loops (`@for`)
Iterate over JSON arrays easily:

```blade
<ul>
  @for u in users
    <li>{{ $u.name }} ({{ $u.email }})</li>
  @endfor
</ul>
```

---

## Layouts and Partials

To keep your code clean and DRY, Melody supports an advanced two-pass layout system. 

### `main.html` (The Layout)
Create a master layout, typically in `views/layouts/main.html`. Use `@yield` to define areas where child pages will inject content. Use `@include` to pull in reusable components (partials).

```blade
<!-- views/layouts/main.html -->
<!DOCTYPE html>
<html>
<head>
  <title>@yield "title" - Jazzy App</title>
</head>
<body>
  
  @include "partials/navbar"

  <main>
    @yield "content"
  </main>

  @include "partials/footer"

</body>
</html>
```

### `navbar.html` (A Partial)
Partials are small, reusable pieces of HTML. They inherit all variables from the parent template.

```blade
<!-- views/partials/navbar.html -->
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
```

### `home.html` (The Child Page)
Child pages use `@extends` to declare their parent layout, and `@section` to define the content that goes into the parent's `@yield` slots.

```blade
<!-- views/home.html -->
@extends "layouts/main"

@section "title"
  Homepage
@endsection

@section "content"
  <h1>Welcome!</h1>
  <p>This content is injected into the main layout.</p>
@endsection
```

---

## Form Handling Example

When building forms, you often need to return validation errors and keep the user's old input so they don't have to re-type everything. HTML forms send data as `application/x-www-form-urlencoded`, which `ctx.input()` handles automatically!

**Controller:**
```nim
proc submitContact(ctx: Context) {.async.} =
  let name = ctx.input("name")
  
  if name.len == 0:
    ctx.render("contact", %*{
      "error": "Name is required",
      "old": {"name": name}
    })
    return
    
  ctx.render("contact", %*{"success": true})
```

**Template (`views/contact.html`):**
```blade
@if error
  <p style="color: red">{{ $error }}</p>
@endif

<form method="POST" action="/contact">
  <input type="text" name="name" value="{{ $old.name }}">
  <button type="submit">Send</button>
</form>
```

---

## Performance & Caching

Melody is built for extreme speed. Instead of parsing expressions to an AST, it uses memory-safe string spanning.

It also features an automatic **Two-Tier Cache System**:

1. **Development Mode:** Cache is disabled. Templates are re-read from disk on every refresh so you see changes instantly.
2. **Production Mode:** 
   - **Tier-1 (File Cache):** Templates are stored in memory. The engine monitors file `mtime` and automatically invalidates the cache if the file changes.
   - **Tier-2 (Render Cache):** You can use `ctx.renderCached("page", data, ttl=3600)` to cache the final, compiled HTML output for extreme performance on pages that rarely change.

---

## Legacy Syntax (Deprecated)

Older versions of Melody required parentheses and a different loop syntax. While these are still supported for backward compatibility, they will emit a runtime warning in the console and should be migrated to the new Nim-style syntax:

- `@if(condition)` ➔ Use `@if condition`
- `@foreach(list as item)` ➔ Use `@for item in list`
- `@extends("layout")` ➔ Use `@extends "layout"`
- `@yield("section")` ➔ Use `@yield "section"`
- `@section("section")` ➔ Use `@section "section"`
- `@include("partial")` ➔ Use `@include "partial"`
