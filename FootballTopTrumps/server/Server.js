var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


games = {}
users = {}
decks = {}

const PORT = 3000

const MAX_PLAYERS = 3

// Shuffles an array using the Fisher-Yates shuffle algorithm.
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

io.on('connection', (socket) => {

    console.log("A client connected")

    socket.emit("alright")
    
    socket.on('createGame', (uniqueID) => {
        // Set the property uuid to 1.
        // As there is 1 player (the host in the room).

        socket.join(socket.id)
        games[socket.id] = 1
        users[uniqueID] = socket.id

        socket.emit('gameCreated', socket.id) 
        socket.emit('playersChanged', games[socket.id])
    })

    socket.on("gameStarted", (info) => {
        
        let deck = info.deck
        let gameID = info.gameID

        // Now we need to add the deck to the decks object.
        let cards = shuffle(deck.players)
        decks[info.gameID] = {deckSize: cards.length, cards: cards}

        io.sockets.in(gameID).emit("startGame")
    })

    socket.on("requestCards", (info) => {
        console.log(decks[info.gameID])
        let numberToRemove = Math.floor(decks[info.gameID].deckSize / games[info.gameID])
        let playerCards = decks[info.gameID].cards.splice(0, numberToRemove)
        socket.emit("sendCards", playerCards)
    })

    socket.on('checkJoin', (serverID) => {

        console.log(games)
        console.log(serverID)
        console.log(games[serverID])


        if (games[serverID] == undefined || games[serverID] === 0) {
            socket.emit('noServer')
        } else if (games[serverID] === MAX_PLAYERS) {
            socket.emit('serverFull')
        } else {
            socket.emit("okToJoin")
        }

    })

    socket.on('joinGame', (info) => {
        console.log(info)

        socket.join(info.gameID)
        games[info.gameID] = games[info.gameID] + 1
        users[info.userID] = info.gameID

        console.log("Before socket:", info.gameID)
        io.sockets.in(info.gameID).emit('playersChanged', games[info.gameID])
    })

    socket.on('hostDisconnected', (info) => {
        delete games[info.gameID]
        delete users[info.userID]
        io.sockets.in(info.gameID).emit('forceDisconnect')
    })

    socket.on('clientDisconnecting', (info) => {
        delete users[info.userID]
        if (games[info.gameID] !== undefined)
            games[info.gameID] -= 1
        io.sockets.in(info.gameID).emit('playersChanged', games[info.gameID])
    })

    socket.on('disconnect', () => {
        console.log("A client disconnected")
    })
})

http.listen(PORT, () => {
    console.log('listening on localhost:3000')
})