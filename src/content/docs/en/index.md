---
title: Introduction
description: Welcome to the Jazzy Framework documentation.
---

Welcome to **Jazzy**, the productive web framework for Nim. It pairs Nim's
native speed with a Laravel-inspired developer experience: configure once,
write ordinary Nim, and keep the framework work out of your way.

<div class="database-hero">
  <p class="database-kicker">NEW DATABASE WORKFLOW</p>
  <h2>From a blank project to typed CRUD in one path.</h2>
  <p>Choose SQLite or PostgreSQL in <code>.env</code>, create a versioned migration, declare a model, and use the same awaited API in your routes.</p>
  <p><a class="database-action" href="/jazzyframework/en/database-quickstart/">Start the database quickstart -&gt;</a></p>
</div>

## What is Jazzy?

Jazzy is designed to help you write less code while building more features. It combines the performance of Nim with a developer-friendly API inspired by modern frameworks like Laravel and Rails.

## Key Features

- **SQLite + PostgreSQL:** One await-first query builder, transactional
  migrations, and an optional typed ORM.
- **Developer tooling:** Project, migration, and seeder scaffolding from the
  Jazzy CLI.
- **Dev UI Console:** Interactive dashboard and SQLite SQL explorer.
- **Modern IP Engine:** Securely identify users behind proxies and Cloudflare.
- **Security Primitives:** JWT, Basic Auth, password hashing, CSRF, and middleware.
- **Built-in Middleware:** Rate limiting, body limits, and static files.
- **Structured Logging:** Automated request tracking with unique IDs.
- **Performance:** Asynchronous I/O with native Nim speed.

## Getting Started

New to Jazzy? Start with [Installation](/jazzyframework/en/installation/). Ready
to build something real? Follow the [Database Quickstart](/jazzyframework/en/database-quickstart/): it goes from `.env` to migrations, models, CRUD, seeds,
and a safe production deploy without assuming prior Jazzy knowledge.

> **Existing app?** Your old SQLite project and `connectDB()` calls still work.
> Use `jazzy upgrade db-async` to preview the safe `await` migration when you
> want to move to the new database API.
