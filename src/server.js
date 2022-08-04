const express = require('express');
const path = require('path');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


const port = process.env.PORT || 3000;

const connections = [];

app.use(express.static(path.join(__dirname, '/public')));
console.log(path.join(__dirname, '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

io.on('connection', (socket) => {
    connections.push(socket);

    socket.on('chat message', (data) => {
        const msgDate = new Date(data.date);
        const time = `${msgDate.getHours()} : ${msgDate.getMinutes()}`;
        socket.broadcast.emit('chat message', {username: data.username, sentTime: time, message: data.message});

    });

    socket.on('disconnect', (data) => {
        connections.splice(connections.indexOf(socket), 1);
    })
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
