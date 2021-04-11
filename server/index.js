const express = require('express')
const app = express();
const axios = require('axios');
const { spawn } = require('child_process');
const PORT = process.env.PORT || 3001;
const path = require('path');
require('dotenv').config();

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

//updated every week over 3 days (due to max 100 youtube requests per day) placeholder values are seen below
const videoIds = {

    //TikTok search 'lofi'
    lofi : [
        {artist: 'Ponder', title: 'Lofi', videoId: 'xbryhFXXano'},
        {artist: 'Lofi-Network', title: 'Sunset-Vibes', videoId: 'UxZdyOv9Zdk'},
        {artist: 'Aesthetic-Sounds', title: 'Lofi', videoId: 'W6YI3ZFOL0A'},
        {artist: 'Acey', title: 'Lofi', videoId: '0bCAmpLoIs8'},
        {artist: 'Emapea', title: 'Lofi', videoId: 'FOwll8s6hAs'},
        {artist: 'Domknowz', title: 'Lofi', videoId: '4Q9WNQcKLYU'},
        {artist: 'Merlin', title: 'Uh-Oh-Stinky', videoId: 's424d3PkroY'},
        {artist: 'Fluce', title: 'LoFi', videoId: 'Pc0nDCq1EYY'},
        {artist: 'Lo-Fi-Hip-Hop', title: 'City-Pop-(LoFi)', videoId: 'EC24rvm5Awk'}
      ],

    //TikTok search 'popular'
    popular : [
        {artist: 'Popp-Hunna', title: 'Adderall-(Corvette-Corvette)', videoId: 'oJlfuBHLf0o'},
        {artist: 'Roy-Kk', title: 'Unlock-It-(Ctrl-Superlove)', videoId: 'ZR89We7V8_w'},
        {artist: 'Cardi-B', title: 'Up', videoId: 'rCiBgLOcuKU'},
        {artist: 'Big-Homie-Ty.Ni', title: 'Jelly', videoId: 'z_I0n7IAqSA'},
        {artist: 'Lizz-Robinett', title: 'Renai-Circulation-(English-Cover)-[TV-Size]', videoId: 'cHFJibnAWTE'},
        {artist: 'Jawsh-685', title: 'Laxed-(Siren-Beat)', videoId: 'E0gFA08-9xM'},
        {artist: 'ElyOtto', title: 'SugarCrash!', videoId: 'bWLgA4jUkuw'},
        {artist: 'Masked-Wolf', title: 'Astronaut-In-The-Ocean', videoId: 'MEg-oqI9qmw'},
        {artist: 'Kreepa', title: 'Oh-No', videoId: '1nkYkB-nXR0'}
      ],
    
    //TikTok search 'indiemusic'
    indie : [
        {artist: 'The-Wombats', title: 'Greek-Tragedy-(Oliver-Nelson-TikTok-Remix)', videoId: 'BtAQfFWYrig'},
        {artist: 'Blondes', title: 'Coming-of-Age', videoId: 'tSRits05kis'},
        {artist: 'Frances-Forever', title: 'Space-Girl', videoId: 'n1FdqKnBR4A'},
        {artist: 'Will-Joseph-Cook', title: 'Be-Around-Me', videoId: 'pjolhlLBb6g'},
        {artist: 'Glass-Animals', title: 'Heat-Waves', videoId: 'mRD0-GxqHVo'},
        {artist: 'grandson', title: 'Blood-//-Water', videoId: 'Sk-U8ruIQyA'},
        {artist: 'Ritt-Momney', title: 'Put-Your-Records-On', videoId: 'WyVfkr6nsrk'},
        {artist: 'The-xx', title: 'Intro', videoId: 'veHqJSC-9Lo'},
        {artist: 'Claire-Rosinkranz', title: 'Backyard-Boy', videoId: 'Mbj26vHDMII'},
        {artist: 'The-Smiths', title: 'This-Charming-Man-(2011-Remaster)', videoId: 'OYYZFx7_DS8'}
      ],

    //TikTok search 'r&bjams'
    rBJams : [
        {artist: 'Sav-Izzi', title: 'R-&-B-Jam', videoId: '16thjt8z0yo'},
        {artist: 'J-Tade', title: 'R&B', videoId: 'ouChWyF966Y'},
        {artist: 'PB-Jams', title: 'Intergalactic-Being', videoId: '1P2Jq6OIuaQ'},
        {artist: 'Ikaz-Boi', title: 'R&B-Super-Jam', videoId: 'E2bksQgiZmQ'},
        {artist: 'Jams', title: 'Per-noi-si-chiama-jams', videoId: '-nUmAq6ZwLg'},
        {artist: 'Jams', title: '1000-Like', videoId: 'y9L4UQYZdTA'},
        {artist: 'tuliob', title: 'altos-r&b-jam', videoId: 'i96EzK3o-QU'},
        {artist: 'RMC-Jams', title: 'Today-Will-Be', videoId: 'C4bPzTWcClw'},
        {artist: 'RMC-Jams', title: 'Lera', videoId: 'cpLZeSigNvY'},
        {artist: 'RMC-Jams', title: 'This-World', videoId: 'RYOi2LSsUb0'}
      ],

    //TikTok search 'challenge'
    challenge : [
        {artist: 'Cardi-B', title: 'Up', videoId: 'rCiBgLOcuKU'},
        {artist: 'Lizz-Robinett', title: 'Renai-Circulation-(English-Cover)-[TV-Size]', videoId: 'cHFJibnAWTE'},
        {artist: 'Jawsh-685', title: 'Laxed-(Siren-Beat)', videoId: 'E0gFA08-9xM'},
        {artist: 'ElyOtto', title: 'SugarCrash!', videoId: 'bWLgA4jUkuw'},
        {artist: 'Conkarah', title: 'Banana-(feat.-Shaggy)-[DJ-FLe---Minisiren-Remix]', videoId: 'sy9l7y7npGs'},
        {artist: 'Erica-Banks', title: 'Buss-It', videoId: 'NOoHJ_ZXlJU'},
        {artist: 'Millie-B', title: 'M-to-the-B', videoId: 'FSjvlnneEto'},
        {artist: 'lil-darkie', title: 'HAHA', videoId: 'QXXXSRQd4TI'},
        {artist: 'Vengaboys', title: 'Boom,-Boom,-Boom,-Boom!!', videoId: 'llyiQ4I-mcQ'}
      ],

    //TikTok search 'hip-hopmusic'
    hipHop : [
        {artist: 'Russ', title: 'CIVIL-WAR-(Bonus)', videoId: 'LUJoU-vDzfM'},
        {artist: 'Tay-K', title: 'The-Race-(feat.-21-Savage-&-Young-Nudy)-(Remix)', videoId: 'a3PpYLI4c2o'},
        {artist: 'MORGENSHTERN', title: 'Noviy-Merin', videoId: 'uVPoGMu3LQo'},
        {artist: 'Don-Toliver', title: 'No-Idea-(DJ-Purpberry-Chopped-and-Screwed)', videoId: 'yZtv_FU9N90'},
        {artist: 'Polo-G-&-Stunna-4-Vegas', title: 'Go-Stupid', videoId: '64IGINWXrGQ'},
        {artist: 'The-Notorious-B.I.G.', title: 'Big-Poppa-(2007-Remaster)', videoId: 'QceVTChhlJM'},
        {artist: 'Dubskie', title: 'All-About-Cake', videoId: '25qLu1flvNE'},
        {artist: 'Jason-Derulo', title: 'Get-Ugly', videoId: 'S2lgnitdPdc'},
        {artist: 'Farruko-&-Nicki-Minaj-&-Bad-Bunny', title: 'Krippy-Kush-(feat.-Travis-Scott-&-Rvssian)-(Travis-Scott-Remix)', videoId: 'puugRJxgdt4'},
        {artist: "Heuss-L'enfoiré", title: 'Moulaga', videoId: 'z_MVN07qM8k'}
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




function updatePlaylist(nameOfPlaylist, tiktokSearchTerm) {
    const pyProg = spawn('python3', ['./scrape-tiktok/test.py', tiktokSearchTerm, '10']);
    pyProg.stdout.on('data', function(data) {

        getYoutubeIds(JSON.parse(data), nameOfPlaylist);
    })
}

let data = [];

//pass in an array of objects with Artist + Title keys
function getYoutubeIds(TiktokSongs, playlistName) {
    const ytRequests = TiktokSongs.map(item => axios.get(
      `https://www.googleapis.com/youtube/v3/search?
  part=snippet&maxResults=1&q=${item.Artist}-${item.Title}&type=video&key=${process.env.YOUTUBE_API_KEY}`
    ).then(
      response => ({artist: item.Artist, title: item.Title, videoId: response.data.items[0].id.videoId})
    ).catch(
      error => {
        console.log("error:" + error);
        return null;
      }
    ));
  
    return Promise.all(ytRequests).then(
      results => {
        videoIds[playlistName] = results.filter(result => result !== null);
        console.log(videoIds[playlistName]);
      }
    );
  }


//these functions need to be triggered once per week. Max 2 per day (youtube api limit). 

//updatePlaylist('lofi','lofi');

//updatePlaylist('popular', 'popular');

//updatePlaylist('indie', 'indiemusic');

//updatePlaylist('rBJams', 'r&bjams');

//updatePlaylist('challenge', 'challenge');

//updatePlaylist('hipHop', 'hip-hopmusic');


app.listen(PORT, () => console.log(`Application listening on port ${PORT}!`))
