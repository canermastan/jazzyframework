---
title: Directory Structure
description: Overview of the Jazzy project structure.
---

# Directory Structure

Jazzy doesn't force a strict directory structure on you. However, as your application grows, organizing your code becomes crucial. 

We recommend the following structure for a standard MVC application. This helps keep your project clean and maintainable.

## Recommended Layout

```text
my-project/
├── src/
│   ├── controllers/      # Route handlers (logic layer)
│   │   ├── auth_controller.nim
│   │   └── user_controller.nim
│   │
│   ├── models/           # Data models (types & implementations)
│   │   └── user.nim
│   │
│   ├── migrations/       # Versioned database changes
│   │   └── m20260917143000_create_users.nim
│   │
│   ├── seeders/          # Optional explicit development/reference data
│   │   └── s20260917150000_demo_users.nim
│   │
│   ├── services/         # Business logic (optional)
│   │   └── auth_service.nim
│   │
│   ├── router.nim        # Route definitions
│   └── app.nim           # Application entry point
│
├── .jazzy/               # Ignored, self-generated CLI runner (do not edit)
│
├── .env                  # Environment variables
├── my_app.nimble         # Package configuration
└── README.md
```

## The breakdown

- **`app.nim`**: The bootstrap file. This is where you initialize the database, load config, register routes, and start the `Jazzy.serve()` loop.
- **`router.nim`**: Contains all your `Route.get()`, `Route.post()` definitions. Keeping routes separate makes your app easier to navigate.
- **`controllers/`**: Where the request handling logic lives. Controllers should take a `Context`, Validate input, Call a model/service, and Return a response.
- **`models/`**: Defines your data structures and database interactions (e.g., specific queries for Users or Posts).
- **`migrations/`**: Contains reviewed forward/backward schema changes. Create files with `jazzy make:migration <name>`.
- **`seeders/`**: Optional explicit demo/reference data. Create files with `jazzy make:seeder <name>` and run them with `jazzy db:seed`.
- **`.jazzy/`**: An ignored self-healing runner generated whenever a migration or seeder command runs. Do not add it to source control; deleting it is safe.
- **`services/`**: (Optional) For complex business logic that doesn't fit neatly into a controller or model.

## Flexibility
You are free to rename folders or group files by feature (e.g., `modules/auth/`, `modules/users/`). Jazzy works the way you work.
