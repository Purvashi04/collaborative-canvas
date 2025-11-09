//App initialization: Binds UI to canvas and websocket.
import { CanvasManager } from './canvas.js';
import { WebSocketManager } from './websocket.js';
const canvasManager = new CanvasManager('canvas');
const wsManager = new WebSocketManager(canvasManager);
document.getElementById('brush').addEventListener('click', () => canvasManager.setTool('brush'));
document.getElementById('eraser').addEventListener('click', () => canvasManager.setTool('eraser'));
document.getElementById('rectangle').addEventListener('click', () => canvasManager.setTool('rectangle'));
document.getElementById('circle').addEventListener('click', () => canvasManager.setTool('circle'));
document.getElementById('text').addEventListener('click', () => canvasManager.setTool('text'));
document.getElementById('color').addEventListener('input', (e) => canvasManager.setColor(e.target.value));
document.getElementById('strokeWidth').addEventListener('input', (e) => canvasManager.setStrokeWidth(+e.target.value));
document.getElementById('undo').addEventListener('click', () => wsManager.undo());
document.getElementById('redo').addEventListener('click', () => wsManager.redo());
document.getElementById('joinRoom').addEventListener('click', () => {
    const roomId = document.getElementById('roomId').value || 'default';
    wsManager.joinRoom(roomId);
});
