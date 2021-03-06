const express = require('express')
const app = express()
const axios = require('axios');

let lofiUrls = [];
let popularUrls = [];
let kPopUrls = [];


app.get('/api/popular', (req, res) => {

    const { spawn } = require('child_process');
    const pyProg = spawn('python3', ['./scrape-tiktok/test.py', 'popular', '20']);

    pyProg.stdout.on('data', function(data) {

        
        
        console.log(JSON.parse(data)[0].Artist);

        let artist = JSON.parse(data)[0].Artist;

        return getYoutubeUrl(artist, (err, data) => {
            if (err) console.log('error');//upstream request failed

            console.log(JSON.stringify(data));
            // res.setHeader('Content-Type', 'application/json');
            // res.write(data);
            // res.send(data);
            res.end();
          })
    });
})

app.get('/api/lofi', (req, res) => {

    const { spawn } = require('child_process');
    const pyProg = spawn('python3', ['./scrape-tiktok/test.py', 'lofi', '20']);

    pyProg.stdout.on('data', function(data) {

      
        res.write(data);
        res.end('end');
    });
})

function getYoutubeUrl(tiktokData, callback) {
    return axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${tiktokData}&type=video&key=${process.env.YOUTUBE_API_KEY}`)
        .then(response => {
            callback(false, response.data.items[0].id.videoId);
        })
        .catch(error => {
            return callback(error);
        })
}


app.listen(4000, () => console.log('Application listening on port 4000!'))



