import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { RoomManager } from './room.js';
const app = express();
const server = createServer(app);
const io = new Server(server);
const roomManager = new RoomManager();
app.use(express.static('client'));
io.on('connection', (socket) => {
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        roomManager.addUser(roomId, socket.id);
        socket.emit('stateUpdate', { paths: roomManager.getState(roomId) });
    });
    socket.on('draw', (data) => {
        roomManager.addPath(data.roomId, data.path);
        socket.to(data.roomId).emit('stateUpdate', { paths: roomManager.getState(data.roomId) });
    });
    socket.on('undo', (roomId) => {
        roomManager.undo(roomId);
        io.to(roomId).emit('stateUpdate', { paths: roomManager.getState(roomId) });
    });
    socket.on('redo', (roomId) => {
        roomManager.redo(roomId);
        io.to(roomId).emit('stateUpdate', { paths: roomManager.getState(roomId) });
    });
    socket.on('ping', (timestamp) => socket.emit('pong', timestamp));
});
app.use(express.static('dist/client'));
server.listen(3000, () => console.log('Server on port 3000'));
