// /*Purpose: This file contains the server-side code for the text-to-speech application. 
// It listens for incoming HTTP POST requests at the /synthesize URL path, sends a request to the OpenAI API to synthesize speech from text, 
// and plays the synthesized audio using the speaker module. 
// The server is configured to run on port 3001 and allows requests from the client-side application running on https://localhost:3000. */

// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');

// const Speaker = require('speaker');
// const ffmpeg = require('fluent-ffmpeg');
// const ffmpegPath = require("ffmpeg-static");
// ffmpeg.setFfmpegPath(ffmpegPath);


// const app = express()
// app.use(express.json()) // automatically parses incoming requests with JSON payloads
// app.use(
//     cors(
//         {
//             origin: 'https://localhost:3000', //only requests coming from https://localhost:3000 will be allowed. 
//         }
//     )
// )

// const inputVoice = "echo"; // https://platform.openai.com/docs/guides/text-to-speech/voice-options
// const inputModel = "tts-1"; // https://platform.openai.com/docs/guides/text-to-speech/audio-quality

// app.post("/synthesize", async (req, res) => {  // listens for HTTP POST requests at the /synthesize URL path
    
//     // Prepare the payload for the OpenAI API
//     const text = req.body.text
//     const apiKey = "dummy" //process.env.REACT_APP_OPENAI_API_KEY
//     const endpoint = "https://api.openai.com/v1/audio/speech"
    
//     const payload = {
//         text: text,
//         model: inputModel,
//         accept: inputVoice,
//         response_format: "mp3",
//     }

//     const headers = {
//         Authorization: `Bearer ${apiKey}`, // API key for authentication
//       };

//     try {
//         // Make a POST request to the OpenAI API
//         const response = await axios.post(endpoint, payload, {
//             headers: headers,
//             responseType: "stream",
//         })

//         // Configure speaker settings
//         const speaker = new Speaker({
//             channels: 2, 
//             bitDepth: 16,
//             sampleRate: 44100,
//         });

//         // Convert the response to the desired audio format and play it
//         ffmpeg(response.data)
//         .toFormat("s16le")
//         .audioChannels(2)
//         .audioFrequency(44100)
//         .pipe(speaker);

//         // Send back confirmation
//         res.json("Recieved"); // response.data->"Revieced" Represents the response object that will be sent back to the client. You use this to send data or status codes back in the response.
//     }
//     catch (error) {
//         console.log(error);
//     }
// })

// const_posrt = 3001
// app.listen(const_posrt, () => {
//     console.log(`Server is running on port ${const_posrt}`)
// })