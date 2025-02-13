const express = require('express')
const {join} = require('node:path')

const app = express();

app.get("/", (req, res) => res.sendFile(join(__dirname, 'index.html')));

app.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});