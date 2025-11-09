export class DrawingState {
    private state: { [roomId: string]: any[] } = {};

    public save(roomId: string, paths: any[]) {
        // Save to localStorage or DB (e.g., fs.writeFileSync)
    }

    public load(roomId: string): any[] {
        // Load from storage
        return this.state[roomId] || [];
    }
}