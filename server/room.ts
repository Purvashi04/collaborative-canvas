// Room management: Handles multiple isolated canvases.
import { v4 as uuidv4 } from 'uuid';

export class RoomManager {
    private rooms: { [key: string]: { paths: any[], history: any[][] } } = {};

    public addUser(roomId: string, userId: string) {
        if (!this.rooms[roomId]) {
            this.rooms[roomId] = { paths: [], history: [] };
        }
    }

    public addPath(roomId: string, path: any) {
        this.rooms[roomId].paths.push(path);
        this.rooms[roomId].history.push([...this.rooms[roomId].paths]);
    }

    public getState(roomId: string) { return this.rooms[roomId]?.paths || []; }

    public undo(roomId: string) {
        if (this.rooms[roomId].history.length > 1) {
            this.rooms[roomId].history.pop();
            this.rooms[roomId].paths = this.rooms[roomId].history[this.rooms[roomId].history.length - 1];
        }
    }

    public redo(roomId: string) {}
}