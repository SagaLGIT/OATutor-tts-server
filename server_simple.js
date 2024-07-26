/* Just establishing connection between the frontend and the backend */
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const Speaker = require('speaker');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express()
app.use(express.json()) // automatically parses incoming requests with JSON payloads
app.use(
    cors(
        {
            origin: 'http://localhost:3001', //only requests coming from https://localhost:3001 will be allowed. 
        }
    )
)

const inputVoice = "echo"; // https://platform.openai.com/docs/guides/text-to-speech/voice-options
const inputModel = "tts-1"; // https://platform.openai.com/docs/guides/text-to-speech/audio-quality

app.post("/synthesize", async (req, res) => {  // listens for HTTP POST requests at the /synthesize URL path
    console.log(req.body.text)

    const text = req.body.text
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY
    const endpoint = "https://api.openai.com/v1/audio/speech"
    
    const payload = {
        model: inputModel,
        input: text,
        voice: inputVoice,
        response_format: "mp3",
    }

    const headers = {
        Authorization: `Bearer ${apiKey}`, // API key for authentication
      };

    try {
        // Make a POST request to the OpenAI API
        const response = await axios.post(endpoint, payload, {
            headers: headers,
            responseType: "stream",
        })

        // Configure speaker settings
        const speaker = new Speaker({
            channels: 2, 
            bitDepth: 16,
            sampleRate: 44100,
        });

        // Convert the response to the desired audio format and play it
        ffmpeg(response.data)
        .toFormat("s16le")
        .audioChannels(2)
        .audioFrequency(44100)
        .pipe(speaker);

        // Send back confirmation
        res.json("Recieved");
    }
    catch (error) {
        console.log(error);
    }
})

const_posrt = 3002
app.listen(const_posrt, () => {
    console.log(`Server is running on port ${const_posrt}`)
})