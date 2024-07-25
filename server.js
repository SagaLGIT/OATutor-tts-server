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

app.post("/synthesize", async (req, res) => {
    const text = req.body.text
    const apiKey = "dummy"
    const endpoint = ''
})
