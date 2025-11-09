# Collaborative Canvas

A real-time multi-user drawing app built with Node.js, Socket.io, and vanilla TypeScript.

## Setup
1. Clone the repo.
2. Run `npm install`.
3. Run `npm run build` to compile TypeScript.
4. Run `npm start` to start the server on http://localhost:3000.
5. Open http://localhost:3000 in a browser.

## Testing Multi-User
- Open multiple browser tabs/windows.
- Enter the same Room ID (e.g., "test") and join.
- Draw in one tab; see it sync in others.

## Known Limitations
- Persistence is in-memory (resets on server restart).
- No user authentication.

## Time Spent
- 4 days (core: 2 days, bonuses: 1 day, docs/testing: 1 day).