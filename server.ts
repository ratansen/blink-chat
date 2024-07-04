import express from 'express';
import http from 'http';
import {Server} from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const USER_LIMIT = 2;
const userCounts: { [key: string]: number } = {};

// const limitCheck = (req: { params: { id: string; }; }, res: { redirect: (arg0: string) => void; }, next: () => void) => {
//     console.log(req.params.id);
//     if(userCounts[req.params.id] >= 2){
//         res.redirect('/');
//     }
//     else{
//         next();
//     }
// };

app.get("/", (req, res) => {
    // res.sendFile(__dirname + '/pages/index.html');
    res.redirect("/chat/default-chat")
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

const PORT = process.env.PORT || 3000;
server.listen(PORT);

