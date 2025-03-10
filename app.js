const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

const PORT = 3000;
io.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});