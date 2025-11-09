export class DrawingState {
    constructor() {
        this.state = {};
    }
    save(roomId, paths) {
        // Save to localStorage or DB (e.g., fs.writeFileSync)
    }
    load(roomId) {
        // Load from storage
        return this.state[roomId] || [];
    }
}
