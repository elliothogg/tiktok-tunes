import React, { useState } from 'react';
import './PlaylistItem.css';

export default function PlaylistItem(props) {

    return (
        <div id="playlist-item-container">
            <li>&#9658; {props.artist} - {props.title}</li>
        </div>
    )
}
