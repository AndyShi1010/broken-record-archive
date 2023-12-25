import * as Tone from 'tone';
import { DispatchAction, appReducer } from './Reducer';
import { useReducer, useEffect } from 'react';
import { defaultState } from './State';

export default function enableMidi(dispatch: React.Dispatch<DispatchAction>) {
    // useEffect(() => {

    // }); 
    //const [state, dispatch] = useReducer(appReducer, defaultState);
    console.log(navigator.userAgent);
    if (navigator.userAgent.indexOf('Chrome') != -1) {
      console.log("Called enableMidi()");
      navigator.requestMIDIAccess().then(onMIDISuccess);
    }
  
    function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
      //console.log("MIDI");
      for (var input of midiAccess.inputs.values())
        input.onmidimessage = parseMidi;
    }

    function parseMidi(msg: WebMidi.MIDIMessageEvent) {
      let hex = msg.data[0].toString(16);
      //console.log(hex);
      if (hex[0] === '9') {
        //console.log('on', msg.data[1]);
        let midiNote = Tone.Frequency(msg.data[1], 'midi').toNote();
        //console.log(midiNote);
        dispatch(new DispatchAction('MIDI_PLAY_NOTE', {midiNote}));
      } 
      else if (hex[0] === '8') {
        //console.log('off', msg.data[1]);
        dispatch(new DispatchAction('MIDI_STOP_NOTE'))
      } else {
        console.log('unrecognized message');
      }
    }
}