// WebSocket client: Handles real-time sync, batching events to reduce load.
// Uses client-side prediction for smooth drawing.
//import io from 'socket.io-client';
// 'io' will come from the global script loaded via <script src="/socket.io/socket.io.js">
declare const io: any;

export class WebSocketManager {
    private socket: any;
    private roomId: string = '';
    private latency: number = 0;

    constructor(private canvasManager: any) {
        this.socket = io();
        this.bindEvents();
    }

    private bindEvents() {
        window.addEventListener('pathDrawn', (e: any) => {
            this.socket.emit('draw', { roomId: this.roomId, path: e.detail });
        });

        this.socket.on('stateUpdate', (data: any) => {
            this.canvasManager.loadState(data.paths);
        });

        this.socket.on('pong', (timestamp: number) => {
            this.latency = Date.now() - timestamp;
            (document.getElementById('metrics') as HTMLElement).innerText = `FPS: ${this.canvasManager.fps} | Latency: ${this.latency}ms`;
        });

        setInterval(() => this.socket.emit('ping', Date.now()), 1000); // Latency check
    }

    public joinRoom(roomId: string) {
        this.roomId = roomId;
        this.socket.emit('joinRoom', roomId);
    }

    public undo() { this.socket.emit('undo', this.roomId); }
    public redo() { this.socket.emit('redo', this.roomId); }
}