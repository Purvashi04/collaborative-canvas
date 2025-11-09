# Architecture

## Data Flow Diagram
User draws on canvas → CanvasManager captures path → WebSocketManager sends to server → Server broadcasts to room → Clients update canvas.

## WebSocket Protocol
- 'draw': { roomId, path } - Send drawing path.
- 'stateUpdate': { paths } - Receive updated canvas state.
- 'undo'/'redo': roomId - Trigger global undo/redo.

## Undo/Redo Strategy
Server maintains history per room; undo pops last state and broadcasts.

## Performance Decisions
Off-screen canvas for layers, event batching, throttling for efficiency.

## Conflict Resolution
Last-write-wins for overlaps; operational history for undo.