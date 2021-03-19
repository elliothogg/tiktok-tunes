import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './Components/Header';
import Playlist from './Components/Playlist';
import YouTube from 'react-youtube';

export default function App() {

  const [chosenPlaylist, setChosenPlaylist] = useState('lofi');
  const [chosenVideoId, setChosenVideoId] = useState();
  const [videoIDs, setVideoIDs] = useState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

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
    setChosenVideoId('lTRiuFIWV54');
  }

  console.log(chosenPlaylist);

  return (
    <div id='app-container' style={{minWidth: windowWidth, minHeight: windowHeight, maxHeight: windowHeight, maxWidth: windowWidth}}>
      <Header setPlaylist={setPlaylist} chosenPlaylist={chosenPlaylist}/>
      {renderPlaylist()}
      <YouTube
        videoId={chosenVideoId}                // defaults -> null
        containerClassName='youtube-container'
        opts={ { playerVars: {autoplay: 1, controls: 0, disablekb: 1, fs:0, modestbranding: 1, rel: 1, playsinline: 1, showinfo: 0, enablejsapi: 1}} }
        onEnd={playNextVideo}
      />
    </div>
  );
}


