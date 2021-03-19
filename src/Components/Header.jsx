import React, { useState } from 'react';
import './Header.css';


export default function Header(props) {


    
    return (
        <div id="header-container">
            <h1>TikTok-Tunes</h1>
            <nav>
                <ul>
                    <li onClick={() => props.setPlaylist('lofi')}>Lofi</li>
                    <li onClick={() => props.setPlaylist('popular')}>Popular</li>
                    <li onClick={() => props.setPlaylist('indie')}>Indie</li>
                    <li onClick={() => props.setPlaylist('rBJams')}>R & B</li>
                    <li onClick={() => props.setPlaylist('hipHop')}>HipHop</li>
                    <li onClick={() => props.setPlaylist('challenge')}>Challenge</li>
                </ul>
            </nav>
        </div>
    )
}

