const express = require('express')
const app = express()
const axios = require('axios');
const { spawn } = require('child_process');


//updated every week over 3 days (due to max 100 youtube requests per day)
const videoIds = {

    //TikTok search 'lofi'
    lofiVideoIds : [
        'xbryhFXXano',
        'W6YI3ZFOL0A',
        '4Q9WNQcKLYU',
        's424d3PkroY',
        '0bCAmpLoIs8'
      ],

    //TikTok search 'popular'
    popularVideoIds : [ 
        'BfV4ZDgumTQ',
        'jiXP-FRrSOg',
        'E0gFA08-9xM',
        'oJlfuBHLf0o' 
    ],
    
    //TikTok search 'indiemusic'
    indieMusicVideoIds : [
        'tSRits05kis',
        'n1FdqKnBR4A',
        'pjolhlLBb6g',
        'BtAQfFWYrig',
        'mRD0-GxqHVo'
      ],

    //TikTok search 'r&bjams'
    rBJamsVideoIds : [
        'AhWcQwn2420',
        '5cntWT8qAjY',
        'JH4iPuW-W4U',
        '16thjt8z0yo' 
    ],

    //TikTok search 'challenge'
    challengeVideoIds : [
        'rCiBgLOcuKU',
        'E0gFA08-9xM',
        'sy9l7y7npGs',
        'BKJDpuUfXxA',
        'rCiBgLOcuKU'
    ],

    //TikTok search 'hip-hopmusic'
    HiphopVideoIds : [
        '8H8L2yPgI68',
        'a2v_zGWawP0',
        'C86jztHhLyk',
        '62lsXiMR7Sk',
        'l0U7SxXHkPY'
    ]
}

app.get('/api/popular', (req, res) => {

    const { spawn } = require('child_process');
    const pyProg = spawn('python3', ['./scrape-tiktok/test.py', 'popular', '5']);

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


function updatePlaylist(nameOfPlaylist, tiktokSearchTerm) {
    const pyProg = spawn('python3', ['./scrape-tiktok/test.py', tiktokSearchTerm, '5']);
    pyProg.stdout.on('data', function(data) {
        console.log(JSON.parse(data));
        getYoutubeIds(JSON.parse(data), nameOfPlaylist);
    })
}

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
            .catch((error) => {
                console.log("error:" + error);
            })
        )
    }
    Promise.all(promises).then(() => {
        videoIds[playlistName] = youtubeResponses;
        console.log(videoIds[playlistName]);
    });
}


//these functions need to be triggered once per week. Max 2 per day (youtube api limit). Can't run two at same time.

//updatePlaylist('lofiVideoIds','lofi');

//updatePlaylist('popularVideoIds', 'popular');

//updatePlaylist('indieMusicVideoIds', 'indiemusic');

//updatePlaylist('rBJamsVideoIds', 'r&bjams');

//updatePlaylist('challengeVideoIds', 'challenge');

//updatePlaylist('HiphopVideoIds', 'hip-hopmusic');

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