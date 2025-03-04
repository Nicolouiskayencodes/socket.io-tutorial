const express = require('express');
const { createServer } = require('node:http');

const app = express();
const server = createServer(app);


const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});