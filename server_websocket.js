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
  var startingIndex = 0;

  socket.on('pause', () => {
    console.log('PAUSE received');
    isPaused = true;
  });

  socket.on('play', (hintIndex) => {
    console.log('PLAY  received at ' + hintIndex);
    startingIndex = hintIndex;
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
                isPlaying = false;
                responses = responses.slice(startingIndex)
                break;
            }
            else {
              await playAudio(response); // can I add a pause to playAudio?
              console.log('sending msg ' + i)
              socket.emit('message', i);      // sends toggle msg to frontend 
              i = i + 1;
            }
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


async function playFromIndex(index, responses) {
  try {
      for (let i = index; i < responses.length; i++) {
          if (isPaused) {
              isPlaying = false;
              startingIndex = i;
              return; // Exit the loop if paused
          } else {
              await playAudio(responses[i]); // Play the audio from the current index
              console.log(`sending msg ${i + 1}`);
              io.emit('message', `${i + 1} hint played`); // Send toggle msg to frontend
          }
      }
      isPlaying = false; // Reset the isPlaying flag when done
      isPaused = false; // Reset the isPaused flag
  } catch (error) {
      console.log(error);
      isPlaying = false; // Reset the isPlaying flag on error
      isPaused = false; // Reset the isPaused flag on error
  }
}



// establish correct connections with websocket

// have hints spoken sentence by sentence (done)

// toggle the borders of the expressions (done)
// still toggles one to much when pausing

// not play over existing audio (in progress)

// lastly play / pause functionality 