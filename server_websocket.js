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

  // Listen for a message from the client
  socket.on('sendMessage', (data) => {
    console.log('Message from client:', data);

    // Send a message back to the client
    socket.send('Hello from server!');
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

// have hints spoken sentence by sentence

// toggle the borders of the expressions

// lastly play / pause functionality