---
title: Client IP
description: Securely extracting real client IP addresses.
---

# Client IP

Jazzy provides a robust and secure way to identify the real client IP address, even behind proxies, load balancers, or CDNs like Cloudflare.

## Basic Usage

You can access the client's IP address anywhere within your request handlers using the `ctx.ip()` method.

```nim
import jazzy

Route.get("/my-ip", proc(ctx: Context) {.async.} =
  let clientIp = ctx.ip()
  ctx.text("Your real IP address is: " & clientIp)
)
```

## Configuration

By default, Jazzy does not trust proxy headers (like `X-Forwarded-For`) to prevent IP spoofing. To enable trust for proxies (common in production environments like Nginx, Heroku, or Cloudflare), set the `TRUST_PROXY` setting in your `.env`.

```env
# .env
TRUST_PROXY=true
```

## Features

Jazzy's IP extraction engine is modern and follows industry best practices:

- **Cloudflare Native:** High-priority support for `CF-Connecting-IP`.
- **RFC 7239 Support:** Full support for the modern `Forwarded` header standard.
- **Smart Proxy Chaining:** Automatically parses `X-Forwarded-For` and skips internal/private IP ranges to find the first valid public client IP.
- **IPv6 Ready:** Handles IPv6 addresses including bracketed notation.

> **Security Note:** If `TRUST_PROXY` is set to `false` (default), Jazzy will always return the direct socket IP address. Always ensure your server is behind a trusted proxy before enabling this setting in production.
