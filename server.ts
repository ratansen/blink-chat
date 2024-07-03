import express from 'express';
import http from 'http';
import {Server} from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const USER_LIMIT = 2;
const userCounts: { [key: string]: number } = {};

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

app.get("/chat/:id", (req, res) =>{
    res.sendFile(__dirname + '/pages/chat.html');
});

io.on('connection', (socket) => {
    socket.on('join-chat', (room) => {
        console.log('a user joined');

        socket.join(room);

        socket.broadcast.to(room).emit('joined');

        userCounts[room] += 1;

        socket.on('send-message', (message) => {
            console.log("server received message");
            socket.broadcast.to(room).emit('receive-message', message);
        });

    });
    
    
});



const PORT = 3000;
server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

