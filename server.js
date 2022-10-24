const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.Server(app);

//config
server.listen(process.env.PORT || 8001, () => {
    console.log(`[ server.js ] Listening on port ${server.address().port}`);
});

//routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/show.html'));
})

app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/edit.html'));
})