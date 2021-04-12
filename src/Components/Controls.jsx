import React from 'react';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import ContinousSlider from './volumeSlider';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Controls.css';

export default function Controls(props) {

    return (
        <div className='controls'>
        {props.windowWidth > 550 ? 
            <>  <SkipPreviousIcon className='control-icons' onClick={props.playPreviousVideo}/> 
                {props.videoPlaying === true ? <PauseIcon className='control-icons' onClick={props.togglePlay}/> : <PlayArrowIcon className='control-icons' onClick={props.togglePlay}/>}
                <SkipNextIcon className='control-icons' onClick={props.playNextVideo}/>
                <ContinousSlider changeVolume={props.changeVolume} volume={props.volume} toggleMute={props.toggleMute}/> </> 
                :
                <>{props.showLoadingAni === true? <CircularProgress className='loading-icon'/> : props.videoPlaying === true ? <PauseCircleOutlineIcon className='control-icons mobile-icon' onClick={props.togglePlay}/> : <PlayCircleOutlineIcon className='control-icons mobile-icon' onClick={props.togglePlay}/>}</> }

        </div>
    )
}