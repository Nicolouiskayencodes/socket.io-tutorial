const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function main() {
const db = await open({
  filename: 'chat.db',
  driver: sqlite3.Database
});

// create our 'messages' table (you can ignore the 'client_offset' column for now)
await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
  );
`);
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  },
  connectionStateRecovery: {},
});

io.on('connection', async (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
io.on('connection', async (socket) => {
  socket.on('chat message', async (msg, clientOffset, callback) => {
    console.log(msg, clientOffset)
    let result;
      try {
        // store the message in the database
        result = await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset);
      } catch (e) {
        // TODO handle the failure
        if (e.errno === 19 /* SQLITE_CONSTRAINT */ ) {
          // the message was already inserted, so we notify the client
          callback();
        } else {
          // nothing to do, just let the client retry
        }
        return;
      }
      // include the offset with the message
      io.emit('chat message', msg, result.lastID);
      callback();
  });
  if (!socket.recovered) {
    // if the connection state recovery was not successful
    console.log(socket.handshake.auth.serverOffset)
    try {
      await db.each('SELECT id, content FROM messages WHERE id > ?',
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit('chat message', row.content, row.id);
        }
      )
    } catch (e) {
      // something went wrong
    }
  }
});

const PORT = 3000;
io.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
}

main();