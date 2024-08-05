const retrieveTts = require('./retrieveTts.js');
const playAudio = require('./playAudio.js');

const express = require('express');
const http = require('http');
const socketIo = require('socket.io'); // ws instead of socket.io ?
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3001", // The origin you want to allow
      methods: ["GET", "POST"],
      credentials: true
    }
  });

// Use CORS middleware
app.use(cors());
app.use(express.json());

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  var isPlaying = false; // should not play over existing audio
  var isPaused = false;

  socket.on('pause', () => {
    console.log('PAUSE received');
    isPaused = true;
  });

  socket.on('play', () => {
    console.log('PLAY  received');
    isPaused = false;
  });

  // Listen for a message from the client
  socket.on('sendMessage', async (data) => {
    console.log('Message from client:', data);
    
    if (!isPlaying) {
      isPlaying = true;
      isPaused = false;
      try{
        // process all tts sentences first
        const promises = data.map(text => retrieveTts(text));
        const responses = await Promise.all(promises);

        var i = 1;
        for (const response of responses) {
            if (isPaused) {
                break;
            }
            await playAudio(response);
            console.log('sending msg ' + i)
            socket.emit('message', i);      // sends toggle msg to frontend 
            i = i + 1;
            // conditional for canceling
        }
        isPlaying = false; // done playing
    }
    catch(error){
        console.log(error);
    };
  }

});

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





// establish correct connections with websocket

// have hints spoken sentence by sentence (done)

// toggle the borders of the expressions (done)

// not play over existing audio (in progress)

// lastly play / pause functionality 