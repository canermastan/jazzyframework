---
title: WebSockets
description: Real-time, bidirectional communication with Jazzy Framework.
---

WebSockets provide a persistent connection between a client (like a web browser) and the server, allowing both parties to send data at any time. This is perfect for real-time applications such as chat systems, live dashboards, or multiplayer games.

Jazzy Framework includes **high-performance, native WebSocket support**. Under the hood, Jazzy leverages the Mummy server's blazing-fast, C-level `epoll/kqueue` event loop. This means you can handle tens of thousands of simultaneous WebSocket connections effortlessly, without blocking any threads!

---

## Defining a WebSocket Route

To define a WebSocket route, use the `Route.ws()` method. Unlike standard HTTP routes that execute top-to-bottom and finish, WebSockets in Jazzy are **event-driven**. Your handler function will be called automatically whenever a specific event occurs on the connection.

Here is a simple example of an Echo server:

```nim title="src/routes.nim"
import jazzy

Route.ws("/echo", proc(ws: JazzyWebSocket, event: WsEvent, msg: WsMessage) =
  case event
  of OpenEvent:
    # Triggered when a client successfully connects
    echo "New connection established!"
    ws.send("Welcome to the Jazzy Echo Server!")
    
  of MessageEvent:
    # Triggered when the client sends a message
    if msg.kind == TextMessage:
      ws.send("You said: " & msg.data)
      
  of CloseEvent:
    # Triggered when the client disconnects
    echo "Connection closed."
    
  of ErrorEvent:
    # Triggered if a protocol error occurs
    echo "An error occurred."
)
```

---

## The Event Lifecycle

Jazzy manages the WebSocket lifecycle via the `WsEvent` enum. Your handler proc receives the current event type each time it is called.

### 1. `OpenEvent`
Fired exactly once when the initial HTTP upgrade handshake is successful and the WebSocket connection is established. This is the perfect place to initialize user sessions, log the connection, or send a welcome message.

### 2. `MessageEvent`
Fired every time the server receives a data frame from the client. The data is available in the `msg` parameter.

### 3. `CloseEvent`
Fired when the connection is cleanly closed by the client, or if the connection drops. You should use this event to clean up any resources (e.g., removing the user from an active chat room list).

### 4. `ErrorEvent`
Fired if there is an unexpected socket error or a protocol violation. The connection is typically closed immediately after this event.

---

## Handling Messages

When an event is `MessageEvent`, you can inspect the `msg.kind` property (which is a `WsMessageKind` enum) to determine what type of data was sent.

Jazzy supports four types of message frames:
- `TextMessage`: Standard UTF-8 string data.
- `BinaryMessage`: Raw byte data (useful for file uploads or custom binary protocols).
- `Ping`: A control frame checking if the connection is alive.
- `Pong`: The response to a Ping frame.

### Example: A Ping-Pong Server

It is a common practice to keep connections alive by occasionally sending a "ping". Here is how you can listen for a specific text command and respond:

```nim title="src/routes.nim"
import jazzy

Route.ws("/status", proc(ws: JazzyWebSocket, event: WsEvent, msg: WsMessage) =
  if event == MessageEvent and msg.kind == TextMessage:
    let text = msg.data
    
    if text == "ping":
      ws.send("pong")
    elif text == "status":
      ws.send("Server is running smoothly!")
    else:
      ws.send("Unknown command.")
)
```

:::note[Protocol Heartbeats]
The underlying server automatically responds to standard protocol-level `Ping` frames with a `Pong` frame, so you don't have to manually manage heartbeat protocols unless you want custom application-level logic!
:::

---

## Sending JSON Data

Sending complex data structures is incredibly easy using Nim's `%*` JSON constructor. Just convert the JSON node to a string before sending:

```nim title="src/routes.nim"
import jazzy, json

Route.ws("/feed", proc(ws: JazzyWebSocket, event: WsEvent, msg: WsMessage) =
  if event == OpenEvent:
    let response = %*{
      "type": "welcome",
      "user_id": 12345,
      "message": "Connected to the live feed."
    }
    
    # Convert JSON to string and send
    ws.send($response)
)
```

---

## Broadcasting to All Clients

In real-time applications, you often need to broadcast a message to all currently connected clients (such as a chat room or a live notification feed). 

Since Jazzy handles connections efficiently, you can manage active connections in a standard Nim `seq`. The following example demonstrates a simple broadcast system:

```nim title="src/routes.nim"
import jazzy, std/sequtils

# Keep track of active WebSocket connections
var activeClients: seq[JazzyWebSocket] = @[]

Route.ws("/chat", proc(ws: JazzyWebSocket, event: WsEvent, msg: WsMessage) =
  case event
  of OpenEvent:
    # Save the new connection
    activeClients.add(ws)
    
  of MessageEvent:
    # Broadcast any text message to all connected clients
    if msg.kind == TextMessage:
      let broadcastText = "User: " & msg.data
      for client in activeClients:
        client.send(broadcastText)
        
  of CloseEvent, ErrorEvent:
    # Remove the connection when it drops or errors out
    activeClients.keepIf(proc(item: JazzyWebSocket): bool = item != ws)
)
```

:::warning[State Management]
For multi-threaded environments or production deployments scaling across multiple server instances, you should use a centralized message broker (like Redis Pub/Sub) to synchronize messages across instances.
:::

---

## Why Event-Driven? (Advanced)

If you have used other async frameworks, you might be used to writing an infinite `while` loop that awaits incoming messages (e.g., `while true: await ws.receive()`). 

Jazzy intentionally avoids this pattern. Using a `while` loop would completely block one of the server's worker threads for the entire lifespan of the connection. By using an **event-driven callback**, Jazzy allows the underlying C-level network poller to efficiently monitor thousands of idle connections in the background, only ever waking up your Nim code for the exact microsecond a message actually arrives. This is how Jazzy achieves its incredible performance.
