import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Components/Header';
import Playlist from './Components/Playlist';
import ContinousSlider from './Components/volumeSlider';
import ReactPlayer from 'react-player';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import UnmuteLightbox from './Components/UnmuteLightbox';

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

  function removeLightbox() {
    setShowLightbox(false);
    setVideoMuted(false);
    setVolume(1);
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
        console.log(data);
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
  

  return (
    <div id='app-container' style={{minWidth: windowWidth, minHeight: windowHeight, maxHeight: windowHeight, maxWidth: windowWidth}}>
      <Header setPlaylist={setPlaylist} chosenPlaylist={chosenPlaylist} windowWidth={windowWidth} videoMuted={videoMuted}/>
      {renderPlaylist()}
      <div className = 'youtube-container'>
        <ReactPlayer className = 'video-player' url= {chosenVideoId === undefined ? null : `https://www.youtube.com/watch?v=${chosenVideoId}`} volume={volume} playing={videoPlaying} muted={videoMuted} onEnded={playNextVideo}></ReactPlayer>
      </div>
      <div className='controls'>
      <SkipPreviousIcon className='control-icons' onClick={playPreviousVideo}/>
      {videoPlaying === true ? <PauseIcon className='control-icons' onClick={togglePlay}/> : <PlayArrowIcon className='control-icons' onClick={togglePlay}/>}
      <SkipNextIcon className='control-icons' onClick={playNextVideo}/>
      <ContinousSlider changeVolume={changeVolume} volume={volume} toggleMute={toggleMute}/>
      </div>
      {showLightbox === true ? <UnmuteLightbox windowWidth={windowWidth} removeLightbox={removeLightbox}/> : null}
      

    </div>
  );
}


