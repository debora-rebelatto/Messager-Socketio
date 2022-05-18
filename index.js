const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.renderFile('index.html');
});

let messages = [];

io.on('connection', (socket) => {
  console.log("Socket connected: " + socket.id);

  socket.emit('previousMessages', messages);

  socket.on('sendMessage', (msg) => {
    messages.push(msg);
    socket.broadcast.emit('receivedMessage', msg);

  });
});

server.listen(4000, () => {
  console.log('listening on *:4000');
});