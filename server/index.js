const express = require('express')
const app = express()
const axios = require('axios');
const { spawn } = require('child_process');


//updated every week over 3 days (due to max 100 youtube requests per day)
const videoIds = {

    //TikTok search 'lofi'
    lofiVideoIds : [],

    //TikTok search 'popular'
    popularVideoIds : [],
    
    //TikTok search 'indiemusic'
    indieMusicVideoIds : [],

    //TikTok search 'r&bjams'
    rBJamsVideoIds : [],

    //TikTok search 'challenge'
    challengeVideoIds : [],

    //TikTok search 'hip-hopmusic'
    HiphopVideoIds : []
}



function updatePlaylist(nameOfPlaylist, tiktokSearchTerm) {
    const pyProg = spawn('python3', ['./scrape-tiktok/test.py', tiktokSearchTerm, '5']);
    pyProg.stdout.on('data', function(data) {
        // console.log(JSON.parse(data));
        getYoutubeIds(JSON.parse(data), nameOfPlaylist);
    })
}

// updateLofiPlaylist();

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



//pass in an array of objects with Artist + Title keys
function getYoutubeIds(TiktokSongs, playlistName) {
let youtubeResponses = [];
let promises = [];
for (i = 0; i < TiktokSongs.length; i++) {
  promises.push(
    axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${TiktokSongs[i].Artist + "-" + TiktokSongs[i].Title }&type=video&key=${process.env.YOUTUBE_API_KEY}`).then(response => {
      // do something with response
      youtubeResponses.push(response.data.items[0].id.videoId);
    })
  )
}
Promise.all(promises).then(() => addIdsToPlaylist(youtubeResponses, playlistName));
}


function addIdsToPlaylist(arrayIn, playlistName) {
    videoIds[playlistName] = arrayIn;
    console.log("hehe", arrayIn);
    console.log(videoIds.lofiVideoIds);
}

updatePlaylist('lofiVideoIds', 'lofi');



app.listen(4000, () => console.log('Application listening on port 4000!'))




//single youtube request function

// function getYoutubeUrl(tiktokData, callback) {
//     return axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${tiktokData}&type=video&key=${process.env.YOUTUBE_API_KEY}`)
//         .then(response => {
//             callback(false, response.data.items[0].id.videoId);
//         })
//         .catch(error => {
//             return callback(error);
//         })
// }