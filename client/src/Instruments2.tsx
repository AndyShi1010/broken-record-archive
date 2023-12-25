// This file is to avoid conflicts with Steven's instrument files

// 3rd party library imports
import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

// project imports
import { DispatchAction } from './Reducer';
import { AppState } from './State';

/** ------------------------------------------------------------------------ **
 * Contains base implementation of an Instrument.
 ** ------------------------------------------------------------------------ */

export interface InstrumentProps {
  state: AppState;
  dispatch: React.Dispatch<DispatchAction>;
  name: string;
  synth: Tone.Synth;
  membSynth: Tone.MembraneSynth;
  noiseSynth: Tone.NoiseSynth;
  metalSynth: Tone.MetalSynth;
  setSynth: (f: (oldSynth: Tone.Synth) => Tone.Synth) => void;
  setMembSynth: (f: (oldSynth: Tone.MembraneSynth) => Tone.MembraneSynth) => void;
  setNoiseSynth: (f: (oldSynth: Tone.NoiseSynth) => Tone.NoiseSynth) => void;
  setMetalSynth: (f: (oldSynth: Tone.MetalSynth) => Tone.MetalSynth) => void;
}

export class Instrument {
  public readonly name: string;
  public readonly component: React.FC<InstrumentProps>;

  constructor(name: string, component: React.FC<InstrumentProps>) {
    this.name = name;
    this.component = component;
  }
}

function TopNav({ name }: { name: string }) {
  return (
    <div
      className={
        'w-100 h3 bb b--light-gray flex justify-between items-center ph4'
      }
    >
      <div>{name}</div>
    </div>
  );
}

interface InstrumentContainerProps {
  state: AppState;
  dispatch: React.Dispatch<DispatchAction>;
  instrument: Instrument;
}

export const InstrumentContainer: React.FC<InstrumentContainerProps> = ({
  instrument,
  state,
  dispatch,
}: InstrumentContainerProps) => {
  const InstrumentComponent = instrument.component;
  const [synth, setSynth] = useState(
    new Tone.Synth({
      oscillator: { type: 'sine' } as Tone.OmniOscillatorOptions,
    }).toDestination(),
  );
  //New addition below
  const [membSynth, setMembSynth] = useState(
    new Tone.MembraneSynth({
      oscillator: { type: 'sine' } as Tone.OmniOscillatorOptions,
    }).toDestination(),
  );

  const [noiseSynth, setNoiseSynth] = useState(
    new Tone.NoiseSynth().toDestination(),
  );

  const [metalSynth, setMetalSynth] = useState(
    new Tone.MetalSynth({
      
    }).toDestination(),
  );


  const notes = state.get('notes');

  useEffect(() => {
    if (notes && synth) {
      let eachNote = notes.split(' ');
      let noteObjs = eachNote.map((note: string, idx: number) => ({
        idx,
        time: `+${idx / 4}`,
        note,
        velocity: 1,
      }));

      new Tone.Part((time, value) => {
        // the value is an object which contains both the note and the velocity
        synth.triggerAttackRelease(value.note, '4n', time, value.velocity);
        if (value.idx === eachNote.length - 1) {
          dispatch(new DispatchAction('STOP_SONG'));
        }
      }, noteObjs).start(0);

      Tone.Transport.start();

      return () => {
        Tone.Transport.cancel();
      };
    }

    return () => {};
  }, [notes, synth, dispatch]);
  
  return (
    <div>
      <TopNav name={instrument.name} />
      <div
        className={'bg-white absolute right-0 left-0'}
        style={{ top: '4rem' }}
      >
        <InstrumentComponent
          name={instrument.name}
          state={state}
          dispatch={dispatch}
          synth={synth}
          membSynth={membSynth}
          noiseSynth={noiseSynth}
          metalSynth={metalSynth}
          setSynth={setSynth}
          setMembSynth={setMembSynth}
          setNoiseSynth={setNoiseSynth}
          setMetalSynth={setMetalSynth}
        />
      </div>
    </div>
  );
};
