import React from 'react';
import './MobileMenu.css';

export default function MobileMenu(props) {

    function checkIfSelected(playlist) {
        if (props.chosenPlaylist === playlist) return "selected-menu";
        else return;
    }

    return (
        <div id='mobile-menu' onClick={() => props.togglePlaylist()}>
            <li className={checkIfSelected('lofi')} onClick={() => props.setPlaylist('lofi')}>&#926;  Lofi</li>
            <li className={checkIfSelected('popular')} onClick={() => props.setPlaylist('popular')}>&#926;  Popular</li>
            <li className={checkIfSelected('indie')} onClick={() => props.setPlaylist('indie')}>&#926;  Indie</li>
            <li className={checkIfSelected('rBJams')} onClick={() => props.setPlaylist('rBJams')}>&#926;  R & B</li>
            <li className={checkIfSelected('hipHop')} onClick={() => props.setPlaylist('hipHop')}>&#926;  HipHop</li>
            <li className={checkIfSelected('challenge')} onClick={() => props.setPlaylist('challenge')}>&#926;  Challenge</li>
        </div>
    )
}