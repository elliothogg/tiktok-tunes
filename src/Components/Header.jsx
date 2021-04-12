import React, { useState } from 'react';
import './Header.css';
import { slide as Menu } from 'react-burger-menu';


export default function Header(props) {

    const [isOpen, setIsOpen] = useState(false);

    const lightbox = props.showLightbox === true ? 'not-clickable' : null;
    const clicked = props.showPlaylist ? null : 'menu-open';

    function checkIfSelected(playlist) {
        if (props.chosenPlaylist === playlist) return "selected-menu";
        else return;
    }

    const menuItems = <>
                        <li className={checkIfSelected('lofi')} onClick={() => props.setPlaylist('lofi')}>Lofi</li>
                        <li className={checkIfSelected('popular')} onClick={() => props.setPlaylist('popular')}>Popular</li>
                        <li className={checkIfSelected('indie')} onClick={() => props.setPlaylist('indie')}>Indie</li>
                        <li className={checkIfSelected('rBJams')} onClick={() => props.setPlaylist('rBJams')}>R & B</li>
                        <li className={checkIfSelected('hipHop')} onClick={() => props.setPlaylist('hipHop')}>HipHop</li>
                        <li className={checkIfSelected('challenge')} onClick={() => props.setPlaylist('challenge')}>Challenge</li>
                      </>
    
    return (
        <div id="header-container">
            <h1>TikTok-Tunes</h1>
            {props.windowWidth > 990 ? <nav><ul>{menuItems}</ul></nav> : <Menu burgerButtonClassName={`${lightbox} ${clicked}`} burgerBarClassName={clicked}  isOpen={isOpen} onOpen={props.togglePlaylist} onClose={props.togglePlaylist}>{menuItems}</Menu>}
        </div>
    )
}

