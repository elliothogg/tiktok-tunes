const express = require('express')
const app = express()
const axios = require('axios');
const { spawn } = require('child_process');


//updated every week over 3 days (due to max 100 youtube requests per day)
const videoIds = {

    //TikTok search 'lofi'
    lofi : [
        { artist: 'Ponder', title: 'Lofi', videoId: 'xbryhFXXano' },
        { artist: 'Lofi-Network', title: 'Sunset-Vibes', videoId: 'UxZdyOv9Zdk'},
        { artist: 'Aesthetic-Sounds', title: 'Lofi', videoId: 'W6YI3ZFOL0A' },
        { artist: 'Acey', title: 'Lofi', videoId: '0bCAmpLoIs8' },
        { artist: 'Emapea', title: 'Lofi', videoId: 'FOwll8s6hAs' },
        { artist: 'Domknowz', title: 'Lofi', videoId: '4Q9WNQcKLYU' },
        { artist: 'Merlin', title: 'Uh-Oh-Stinky', videoId: 's424d3PkroY' },
        { artist: 'Fluce', title: 'LoFi', videoId: 'Pc0nDCq1EYY' },
        {artist: 'Lo-Fi-Hip-Hop', title: 'City-Pop-(LoFi)', videoId: 'EC24rvm5Awk'}
      ],

    //TikTok search 'popular'
    popular : [ 
        'BfV4ZDgumTQ',
        'jiXP-FRrSOg',
        'E0gFA08-9xM',
        {artist: 'Popp-Hunna', title: 'Adderall-(Corvette-Corvette)', videoId: 'oJlfuBHLf0o' }
    ],
    
    //TikTok search 'indiemusic'
    indie : [
        'tSRits05kis',
        'n1FdqKnBR4A',
        'pjolhlLBb6g',
        'BtAQfFWYrig',
        'mRD0-GxqHVo'
      ],

    //TikTok search 'r&bjams'
    rBJams : [
        'AhWcQwn2420',
        '5cntWT8qAjY',
        'JH4iPuW-W4U',
        '16thjt8z0yo' 
    ],

    //TikTok search 'challenge'
    challenge : [
        'rCiBgLOcuKU',
        'E0gFA08-9xM',
        'sy9l7y7npGs',
        'BKJDpuUfXxA',
        'rCiBgLOcuKU'
    ],

    //TikTok search 'hip-hopmusic'
    hipHop : [
        '8H8L2yPgI68',
        'a2v_zGWawP0',
        'C86jztHhLyk',
        '62lsXiMR7Sk',
        'l0U7SxXHkPY'
    ]
}

app.get('/api/videoIDs', (req, res) => {
    res.send(videoIds);
})

app.get('/api/lofi', (req, res) => {
    res.send(videoIds.lofi);
})

app.get('/api/popular', (req, res) => {
    res.send(videoIds.popular);
})

app.get('/api/indie', (req, res) => {
    res.send(videoIds.indie);
})

app.get('/api/randb', (req, res) => {
    res.send(videoIds.rBJams);
})

app.get('/api/challenges', (req, res) => {
    res.send(videoIds.challenge);
})

app.get('/api/hiphop', (req, res) => {
    res.send(videoIds.hipHop);
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
    const pyProg = spawn('python3', ['./scrape-tiktok/test.py', tiktokSearchTerm, '10']);
    pyProg.stdout.on('data', function(data) {

        getYoutubeIds(JSON.parse(data), nameOfPlaylist);
    })
}

let data = [];

//pass in an array of objects with Artist + Title keys
function getYoutubeIds(TiktokSongs, playlistName) {
    
    TiktokSongs.map( (items) => {
        data.push( {Artist: items.Artist, Title: items.Title, videoId: ''} );
    });
    
    let youtubeResponses = [];
    let promises = [];
    TiktokSongs.map((item) => {
        return promises.push(
            axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${item.Artist + "-" + item.Title }&type=video&key=${process.env.YOUTUBE_API_KEY}`)
            .then( response => {
            youtubeResponses.push({artist: item.Artist, title: item.Title, videoId: response.data.items[0].id.videoId});
            })
            .catch((error) => {
                console.log("error:" + error);
            })
        )
    });
    Promise.all(promises).then(() => {
        videoIds[playlistName] = youtubeResponses;
        console.log(videoIds[playlistName]);
    });
}


//these functions need to be triggered once per week. Max 2 per day (youtube api limit). Can't run two at same time.

//updatePlaylist('lofi','lofi');

//updatePlaylist('popular', 'popular');

//updatePlaylist('indie', 'indiemusic');

//updatePlaylist('rBJams', 'r&bjams');

//updatePlaylist('challenge', 'challenge');

//updatePlaylist('hipHop', 'hip-hopmusic');

app.listen(3001, () => console.log('Application listening on port 4000!'))




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