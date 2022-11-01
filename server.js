const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

let board = [
  [{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false }],
  [{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false }],
  [{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false }],
  [{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false }],
  [{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false }],
  [{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false }],
  [{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false }],
  [{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false },{piece: null, highlight: false }],
];

let whitePieces = [
  { type: 'pawn', id: '06', x: 0, y: 6, side: 'white'},
  { type: 'pawn', id: '16', x: 1, y: 6, side: 'white'},
  { type: 'pawn', id: '26', x: 2, y: 6, side: 'white'},
  { type: 'pawn', id: '36', x: 3, y: 6, side: 'white'},
  { type: 'pawn', id: '46', x: 4, y: 6, side: 'white'},
  { type: 'pawn', id: '56', x: 5, y: 6, side: 'white'},
  { type: 'pawn', id: '66', x: 6, y: 6, side: 'white'},    
  { type: 'pawn', id: '76', x: 7, y: 6, side: 'white'},
  { type: 'rook', id: '07', x: 0, y: 7, side: 'white'},
  { type: 'knight', id: '17', x: 1, y: 7, side: 'white'},
  { type: 'bishop', id: '27', x: 2, y: 7, side: 'white'},
  { type: 'queen', id: '37', x: 3, y: 7, side: 'white'},
  { type: 'king', id: '47', x: 4, y: 7, side: 'white'},
  { type: 'bishop', id: '57', x: 5, y: 7, side: 'white'},
  { type: 'knight', id: '67', x: 6, y: 7, side: 'white'},
  { type: 'rook', id: '77', x: 7, y: 7, side: 'white'},
];

let blackPieces = [
  { type: 'pawn', id: '01', x: 0, y: 1, side: 'black'},
  { type: 'pawn', id: '11', x: 1, y: 1, side: 'black'},
  { type: 'pawn', id: '21', x: 2, y: 1, side: 'black'},
  { type: 'pawn', id: '31', x: 3, y: 1, side: 'black'},
  { type: 'pawn', id: '41', x: 4, y: 1, side: 'black'},
  { type: 'pawn', id: '51', x: 5, y: 1, side: 'black'},
  { type: 'pawn', id: '61', x: 6, y: 1, side: 'black'},    
  { type: 'pawn', id: '71', x: 7, y: 1, side: 'black'},
  { type: 'rook', id: '00', x: 0, y: 0, side: 'black'},
  { type: 'knight', id: '10', x: 1, y: 0, side: 'black'},
  { type: 'bishop', id: '20', x: 2, y: 0, side: 'black'},
  { type: 'queen', id: '30', x: 3, y: 0, side: 'black'},
  { type: 'king', id: '40', x: 4, y: 0, side: 'black'},
  { type: 'bishop', id: '50', x: 5, y: 0, side: 'black'},
  { type: 'knight', id: '60', x: 6, y: 0, side: 'black'},
  { type: 'rook', id: '70', x: 7, y: 0, side: 'black'},
];

whitePieces.forEach(piece => board[piece.y][piece.x].piece = piece);
blackPieces.forEach(piece => board[piece.y][piece.x].piece = piece);

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
      io.emit("gameInfo", { white, black, specs});
      io.emit("boardInfo", { board, whitePieces, blackPieces });                  
    });

    client.on("move", ({ id, x, y}) => {
      if(client.id === white){
        const index = whitePieces.findIndex(piece => piece.id === id);
        whitePieces[index].x = x;
        whitePieces[index].y = y;
        board[y][x].piece = null;
        io.emit("boardInfo", { board, whitePieces, blackPieces });                  
      } 
      else if(client.id === black) {
        const index = blackPieces.findIndex(piece => piece.id === id);
        blackPieces[index].x = x;
        blackPieces[index].y = y;
        board[y][x].piece = null;
        io.emit("boardInfo", { board, whitePieces, blackPieces });                  
      }
    });

    client.on("disconnect", () => {
      handleUserDisconnect(client.id);
      delete users[client.id];

      io.emit("gameInfo", { white, black, specs});      
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
