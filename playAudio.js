const Speaker = require('speaker');
const { PassThrough } = require('stream');
const { BufferListStream } = require('bl');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffmpegPath);

let currentSpeaker = null; // Reference to the current speaker

function playAudio(response) {
    // takes in mp3 and plays it
    
    return new Promise((resolve, reject) => {  // resolving the promise when the Speaker has finished playing
        const audioStream = new PassThrough();
        response.data.pipe(audioStream);
        const speaker = new Speaker({
            channels: 2, 
            bitDepth: 16,
            sampleRate: 44100,
        });

        currentSpeaker = speaker;

        const bufferedStream = new BufferListStream();
        audioStream.pipe(bufferedStream);

        bufferedStream.on('finish', () => {
            const playbackStream = new PassThrough();
            playbackStream.end(bufferedStream.slice());
            
            // Convert the response to the desired audio format and play it
            ffmpeg(playbackStream)
            .toFormat("s16le")
            .audioChannels(2)
            .audioFrequency(44100)
            .pipe(speaker)
            .on('finish', resolve) // when finished spoken => resolved => return to for loop for next sentence
            .on('error', reject);
        });
    });
}

function stopAudio() {
    console.log("Stop playing audio");
    if (currentSpeaker) {
        currentSpeaker.end(); // Stop the speaker
        currentSpeaker = null; // Clear the reference
    }
}


module.exports = { playAudio, stopAudio };