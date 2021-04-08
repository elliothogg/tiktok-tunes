import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

export default function ContinuousSlider(props) {
  const classes = useStyles();


  const handleChange = (event, newValue) => {
    props.changeVolume(newValue);
  };

  return (
    <div className={classes.root} id='volume-slider'>
      <Grid container spacing={2}>
        <Grid item>
          {props.volume === 0 ? <VolumeOffIcon className="control-icons mute-button" onClick={props.toggleMute}/> : <VolumeUpIcon className="control-icons mute-button" onClick={props.toggleMute}/>}
        </Grid>
        <Grid item xs>
          <Slider value={props.volume * 100} onChange={handleChange} aria-labelledby="continuous-slider" />
        </Grid>
      </Grid>
    </div>
  );
}