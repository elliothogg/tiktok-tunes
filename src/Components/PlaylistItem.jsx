import React, { useState } from 'react';
import './PlaylistItem.css';

export default function PlaylistItem(props) {

    function checkIfSelected() {
        if (props.videoId === props.selectedVideoId) return "selected";
        else return;
    }

    return (
        <div className="playlist-item-container">
            <li className={checkIfSelected()} onClick={() => props.setVideo(props.videoId) }>&#9658; {props.artist} - {props.title}</li>
        </div>
    )
}
