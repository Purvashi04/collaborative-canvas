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

## Live Demo
The project is deployed on **Render** and can be accessed here:  
🔗 [https://collaborative-canvas-ccfk.onrender.com](https://collaborative-canvas-ccfk.onrender.com)<br/>
Recorded video: https://drive.google.com/file/d/1Fl86DjNdNzttQNQqg7SenIIrCf0BX4TL/view?usp=drive_link

### How to Test
1. Open the above link in two browsers or devices.
2. Enter the same Room ID and click “Join/Create Room”.
3. Start drawing! You’ll see real-time updates synchronized between clients.

---

## Deployment Details
- **Platform:** Render
- **Backend:** Node.js + Express + Socket.io
- **Frontend:** Vanilla JS + HTML5 Canvas
- **WebSocket Protocol:** Real-time event-based sync for multi-user drawing

