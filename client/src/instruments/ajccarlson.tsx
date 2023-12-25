// 3rd party library imports
import * as Tone from 'tone';
import React, { useEffect } from 'react';

// project imports
import { Instrument, InstrumentProps } from '../Instruments';

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for Tongue Drum.
 ** ------------------------------------------------------------------------ */

interface TongueDrumKeyProps {
  note: string; // G, A, B, C, D, E, F, G, A, B, C, D, E
  duration?: string;
  synth?: Tone.Synth; // Contains library code for making sound
  octave: number;
  index: number; // octave + index together give a location for the tongue drum key
}

export function TongueDrumKey({
  note,
  synth,
  index,
}: TongueDrumKeyProps): JSX.Element {
  return (
    <div
      onMouseDown={() => synth?.triggerAttack(`${note}`)}
      onMouseUp={() => synth?.triggerRelease('+0.25')}
      className={'pointer bg-trans'}
      style={{
        // CSS
        width: '3rem',
        height: '3rem',
      }}
    ></div>
  );
}

function TongueDrum({ synth, setSynth }: InstrumentProps): JSX.Element {
  useEffect(() => {
    setSynth(synth => {
      synth.disconnect();

      const freeVerb = new Tone.Freeverb({
        roomSize: 0.6,
        dampening: 1600,
        wet: 0.8
      }).toDestination();
      let volume = new Tone.Volume(-20).toDestination();

      return new Tone.Synth({
        oscillator: { type: 'sine' } as Tone.OmniOscillatorOptions,
      }).toDestination().chain(freeVerb, volume);
    });
  }, []);

  const keys = Array<TongueDrumKeyProps>();

  for (let i = 1; i <= 49; i++) {
    let tempOctave = -10;

    if (i == 4 || i == 11 || i == 27 || i == 28) {  // Set grid presses for note 'A'
      tempOctave = 3;
      if (i == 4 || i == 11)
        tempOctave = 2;
      keys.push({ note: 'A', octave: tempOctave, index: i });
    }

    else if (i == 29 || i == 30 || i == 39 || i == 46) {  // Set grid presses for note 'B'
      tempOctave = 2;
      if (i == 29 || i == 30)
        tempOctave = 3; 
      keys.push({ note: 'B', octave: tempOctave, index: i });
    }

    else if (i == 12 || i == 13 || i == 37 || i == 38) {  // Set grid presses for note 'D'
      tempOctave = 4;
      if (i == 12 || i == 13)
        tempOctave = 3;
      keys.push({ note: 'D', octave: tempOctave, index: i });
    }

    else if (i == 15 || i == 16 || i == 40 || i == 41) {  // Set grid presses for note 'E'
      tempOctave = 4;
      if (i == 15 || i == 16)
        tempOctave = 3;
      keys.push({ note: 'E', octave: tempOctave, index: i });
    }

    else if (i == 20 || i == 21)  // Set grid presses for note 'F'
      keys.push({ note: 'F', octave: 3, index: i });

    else if (i == 17 || i == 18 || i == 19 || i == 22 || i == 23 || i == 24 || i == 25 || i == 26) {  // Set grid presses for note 'G'
      tempOctave = 3;
      if (i == 17 || i == 18 || i == 19 || i == 24 || i == 25 || i == 26)
        tempOctave = 2;
      keys.push({ note: 'G', octave: tempOctave, index: i });
    }

    else {  // Set grid presses for note 'C' and non-notes
      if (i == 9 || i == 10 || i == 34 || i == 35) {
        tempOctave = 4;
        if (i == 9 || i == 10)
          tempOctave = 3;
        keys.push({ note: 'C', octave: tempOctave, index: i });
      }
      
      else  // Set grid presses for non-notes
        keys.push({ note: 'C', octave: tempOctave, index: i });
    }
  }

  return (
    <div className="pv4 flex items-center">
      <div className='relative center'>
        <img src="https://i5.walmartimages.com/asr/169599ba-b45b-4fd0-8e99-9cb3c1f7569d.9727bf6251fcb52df1be8459881673a4.jpeg" className="drum-img"/>

        <div className="drum-grid">
          {keys.map(key => {
              const note = `${key.note}${key.octave}`;
              return (
                <TongueDrumKey
                  key={note} //react key
                  note={note}
                  synth={synth}
                  octave={key.octave}
                  index={key.index}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

export const TongueDrumInstrument = new Instrument('Tongue Drum', TongueDrum);
