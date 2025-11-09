# Collaborative Canvas — Architecture Overview

This document explains the architecture, data flow, synchronization strategy, and performance considerations for the **Collaborative Canvas** real-time whiteboard application.

---

## System Overview

**Collaborative Canvas** is a real-time, multi-user drawing board that synchronizes all users’ actions instantly using WebSockets.  
It supports brush, eraser, color/stroke adjustments, undo/redo, and multiple rooms.

### Tech Stack

| Layer | Technology Used | Purpose |
|-------|------------------|----------|
| Frontend | Vanilla JavaScript, HTML5 Canvas, CSS | Drawing logic, rendering UI |
| Backend | Node.js, Express, Socket.io | Real-time sync and user communication |
| Communication | WebSockets | Bi-directional event-based updates |
| Deployment | Render | Hosting the Node.js backend and static frontend |

---

## Data Flow Diagram
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Browser A │──draw──▶ │ WebSocket │ ──sync──▶│ Browser B │
│ (Canvas.js) │◀─update──│ Server.js │◀──event──│ (Canvas.js) │
└─────────────┘ └─────────────┘ └─────────────┘

**Explanation:**
1. Each client sends drawing data (points, color, tool) to the server via Socket.io.
2. The server broadcasts the updated canvas state to all connected clients in the same room.
3. Clients update their local canvases accordingly in real-time.

---

## WebSocket Protocol Design

**Events emitted by Client:**
| Event | Description | Payload |
|--------|--------------|----------|
| `joinRoom` | User joins a specific room | `{ roomId: string }` |
| `draw` | Sends stroke/path updates | `{ roomId: string, path: object }` |
| `undo` | Requests undo operation | `{ roomId: string }` |
| `redo` | Requests redo operation | `{ roomId: string }` |
| `ping` | For latency measurement | `{ timestamp: number }` |

**Events emitted by Server:**
| Event | Description | Payload |
|--------|--------------|----------|
| `stateUpdate` | Sends the updated canvas state to all users | `{ paths: array }` |
| `pong` | Responds to latency check | `{ timestamp: number }` |

---

## Performance Optimization

### Off-screen Canvas Rendering
- Implemented in `CanvasManager` to reduce flicker and avoid full canvas redraws on every stroke.
- The visible canvas simply copies from the off-screen buffer, improving frame rate and responsiveness.

### Event Batching
- Mouse and touch events are serialized efficiently before being transmitted.
- This prevents excessive network requests during high-frequency drawing actions.

### Client-Side Prediction
- The canvas renders locally in real time before syncing with the server.
- This ensures a smooth, low-latency user experience even during network delay.

### Latency Display (Bonus)
- FPS (Frames Per Second) and latency metrics are dynamically updated every second.
- Displayed inside the `metrics` element on the UI.

---

## Conflict Resolution

When multiple users draw in overlapping regions:
- The **server merges incoming paths** sequentially based on their arrival timestamp.
- Each stroke is treated as an independent layer to avoid overwriting other users’ drawings.
- Global **undo/redo** operations are applied consistently across all connected clients.

---

## Bonus Features Implemented

✅ Mobile touch support  
✅ Room-based user isolation  
✅ Latency and FPS tracking  
✅ Real-time multi-user synchronization  
✅ Deployed live on Render (public demo)

---

## Deployment

**Hosting Platform:** Render  
**Primary URL:** [https://collaborative-canvas-ccfk.onrender.com](https://collaborative-canvas-ccfk.onrender.com)

### Run Locally
```bash
npm install
npm run de
