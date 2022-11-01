const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

//config
server.listen(process.env.PORT || 8001, () => {
    console.log(`[ server.js ] Listening on port ${server.address().port}`);
});
const users = {};
let white = '';
let black = '';
let specs = [];
// socket events
io.on('connection', (client) => {
    console.log(`[ server.js ] ${(client.id)} connected`);

    client.on("username", username => {
      const user = {
        name: username,
        id: client.id
      };
      users[client.id] = user;
      handleUsersJoin(client.id);
      io.emit("boardInfo", { white, black, specs});      
      io.emit("connected", user);
      io.emit("users", Object.values(users));
    });

    client.on("disconnect", () => {
      handleUserDisconnect(client.id);
      io.emit("boardInfo", { white, black, specs});      
      delete users[client.id];
      io.emit("disconnected", client.id);
    })

});

const handleUserDisconnect = id => {
  if(white === id) white = '';
  else if(black === id) black = '';
  else specs = specs.filter(specID => specID !== id);      
}

const handleUsersJoin = (id) => {
  const hasWhitePlayer = white.length > 0;
  const hasBlackPlayer = black.length > 0;
  
  if(!hasWhitePlayer) white = id;
  else if (!hasBlackPlayer) black = id;
  else specs.push(id);
}
