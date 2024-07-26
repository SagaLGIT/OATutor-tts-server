/* Just establishing connection between the frontend and the backend */
const express = require('express');
const axios = require('axios');
const cors = require('cors');


const app = express()
app.use(express.json()) // automatically parses incoming requests with JSON payloads
app.use(
    cors(
        {
            origin: 'http://localhost:3001', //only requests coming from https://localhost:3001 will be allowed. 
        }
    )
)

app.post("/synthesize", async (req, res) => {  // listens for HTTP POST requests at the /synthesize URL path
    console.log(req.body.text)
    const text = req.body.text
    try {
        res.json("Recieved"); // response.data->"Revieced" Represents the response object that will be sent back to the client. You use this to send data or status codes back in the response.
    }
    catch (error) {
        console.log(error);
    }
})

const_posrt = 3002
app.listen(const_posrt, () => {
    console.log(`Server is running on port ${const_posrt}`)
})