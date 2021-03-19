import React, { useState } from 'react';
import './Playlist.css';
import PlaylistItem from './PlaylistItem';

export default function Playlist(props) {



    return (
        <div id="playlist-container">
            {props.playlist.map(item=> 
                <PlaylistItem setVideo={props.setVideo} key={item.videoId} artist={item.artist.replace('-', ' ')} title={item.title.replace('-', ' ')} videoId={item.videoId} selectedVideoId={props.selectedVideoId}/>
            )}
            
        </div>
    )
}
