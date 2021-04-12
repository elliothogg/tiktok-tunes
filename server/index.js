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
        {artist: 'Lo-Fi-Hip-Hop', title: 'City-Pop-(LoFi)', videoId: 'EC24rvm5Awk'},
        {artist: 'Ponder', title: 'Lofi', videoId: 'xbryhFXXano'},
        {artist: 'Lofi-Network', title: 'Sunset-Vibes', videoId: 'UxZdyOv9Zdk'},
        {artist: 'Aesthetic-Sounds', title: 'Lofi', videoId: 'W6YI3ZFOL0A'},
        {artist: 'Acey', title: 'Lofi', videoId: '0bCAmpLoIs8'},
        {artist: 'Emapea', title: 'Lofi', videoId: 'FOwll8s6hAs'},
        {artist: 'Domknowz', title: 'Lofi', videoId: '4Q9WNQcKLYU'},
        {artist: 'Merlin', title: 'Uh-Oh-Stinky', videoId: 's424d3PkroY'},
        {artist: 'Fluce', title: 'LoFi', videoId: 'Pc0nDCq1EYY'},
        {artist: 'Lostbeats', title: 'Lofi', videoId: 'VpTeQ2mh0tU'},
        {artist: 'Sol4ac', title: 'Lofi', videoId: 'bFuRIWPhs-0'},
        {artist: 'B.Young-Beats', title: 'Lofi', videoId: 'djABGMwUVKA'}
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
        {artist: 'Kreepa', title: 'Oh-No', videoId: '1nkYkB-nXR0'},
        {artist: 'Johnny-Orlando-&-Mackenzie-Ziegler', title: 'What-If-(I-Told-You-I-Like-You)', videoId: 'KWG9uaw4htM'},
        {artist: 'Conkarah', title: 'Banana-(feat.-Shaggy)-[DJ-FLe---Minisiren-Remix]', videoId: 'sy9l7y7npGs'},
        {artist: 'CG5', title: 'Absolutely-Anything-(feat.-Or3o)', videoId: 'VxeQ1NXeOFk'}
        // {artist: 'BENEE', title: 'Supalonely-(feat.-Gus-Dapperton)', videoId: 'Rb6Scz-5YOs'},
        // {artist: 'DaBaby,-Roddy-Ricch', title: 'ROCKSTAR', videoId: 'mxFstYSbBmc'},
        // {artist: 'Kevin-MacLeod', title: 'Monkeys-Spinning-Monkeys', videoId: 'mWo3woi9Uro'}
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
        {artist: 'The-Smiths', title: 'This-Charming-Man-(2011-Remaster)', videoId: 'OYYZFx7_DS8'},
        {artist: 'Cyndi-Lauper', title: 'Girls-Just-Want-to-Have-Fun', videoId: 'PIb6AZdTr-A'},
        {artist: 'Neffex', title: "I'm-Not-Worth-It", videoId: 'hX94W2I6D8c'}
        // {artist: 'Billie-Eilish', title: 'Ocean-Eyes', videoId: 'viimfQi_pUw'},
        // {artist: 'grandson', title: 'Blood-//-Water-(Krupa-Remix)', videoId: 'wv4pkUgTcjk'},
        // {artist: 'The-Cranberries', title: 'Dreams-(Acoustic-Version)', videoId: '5qY0BzrDXp0'},
        // {artist: 'Lianne-La-Havas', title: 'Unstoppable-(FKJ-Remix)', videoId: 'QCjAHj_qnCg'}
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
        {artist: 'RMC-Jams', title: 'This-World', videoId: 'RYOi2LSsUb0'},
        {artist: 'The-Urban-Hip-Hop-Studio', title: 'RnB-Jams--(Tempo-100)', videoId: 'umpbICiow8c'},
        {artist: 'Jason-Damico', title: 'B-Jam', videoId: 'tcYjXiI5lNk'}
        // {artist: 'Boomer-Jams', title: 'Heart-Murmurs-R&b', videoId: 'KnoZflwkfSA'},
        // {artist: 'Cates-Ave.', title: 'B-Jam', videoId: 'YjNMh1vK61A'},
        // {artist: 'We-Funk', title: 'B-Jam', videoId: '9a5iRkVZEzE'},
        // {artist: 'Jennifer-J.-McCaskill', title: '3-D-Jams', videoId: '4yYiypz3vnI'},
        // {artist: 'Ifjams', title: 'Lately', videoId: 'Ma-UIJNV094'},
        // {artist: 'Ifjams', title: 'Secondfloor', videoId: 'MIrSwjATAgM'},
        // {artist: 'Ifjams', title: 'LSD', videoId: 'IwxCrHVPLV8'},
        // {artist: 'Ifjams', title: '53A-Canalport-Ave.', videoId: 'GYb_Ev4nMZU'}
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
        {artist: 'Vengaboys', title: 'Boom,-Boom,-Boom,-Boom!!', videoId: 'llyiQ4I-mcQ'},
        {artist: 'DDG-&-OG-Parker', title: 'Impatient-(feat.-Coi-Leray)', videoId: 'SBgUhk6Y8M4'},
        {artist: 'Kevin-MacLeod', title: 'Monkeys-Spinning-Monkeys', videoId: 'mWo3woi9Uro'},
        {artist: 'Michael-Jackson', title: 'Bad-(2012-Remaster)', videoId: 'o-Ncnh5dcJU'}
        // {artist: 'Rilès', title: 'Pesetas', videoId: 'kJNk4TW7RAk'},
        // {artist: 'The-Kiboomers', title: 'The-Months-of-the-Year', videoId: '-d3jkbP1xc8'},
        // {artist: 'Zay-Hilfigerrr-&-Zayion-McCall', title: 'Juju-on-That-Beat-(TZ-Anthem)-[Challenge-Version]', videoId: 'a2v_zGWawP0'},
        // {artist: 'DOLLA', title: 'Impikan---Challenge', videoId: '2CwtrCWlqPw'},
        // {artist: 'Aidilia-Hilda', title: 'Tak-Mau-Mau---Challenge', videoId: '2GN4B34QOsk'}
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
        {artist: "Heuss-L'enfoiré", title: 'Moulaga', videoId: 'z_MVN07qM8k'},
        {artist: 'El-Alfa-&-Chael-Produciendo', title: 'Singapur', videoId: 's5yRZOQ3EWI'},
        {artist: 'Travis-Porter', title: 'Ayy-Ladies', videoId: '37FhMnV-sxc'},
        {artist: 'Justin-Bieber', title: 'Come-Around-Me', videoId: 'C86jztHhLyk'}
        // {artist: 'PnB-Rock', title: 'Selfish-(Shlohmo-Remix)', videoId: 'GQDMLSJE3c0'},
        // {artist: 'Lil-Nas-X', title: 'Old-Town-Road-(feat.-Billy-Ray-Cyrus)-(Remix)', videoId: '7ysFgElQtjI'},
        // {artist: 'ilyTOMMY-&-Savage-Ga$p', title: 'Tunnel-of-Love-(Remix)', videoId: 'W9Ul8EJ05Mo'},
        // {artist: 'Mc-Talibã-&-Mc-3L', title: 'Um-Sabadão-Desse-Uma-Lua-Dessa', videoId: 'Gaec2xS-2D4'},
        // {artist: 'Sage-The-Gemini', title: 'Now-and-Later', videoId: 'ACPd7HSZkc0'},
        // {artist: 'Gaming-World', title: 'Orange-Justice-Dance-Emote-(From-"-Fortnite-Battle-Royale")', videoId: 'MH0XmZvryRs'},
        // {artist: 'Sidhu-Moosewala-&-Amrit-Maan', title: 'Bambiha-Bole-8', videoId: 'F2J_k79vxGI'},
        // {artist: 'Yung-Bae-&-bbno$-&-Billy-Marchiafava', title: 'Bad-Boy', videoId: 'vaG_I9aBENw'},
        // {artist: 'Sandhu-Surjit', title: 'Puthe-Kamm', videoId: 'C90MmUhsnHM'}
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
    const pyProg = spawn('python3', ['./scrape-tiktok/test.py', tiktokSearchTerm, '20']);
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
