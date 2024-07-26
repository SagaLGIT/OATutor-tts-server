const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express()
app.use(express.json())
app.use(
    cors(
        {
            origin: 'https://localhost:3000',
        }
    )
)

const inputVoice = "echo"; // https://platform.openai.com/docs/guides/text-to-speech/voice-options
const inputModel = "tts-1"; // https://platform.openai.com/docs/guides/text-to-speech/audio-quality

app.post("/synthesize", async (req, res) => {
    const text = req.body.text
    const apiKey = "dummy"
    const endpoint = "https://api.openai.com/v1/audio/speech"
    // Request body 
    const payload = {
        text: text,
        model: inputModel,
        accept: inputVoice,
        response_format: "mp3",
    }

    const response = await axios.post(endpoint, payload, {
        headers: headers,
        responseType: "stream",
      })
    res.json(response.data)
})

const_posrt = 3001
app.listen(const_posrt, () => {
    console.log(`Server is running on port ${const_posrt}`)
})

