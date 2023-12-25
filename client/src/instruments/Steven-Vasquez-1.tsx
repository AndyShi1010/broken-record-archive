// 3rd party library imports
import * as Tone from 'tone';
import classNames from 'classnames';
import { List, Range } from 'immutable';
import React from 'react';

// project imports
import { Instrument, InstrumentProps } from '../Instruments2';
import { url } from 'inspector';
//import { NoiseSynth } from 'tone';

import snareImg from '../img/snare.jpg';
import kickImg from '../img/kick.jpg';
import hiHatImg from '../img/hihat.jpg';

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for Piano.
 ** ------------------------------------------------------------------------ */

interface PianoKeyProps {
  note: string; // C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B
  duration?: string;
  synth?: Tone.Synth | Tone.MembraneSynth | Tone.NoiseSynth | Tone.MetalSynth; // Contains library code for making sound
  kick?: boolean; // True if minor key, false if major key
  snare?: boolean;
  hiHat?: boolean;
  octave: number;
  index: number; // octave + index together give a location for the piano key
}

export function PianoKey({
  note,
  synth,
  kick,
  snare,
  hiHat,
  index,
}: PianoKeyProps): JSX.Element {
  /**
   * This React component corresponds to either a major or minor key in the piano.
   * See `PianoKeyWithoutJSX` for the React component without JSX.
   */
  return (
    // Observations:
    // 1. The JSX refers to the HTML-looking syntax within TypeScript.
    // 2. The JSX will be **transpiled** into the corresponding `React.createElement` library call.
    // 3. The curly braces `{` and `}` should remind you of string interpolation.

    <div
      onMouseDown={() => Tone.NoiseSynth ? synth?.triggerAttack("8n") : synth?.triggerAttack(`${note}`)} // Question: what is `onMouseDown`?
      onMouseUp={() => Tone.NoiseSynth ? synth?.triggerRelease('+.05') : synth?.triggerRelease('+0.25')} // Question: what is `onMouseUp`?
      className={classNames('ba pointer absolute dim', {
        // 'bg-black black h3': minor, // minor keys are black
        'h4' : kick, // kicks are black
        'black bg-white h4': snare, // snares are white
        'bg-black black h4': hiHat, // hiHats are ?
      })}
      style={{
        // CSS
        top: 0,
        left: `${index * 2}rem`,
        zIndex: 1, // the minor ? logic can be applied to different types of drums. 
        //width: kick ? '8rem' : snare ? '8rem' : hiHat ? '8rem' : '2rem', // change 2rem to 8rem for full circles
        width: '16rem',
        marginLeft: '0.25rem',
        height: '16rem'
      }}
    >
      <img src={(kick ? kickImg : snare ? snareImg : hiHat ? hiHatImg : "")} width="100%" height="100%" />
    </div>
  );
}

// eslint-disable-next-line
function PianoKeyWithoutJSX({
  note,
  synth,
  kick,
  snare,
  hiHat,
  index,
}: PianoKeyProps): JSX.Element {
  /**
   * This React component for pedagogical purposes.
   * See `PianoKey` for the React component with JSX (JavaScript XML).
   */
  return React.createElement(
    'div',
    {
      onMouseDown: () => synth?.triggerAttack(`${note}`),
      onMouseUp: () => synth?.triggerRelease('+0.25'),
      className: classNames('ba pointer absolute dim', {
        'bg-black black h3': kick,
        'black bg-white h4': snare,
        'bg-black blue h4': hiHat,
      }),
      style: {
        top: 0,
        left: `${index * 2}rem`,
        zIndex: 1,
        width: kick ? '5rem' : snare ? '4rem' : hiHat ? '3rem' : '2rem',
        marginLeft: '0.25rem',
        borderRadius: '50%', //To make the border circular
      },
    },
    [],
  );
}

function Piano({ synth, setSynth, membSynth, setMembSynth, noiseSynth, setNoiseSynth, metalSynth, setMetalSynth }: InstrumentProps): JSX.Element {
  /*
  const keys = List([
    { note: 'C', idx: 0, drumType: 1 },
    { note: 'Db', idx: 0.5, drumType: 1 },
    { note: 'D', idx: 1, drumType: 1 },
    { note: 'Eb', idx: 1.5, drumType: 1 },
  ]);
  */

  const membKeys = List([ //kick
    { note: 'C0', idx: 2, drumType: 1 },
  ]);

  const noiseKeys = List([ //snare
    { note: '8n', idx: 10, drumType: 2 },
  ]);

  const metalKeys = List([ //hihat
    { note: '32n', idx: 18, drumType: 3 },
  ]);

  const setOscillator = (newType: Tone.ToneOscillatorType) => {
    setSynth(oldSynth => {
      oldSynth.disconnect();

      return new Tone.Synth({
        oscillator: { type: newType } as Tone.OmniOscillatorOptions,
      }).toDestination();
    });
  };

  const setMembOscillator = (newType: Tone.ToneOscillatorType) => {
    setMembSynth(oldSynth => {
      oldSynth.disconnect();
      
      return new Tone.MembraneSynth({
        oscillator: { type: newType } as Tone.OmniOscillatorOptions,
      }).toDestination();
    })
  }

  const oscillators: List<OscillatorType> = List([
    'sine',
    'sawtooth',
    'square',
    'triangle',
    'fmsine',
    'fmsawtooth',
    'fmtriangle',
    'amsine',
    'amsawtooth',
    'amtriangle',
  ]) as List<OscillatorType>;

  
  return (
    <div className="pv4">
      <div className="relative dib h4 w-100 ml4">
        
        

        
        {Range(2, 3).map(octave =>
          membKeys.map(membKeys => {
            const isMinor = membKeys.note.indexOf('b') !== -1;
            const isKick = membKeys.drumType == 1;
            const isSnare = membKeys.drumType == 2;
            const isHiHat = membKeys.drumType == 3;
            const note = `${membKeys.note}${octave}`;
            
            

            return (
              <PianoKey
                key={note} //react key
                note={note}
                synth={membSynth}
                //minor={isMinor}
                kick={isKick}
                snare={isSnare}
                hiHat={isHiHat}
                octave={octave}
                index={(octave - 2) * 7 + membKeys.idx}
              />
            );
          }),
        )}

        {Range(2, 3).map(octave =>
          noiseKeys.map(key => {
            const isMinor = key.note.indexOf('b') !== -1;
            const isKick = key.drumType == 1;
            const isSnare = key.drumType == 2;
            const isHiHat = key.drumType == 3;
            const note = `${key.note}`;
            
            

            return (
              <PianoKey
                key={note} //react key
                note={note}
                synth={noiseSynth}
                //minor={isMinor}
                kick={isKick}
                snare={isSnare}
                hiHat={isHiHat}
                octave={octave}
                index={(octave - 2) * 7 + key.idx}
              />
            );
          }),
        )}

        {Range(2, 3).map(octave =>
          metalKeys.map(key => {
            const isMinor = key.note.indexOf('b') !== -1;
            const isKick = key.drumType == 1;
            const isSnare = key.drumType == 2;
            const isHiHat = key.drumType == 3;
            const note = `${key.note}${octave}`;
  

            return (
              <PianoKey
                key={note} //react key
                note={note}
                synth={metalSynth}
                //minor={isMinor}
                kick={isKick}
                snare={isSnare}
                hiHat={isHiHat}
                octave={octave}
                index={(octave - 2) * 7 + key.idx}
              />
            );
          }),
        )}
      </div>
      
    </div>
  );
}

export const StevensDrums = new Instrument('Steven\'s Drums', Piano);
