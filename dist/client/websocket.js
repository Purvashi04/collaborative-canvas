export class WebSocketManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.roomId = '';
        this.latency = 0;
        this.socket = io();
        this.bindEvents();
    }
    bindEvents() {
        window.addEventListener('pathDrawn', (e) => {
            this.socket.emit('draw', { roomId: this.roomId, path: e.detail });
        });
        this.socket.on('stateUpdate', (data) => {
            this.canvasManager.loadState(data.paths);
        });
        this.socket.on('pong', (timestamp) => {
            this.latency = Date.now() - timestamp;
            document.getElementById('metrics').innerText = `FPS: ${this.canvasManager.fps} | Latency: ${this.latency}ms`;
        });
        setInterval(() => this.socket.emit('ping', Date.now()), 1000); // Latency check
    }
    joinRoom(roomId) {
        this.roomId = roomId;
        this.socket.emit('joinRoom', roomId);
    }
    undo() { this.socket.emit('undo', this.roomId); }
    redo() { this.socket.emit('redo', this.roomId); }
}
