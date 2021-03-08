import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './Components/Header';

export default function App() {

  const [videoIDs, setVideoIDs] = useState({
    
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
  });

  useEffect(() => {
    fetch('/api/videoIDs')
      .then(response => response.json())
      .then(data => setVideoIDs(data))
  })



  return (
    <>
      <Header />
      <p>{ videoIDs.lofiVideoIds[0] }</p>
      <Router>
        
        <Switch>
          <Route />
        </Switch>
      
      </Router>
    </>
  );
}


