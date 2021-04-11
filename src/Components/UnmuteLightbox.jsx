import React, { useState } from 'react';
import './UnmuteLightbox.css';

export default function UnmuteLightbox(props) {


    function handleClick(event) {
        event.preventDefault();
        props.removeLightbox();
    }

    return (
        <div id='unmute-lightbox-container' onClick={handleClick}>
            <div id={props.windowWidth > 550 ? 'unmute-icon-text' : 'unmute-icon-text-mobile'}>
                <img id='unmute-icon' src="/muteicon.png" alt="mute-icon" />
                <label id='unmute-text'>{props.windowWidth > 550 ? 'Click to Unmute' : 'Tap to Unmute'}</label>
            </div>
        </div>
    )
}

