export class RoomManager {
    constructor() {
        this.rooms = {};
    }
    addUser(roomId, userId) {
        if (!this.rooms[roomId]) {
            this.rooms[roomId] = { paths: [], history: [] };
        }
    }
    addPath(roomId, path) {
        if (!this.rooms[roomId]) {
            // Create room automatically if it doesn’t exist
            this.rooms[roomId] = { paths: [], history: [] };
        }
        this.rooms[roomId].paths.push(path);
        this.rooms[roomId].history.push([...this.rooms[roomId].paths]);
    }
    getState(roomId) { var _a; return ((_a = this.rooms[roomId]) === null || _a === void 0 ? void 0 : _a.paths) || []; }
    undo(roomId) {
        if (this.rooms[roomId].history.length > 1) {
            this.rooms[roomId].history.pop();
            this.rooms[roomId].paths = this.rooms[roomId].history[this.rooms[roomId].history.length - 1];
        }
    }
    redo(roomId) { }
}
