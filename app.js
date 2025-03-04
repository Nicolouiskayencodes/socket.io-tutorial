const express = require('express');
const { createServer } = require('node:http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors({origin: '*'}))
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
});

const PORT = 3000;
io.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});