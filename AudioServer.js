const retrieveTts = require('./retrieveTts.js');
const { playAudio, stopAudio } = require('./playAudio.js');

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

class AudioServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server, {
      cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
        credentials: true
      }
    });
    this.isPlaying = false; // true of agent is speaking - to not call audio function multiple times
    this.isPaused = false;  // only true if pause button has been pressed ()
    this.startingIndex = 0;
    this.responses = [];

    this.setupMiddleware();
    this.setupSocketHandlers();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('pause', () => {
        console.log('PAUSE received');
        this.isPaused = true;
      });

      socket.on('play', (hintIndex) => {
        console.log('PLAY received at ' + hintIndex);
        this.startingIndex = hintIndex;
        this.isPaused = false;
        if (!this.isPlaying && this.responses.length > 0) { // resume playing
          this.playFromIndex(this.startingIndex);
        }
      });

      socket.on('reload', () => { // not working fully
        console.log('RELOAD received');
        // this.isPaused = false;
        // this.startingIndex = 0;
        // if (!this.isPlaying){
        // this.playFromIndex(this.startingIndex);
        // };
      });

      socket.on('stop', () => {
        console.log('STOP received');
        this.isPaused = true;
        stopAudio();
      });

      socket.on('sendMessage', async (data) => {
        console.log('Message from client:', data);
        
        if (!this.isPlaying) {
          this.isPlaying = true;
          this.isPaused = false;
          try {
            // process all tts sentences first
            const promises = data.map(text => retrieveTts(text));
            this.responses = await Promise.all(promises);

            // play audio from the starting
            this.startingIndex = 0;
            await this.playFromIndex(this.startingIndex);
            this.isPlaying = false; // done playing
          } catch (error) {
            console.log(error);
            this.isPlaying = false; // Reset the isPlaying flag on error
          }
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  }

  async playFromIndex(index) {
    try {
      for (let i = index; i < this.responses.length; i++) {
        if (this.isPaused) {
          this.isPlaying = false;
          this.startingIndex = i;
          return; // Exit the loop if paused
        } else {
          await playAudio(this.responses[i]); // Play the audio from the current index
          console.log(`sending msg ${i+1}`);
          this.io.emit('message', i+1); // Send toggle msg to frontend
        }
      }
      this.io.emit('finish');
      this.isPlaying = false; // reset when done
      this.isPaused = false; 
    } catch (error) {
      console.log(error);
      this.isPlaying = false; 
      this.isPaused = false; 
    }
  }

  start(port) {
    this.server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
const audioServer = new AudioServer();
audioServer.start(PORT);