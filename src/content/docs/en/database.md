---
title: Database
description: Powerful Query Builder and ORM-like features.
---

Jazzy includes a powerful, fluent Query Builder that allows you to interact with your database without writing raw SQL. It allows you to switch underlying databases with minimal code changes (currently optimized for SQLite).

## Connecting
In your `app.nim` or `database.nim` module:

```nim
import jazzy

connectDB("app.db")
```

## Retrieving Data

### Fetching All Rows
```nim
let users = DB.table("users").get()
# Returns a JsonNode (JArray) of objects
```

### Fetching a Single Row
```nim
let user = DB.table("users").where("id", 1).first()
# Returns a JsonNode (JObject) or JNull if not found
```

### Where Clauses
Fluid chaining makes complex queries easy.

```nim
DB.table("posts").where("published", 1)
```

**Comparison Operators:**
```nim
DB.table("users").where("age", ">=", 18)
DB.table("products").where("price", "<", 100)
DB.table("status", "!=", "deleted")
```

**Chaining (AND logic):**
Multiple calls are treated as `AND` conditions.
```nim
DB.table("users")
  .where("active", 1)
  .where("role", "admin")
  .get()
# SELECT * FROM users WHERE active = 1 AND role = 'admin'
```

### Counting Records
```nim
let totalUsers = DB.table("users").count()
let activeUsers = DB.table("users").where("active", 1).count()
```

### Pagination (Limit)
Limit the number of results returned.

```nim
# Get the top 10 recent posts
let posts = DB.table("posts").limit(10).get()
```

## Modifying Data

### Inserts
To insert data, pass a `JsonNode` (`%*`). Returns the **ID** of the newly inserted row.

```nim
let newUserId = DB.table("users").insert(%*{
  "username": "caner",
  "email": "jcanermastan@gmail.com",
  "created_at": "2025-10-27"
})
```

### Updates
Updates affect all rows matching the `where` clause.

```nim
# Deactivate user #5
DB.table("users")
  .where("id", 5)
  .update(%*{"active": 0})

# Mark all users as verified
DB.table("users").update(%*{"verified": 1}) 
```

### Deletes
Deletes all rows matching the `where` clause.

```nim
DB.table("users").where("id", 5).delete()
```

> **Warning:** Calling `delete()` without a `where` clause will wipe the table!

## Raw SQL

For complex queries (JOINs, subqueries) that the Query Builder doesn't yet support, you can use the `raw()` and `rawExec()` methods.

### Fetching Data (`raw`)

The raw() method is used for data-returning queries (like `SELECT` or `PRAGMA`). It returns a JSON array of rows, where each row is an object that can be accessed by column names.

```nim
let res = DB.raw("SELECT name, age FROM users WHERE id = ?", 1)

if res.len > 0:
  let user = res[0]

  let name = user["name"].getStr() # or res[0]["name"].getStr()
  let age = user["age"].getInt() # or res[0]["age"].getInt()
```

**Iterating through results:**

```nim
let users = DB.raw("SELECT * FROM users")

for user in users:
  Log.info(user["name"].getStr())
```

### Executing Statements (`rawExec`)

The `rawExec()` method is used for statements that modify data (`INSERT`, `UPDATE`, `DELETE`). It returns the number of affected rows.

```nim
let affected = DB.rawExec("INSERT INTO users (name, age) VALUES (?, ?)", "Charlie", 35)

echo "Rows affected: ", affected
```

