// 3rd party library imports
import React, { useState, useEffect, useContext } from 'react';
import * as Tone from 'tone';

// project imports
import { DispatchAction } from './Reducer';
import { AppState } from './State';
import { Menu24 } from '@carbon/icons-react'
import { NavOpenContext } from './MainPage';

/** ------------------------------------------------------------------------ **
 * Contains base implementation of an Instrument.
 ** ------------------------------------------------------------------------ */

export interface InstrumentProps {
  state: AppState;
  dispatch: React.Dispatch<DispatchAction>;
  name: string;
  synth: Tone.Synth;
  setSynth: (f: (oldSynth: Tone.Synth) => Tone.Synth) => void;
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
  const {isOpen, toggleOpen} = useContext(NavOpenContext);
  return (
    <div
      // className={
      //   'w-100 h3 bb b--light-gray flex justify-between items-center ph4'
      // }
      className={
        'w-100 h3 bb b--light-gray flex items-center ph4'
      }
    >
      <div id="title-hamburger" className={`pa2 hamburger ${isOpen ? 'hidden': 'mr3'}`} onClick={() => {toggleOpen(!isOpen);}}>
        <Menu24 className='db'></Menu24>
      </div>
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
  
  console.log(state);
  const notes = state.get('notes');
  const midiTrigger = state.get('midiTrigger');

  useEffect(() => {
    if (midiTrigger && synth) {
      console.log("Midi Trigger Note", midiTrigger);
      synth.triggerAttack(`${midiTrigger}`);
    } 
    else if (!midiTrigger) {
      synth.triggerRelease('+0.25');
    }

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
  }, [notes, synth, midiTrigger, dispatch]);

  return (
    <div>
      <TopNav name={instrument.name} />
      <div
        className={'bg-white'}
        style={{ top: '4rem' }}
      >
        <InstrumentComponent
          name={instrument.name}
          state={state}
          dispatch={dispatch}
          synth={synth}
          setSynth={setSynth}
        />
      </div>
    </div>
  );
};
