import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './Components/Header';
import Playlist from './Components/Playlist';

export default function App() {

  const [chosenPlaylist, setChosenPlaylist] = useState('lofi');
  const [videoIDs, setVideoIDs] = useState();

  useEffect(() => {
    fetch('/api/videoIDs')
      .then(response => response.json())
      .then(data => setVideoIDs(data))
  }, [] )

  function renderPlaylist() {
    if (videoIDs === undefined) return
    else return <Playlist playlist={videoIDs[chosenPlaylist]}/>
  }


  function setPlaylist(playlist) {
    setChosenPlaylist(playlist);
  }

  console.log(chosenPlaylist);

  return (
    <>
      <Header setPlaylist={setPlaylist}/>
      {renderPlaylist()}
    </>
  );
}


