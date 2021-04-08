import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Components/Header';
import Playlist from './Components/Playlist';
import ReactPlayer from 'react-player';

export default function App() {

  const [chosenPlaylist, setChosenPlaylist] = useState('lofi');
  const [chosenVideoId, setChosenVideoId] = useState();
  const [videoIDs, setVideoIDs] = useState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(true);

  function handleResize(e) {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }

  useEffect(() => {
    fetch('/api/videoIDs')
      .then(response => response.json())
      .then(data => {
        setVideoIDs(data);
        setChosenVideoId(data.lofi[0].videoId);
      })

    window.addEventListener("resize", handleResize);
  }, [] )

  useEffect(()=> {
    if (videoIDs) setChosenVideoId(videoIDs[chosenPlaylist][0].videoId);
  }, [chosenPlaylist])
  
  function setVideo(videoId) {
    setChosenVideoId(videoId);
  }

  function renderPlaylist() {
    if (videoIDs === undefined) return
    else return <Playlist setVideo={setVideo} selectedVideoId={chosenVideoId} playlist={videoIDs[chosenPlaylist]}/>
  }


  function setPlaylist(playlist) {
    setChosenPlaylist(playlist);
  }



  function playNextVideo() {
    let playlistLength = videoIDs[chosenPlaylist].length;
    let currentVideo = videoIDs[chosenPlaylist].findIndex(element => element.videoId === chosenVideoId);
    let nextVideoIndex = currentVideo + 1;
    if (nextVideoIndex >= playlistLength) nextVideoIndex = 0; 
    setChosenVideoId(videoIDs[chosenPlaylist][nextVideoIndex].videoId);
  }

  function playPreviousVideo() {
    let playlistLength = videoIDs[chosenPlaylist].length;
    let currentVideo = videoIDs[chosenPlaylist].findIndex(element => element.videoId === chosenVideoId);
    let nextVideoIndex = currentVideo - 1;
    if (nextVideoIndex === -1) nextVideoIndex = playlistLength - 1; 
    setChosenVideoId(videoIDs[chosenPlaylist][nextVideoIndex].videoId);
  }

  //This function unmutes the video once its playing. This is needed as youtube won't autoplay if the video isn't muted
  function toggleMute() {
    setVideoMuted(!videoMuted);
  }

  function togglePlay() {
    setVideoPlaying(!videoPlaying);
  }


  

  return (
    <div id='app-container' style={{minWidth: windowWidth, minHeight: windowHeight, maxHeight: windowHeight, maxWidth: windowWidth}}>
      <Header setPlaylist={setPlaylist} chosenPlaylist={chosenPlaylist}/>
      {renderPlaylist()}
      <div className = 'youtube-container'>
        <ReactPlayer className = 'video-player' url= {chosenVideoId === undefined ? null : `https://www.youtube.com/watch?v=${chosenVideoId}`} playing={videoPlaying} muted={videoMuted} onEnded={playNextVideo}></ReactPlayer>
      </div>
      <button className='mute-unmute-button' onClick={toggleMute}>Unmute</button>
      <button className='play-pause-button' onClick={togglePlay}>Play</button>
      <button className='next-track-button' onClick={playNextVideo}>Next</button>
      <button className='previous-track-button' onClick={playPreviousVideo}>Previous</button>

    </div>
  );
}


