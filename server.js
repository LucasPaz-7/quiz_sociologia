const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));

const rooms = {};

io.on('connection', (socket) => {
    console.log('Novo jogador conectado');

    socket.on('createRoom', (data) => {
        const roomCode = Math.random().toString(36).substring(7);
        rooms[roomCode] = { creator: socket.id, players: [data.username], quiz: data.quiz };
        socket.join(roomCode);
        socket.emit('roomCreated', roomCode);
    });

    socket.on('joinRoom', (data) => {
        const room = rooms[data.roomCode];
        if (room) {
            room.players.push(data.username);
            socket.join(data.roomCode);
            io.to(data.roomCode).emit('playerJoined', room.players);
        }
    });

    socket.on('startGame', (roomCode) => {
        if (rooms[roomCode] && socket.id === rooms[roomCode].creator) {
            io.to(roomCode).emit('gameStarted', rooms[roomCode].quiz);
        }
    });
});

server.listen(3000, () => console.log('Servidor rodando na porta 3000'));