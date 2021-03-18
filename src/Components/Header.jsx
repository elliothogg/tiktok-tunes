import React, { useState } from 'react';
import './Header.css';


export default function Header(props) {


    
    return (
        <div id="header-container">
            <h1>TikTok-Tunes</h1>
            <nav>
                <ul>
                    <li>Lofi</li>
                    <li>Popular</li>
                    <li>Indie</li>
                    <li>R & B</li>
                    <li>HipHop</li>
                    <li>Challenge</li>
                </ul>
            </nav>
        </div>
    )
}

