import React, { useState } from 'react';
import './UnmuteLightbox.css';

export default function UnmuteLightbox(props) {
    const [unmuted, setUnmuted] = useState(false);


    function handleClick(event) {
        event.preventDefault();
        props.removeLightbox();
    }

    return (
        <div id='unmute-lightbox-container' onClick={handleClick}>
            <div id='unmute-icon-text'>
                <img id='unmute-icon' src="/muteicon.png" alt="mute-icon" />
                <label id='unmute-text'>Click to Unmute</label>
            </div>
        </div>
    )
}

