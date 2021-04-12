import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Components/Header';
import Playlist from './Components/Playlist';
import ReactPlayer from 'react-player';
import UnmuteLightbox from './Components/UnmuteLightbox';
import Controls from './Components/Controls';
import MobileMenu from './Components/MobileMenu';

export default function App() {

  const [chosenPlaylist, setChosenPlaylist] = useState('lofi');
  const [chosenVideoId, setChosenVideoId] = useState();
  const [videoIDs, setVideoIDs] = useState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [volume, setVolume] = useState(0);
  const [volumeWhenMuted, setVolumeWhenMuted] = useState(1);
  const [showLightbox, setShowLightbox] = useState(true);
  const [showLoadingAni, setShowLoadingAni] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);

  function removeLightbox() {
    setShowLightbox(false);
    setVideoPlaying(true);
    setVideoMuted(false);
    setVolume(1);
    setShowLoadingAni(true);
  }


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

    if (windowWidth < 550) {
      setVideoPlaying(false);
      setVideoMuted(false);
    }

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
    setVideoMuted(false);

    if (volume !== 0) {
      setVolumeWhenMuted(volume);
      setVolume(0);
      return;
    }

    setVolume(volumeWhenMuted);
  }

  function togglePlay() {
    setVideoPlaying(!videoPlaying);
  }

  function changeVolume(sliderValue) {
    setVolume(sliderValue/100);
    setVideoMuted(false);
  }
  
  function stopLoading() {
    setShowLoadingAni(false);
  }

  function togglePlaylist() {
    setShowPlaylist(!showPlaylist);
  }

  return (
    <div id='app-container' style={{minWidth: windowWidth, minHeight: windowHeight, maxHeight: windowHeight, maxWidth: windowWidth}}>
      <Header setPlaylist={setPlaylist} chosenPlaylist={chosenPlaylist} windowWidth={windowWidth} showLightbox={showLightbox} togglePlaylist={togglePlaylist} showPlaylist={showPlaylist}/>
      {showPlaylist === true ? renderPlaylist() : <MobileMenu setPlaylist={setPlaylist} togglePlaylist={togglePlaylist} chosenPlaylist={chosenPlaylist}/>}
      <div className = 'youtube-container'>
        <ReactPlayer className = 'video-player' url= {chosenVideoId === undefined ? null : `https://www.youtube.com/watch?v=${chosenVideoId}`} volume={volume} playing={videoPlaying} muted={videoMuted} onEnded={playNextVideo} onStart={stopLoading}></ReactPlayer>
      </div>
      <Controls windowWidth={windowWidth} playPreviousVideo={playPreviousVideo} togglePlay={togglePlay} playNextVideo={playNextVideo} changeVolume={changeVolume} volume={volume} toggleMute={toggleMute} videoPlaying={videoPlaying} {...{showLoadingAni}} />
      {showLightbox === true ? <UnmuteLightbox windowWidth={windowWidth} removeLightbox={removeLightbox}/> : null}
    </div>
  );
}


