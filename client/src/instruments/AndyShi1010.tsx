// 3rd party library imports
import * as Tone from 'tone';
import classNames from 'classnames';
import { List, Range } from 'immutable';
import React, { ChangeEvent, useState, useEffect } from 'react';
import { Power24, Checkbox24, CheckboxCheckedFilled24} from '@carbon/icons-react';

// project imports
import { Instrument, InstrumentProps } from '../Instruments';
import '../tripleosc.css';
import { Synth, Oscillator, OmniOscillator, OmniOscSourceType, FatOscillator } from 'tone';
import { Cents, Decibels, NormalRange, Time } from 'tone/build/esm/core/type/Units';

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for Piano.
 ** ------------------------------------------------------------------------ */
//enableMidi();

interface PianoKeyProps {
  note: string; // C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B
  duration?: string;
  synth?: Tone.Synth; // Contains library code for making sound
  minor?: boolean; // True if minor key, false if major key
  octave: number;
  index: number; // octave + index together give a location for the piano key
}

interface OSCProps {
  oscType: OscillatorType;
  // oscVol: Tone.Param<"decibels">;
  voices: number;
  detune: Cents;
}

interface ReverbProps {
  decay: Time;
  preDelay: Time;
  wet: NormalRange;
}


// let oscConfig: OSCProps = {
//   oscType: 'sine',
//   // oscVol: 0 as any,
//   oscVoices: 6,
//   oscDetune: 10
// }

// let reverbConfig: ReverbProps = {
//   decay: 2,
//   preDelay: 0.5,
//   wet: 1,
// }

export function PianoKey({
  note,
  synth,
  minor,
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
      onMouseDown={() => synth?.triggerAttack(`${note}`)} // Question: what is `onMouseDown`?
      onMouseUp={() => synth?.triggerRelease('+0.25')} // Question: what is `onMouseUp`?
      // className={classNames('tripleosckey ba pointer relative fl dib', {
      className={classNames('tripleosckey ba pointer relative fl dib', {
        // 'bg-black black h3': minor, // minor keys are black
        'bg-black white h3': minor, // minor keys are black
        'black bg-white h4': !minor, // major keys are white
      })}
      style={{
        // CSS
        // top: 0,
        // left: `${index * 2}rem`,
        zIndex: minor ? 1 : 0,
        width: minor ? '2rem' : '2.5rem',
        minWidth: minor ? '2rem' : '2.5rem',
        // marginLeft: minor ? '-1rem' : 0,
      }}
    ></div>
  );
}

// eslint-disable-next-line
function PianoKeyWithoutJSX({
  note,
  synth,
  minor,
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
        'bg-black black h3': minor,
        'black bg-white h4': !minor,
      }),
      style: {
        top: 0,
        left: `${index * 2}rem`,
        zIndex: minor ? 1 : 0,
        width: minor ? '1.5rem' : '2rem',
        marginLeft: minor ? '0.25rem' : 0,
      },
    },
    [],
  );
}

function OSCType({ title, onClick, active }: any): JSX.Element {
  return (
    <div
      onClick={onClick}
      className={classNames('dim pointer ph2 pv1 ba mr2 br1 fw7 bw1 h-auto', {
        'b--black black': active,
        'gray b--light-gray': !active,
      })}
    >
      {title}
    </div>
  );
}

function OSCSynth({ synth, setSynth }: InstrumentProps): JSX.Element {

  const keys = List([
    { note: 'C', idx: 0 },
    { note: 'Db', idx: 0.5 },
    { note: 'D', idx: 1 },
    { note: 'Eb', idx: 1.5 },
    { note: 'E', idx: 2 },
    { note: 'F', idx: 3 },
    { note: 'Gb', idx: 3.5 },
    { note: 'G', idx: 4 },
    { note: 'Ab', idx: 4.5 },
    { note: 'A', idx: 5 },
    { note: 'Bb', idx: 5.5 },
    { note: 'B', idx: 6 },
  ]);

  const [oscConfig, setOscConfig] = useState({
    oscType: 'sine',
    // oscVol: 0 as any,
    voices: 8,
    detune: 20
  });

  const [reverbConfig, setReverbConfig] = useState({
    on: false,
    decay: 5,
    preDelay: 0.3,
    wet: 1
  });

  const [delayConfig, setDelayConfig] = useState({
    on: false,
    time: 0.5,
    feedback: 0.2,
    pingpong: false,
  });

  useEffect(() => {
    setSynth(oldSynth => {
      oldSynth.disconnect();

      let reverb = new Tone.Reverb().toDestination();
      reverb.set({
        decay: reverbConfig.decay,
        preDelay: reverbConfig.preDelay,
        wet: reverbConfig.wet,
      });

      let delay;
      if (delayConfig.pingpong) {
        delay = new Tone.PingPongDelay().toDestination();
      } else {
        delay = new Tone.FeedbackDelay().toDestination();
      }

      delay.set({
        delayTime: delayConfig.time,
        feedback: delayConfig.feedback
      });

      let newSynth: Synth = new Tone.Synth({
        oscillator: {
          type: `fat${oscConfig.oscType}`,
          count: oscConfig.voices,
          spread: oscConfig.detune,
        } as Tone.OmniOscillatorOptions,
      }).toDestination();

      if (reverbConfig.on) {
        newSynth.connect(reverb);
      }

      if (delayConfig.on) {
        newSynth.connect(delay);
      }

      return newSynth;
    });
  }, [oscConfig, reverbConfig, delayConfig]);

  const oscillators: List<OscillatorType> = List([
    'sine',
    'sawtooth',
    'square',
    'triangle',
  ]) as List<OscillatorType>;

  return (
    <div className="pv4">
      <div className="relative ml4 mr4 overflow-x-auto nowrap flex">
        {Range(2, 6).map(octave =>
          keys.map(key => {
            const isMinor = key.note.indexOf('b') !== -1;
            const note = `${key.note}${octave}`;
            return (
              <PianoKey
                key={note} //react key
                note={note}
                synth={synth}
                minor={isMinor}
                octave={octave}
                index={(octave - 2) * 7 + key.idx}
              />
            );
          }),
        )}
      </div>

      <div className={'pl4 pt4 flex flex-column'}>
        <p className='ma0 mr4 mb3 b'>Oscillator</p>
        <div className='flex flex-row items-center mv2'>
          {oscillators.map(o => (
            <OSCType
              key={o}
              title={o}
              onClick={() => {
                setOscConfig({
                  oscType: o,
                  voices: oscConfig.voices,
                  detune: oscConfig.detune,
                });
              }
              }
              active={synth?.oscillator.baseType === o}
            />
          ))}

          <div className='ml4'>
            <SliderControl
              title="Voices"
              min={1}
              max={10}
              step={1}
              value={oscConfig.voices}
              display={oscConfig.voices}
              horizontal={true}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setOscConfig({
                  oscType: oscConfig.oscType,
                  voices: parseInt(e.currentTarget.value),
                  detune: oscConfig.detune,
                });
              }}
            />
          </div>
          <div className='ml4'>
            <SliderControl
              title="Detune"
              min={0}
              max={100}
              step={1}
              value={oscConfig.detune}
              display={oscConfig.detune}
              horizontal={true}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setOscConfig({
                  oscType: oscConfig.oscType,
                  voices: oscConfig.voices,
                  detune: parseInt(e.currentTarget.value),
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className='pl4 pt4 flex flex-column'>
        <p className='ma0 mr4 b'>Effects</p>

        <div className='mt3 flex flex-column'>
          <div className='flex flex-row items-center mv2'>
            <OnOffControl title="Reverb" onChange={() => {
              setReverbConfig({
                on: !reverbConfig.on,
                decay: reverbConfig.decay,
                preDelay: reverbConfig.preDelay,
                wet: reverbConfig.wet,
              })
            }
            } value={reverbConfig.on} />
          </div>

          <div className='flex flex-row items-center mv2'>
            <div>
              <SliderControl
                title="Predelay"
                min={0}
                max={1}
                step={0.1}
                value={reverbConfig.preDelay}
                display={reverbConfig.preDelay}
                horizontal={true}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setReverbConfig({
                    on: reverbConfig.on,
                    decay: reverbConfig.decay,
                    preDelay: parseFloat(e.currentTarget.value),
                    wet: reverbConfig.wet,
                  })
                }}
              />
            </div>
            <div className='ml4'>
              <SliderControl
                title="Decay"
                min={0.1}
                max={10}
                step={0.1}
                value={reverbConfig.decay}
                display={reverbConfig.decay}
                horizontal={true}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setReverbConfig({
                    on: reverbConfig.on,
                    decay: parseFloat(e.currentTarget.value),
                    preDelay: reverbConfig.preDelay,
                    wet: reverbConfig.wet,
                  })
                }}
              />
            </div>
            <div className='ml4'>
              <SliderControl
                title="Wet"
                min={0}
                max={1}
                step={0.01}
                value={reverbConfig.wet}
                display={reverbConfig.wet}
                horizontal={true}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setReverbConfig({
                    on: reverbConfig.on,
                    decay: reverbConfig.decay,
                    preDelay: reverbConfig.preDelay,
                    wet: parseFloat(e.currentTarget.value),
                  })
                }}
              />
            </div>
          </div>
        </div>

        <div className='mt3 flex flex-column'>
          <div className='flex flex-row items-center mv2'>
            <OnOffControl title="Delay" onChange={() => {
              setDelayConfig({
                on: !delayConfig.on,
                time: delayConfig.time,
                feedback: delayConfig.feedback,
                pingpong: delayConfig.pingpong
              });
            }
            } value={delayConfig.on} />
          </div>

          <div className='flex flex-row items-center mv2'>
            <div>
              <SliderControl
                title="Time"
                min={0}
                max={1}
                step={0.01}
                value={delayConfig.time}
                display={delayConfig.time}
                horizontal={true}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setDelayConfig({
                    on: delayConfig.on,
                    time: parseFloat(e.currentTarget.value),
                    feedback: delayConfig.feedback,
                    pingpong: delayConfig.pingpong
                  });
                }}
              />
            </div>
            <div className='ml4'>
              <SliderControl
                title="Feedback"
                min={0}
                max={1}
                step={0.01}
                value={delayConfig.feedback}
                display={delayConfig.feedback}
                horizontal={true}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setDelayConfig({
                    on: delayConfig.on,
                    time: delayConfig.time,
                    feedback: parseFloat(e.currentTarget.value),
                    pingpong: delayConfig.pingpong
                  });
                }}
              />
            </div>
            <div className='ml4'>
              <SwitchControl
                title="Ping-pong"
                value={delayConfig.pingpong}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setDelayConfig({
                    on: delayConfig.on,
                    time: delayConfig.time,
                    feedback: delayConfig.feedback,
                    pingpong: e.currentTarget.checked
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


type sliderProps = {
  title: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: number;
  horizontal?: boolean;
  onChange: any;
}

function SliderControl({ title, min, max, step, value, display, horizontal, onChange }: sliderProps): JSX.Element {

  return (
    <div>
      {horizontal
        ?
        <div className={'flex flex-row items-center'}>
          <label className="mr3">{title}</label>
          <input type="range" className="slider" min={min} max={max} step={step} onChange={onChange} value={value}></input>
          <p className="ma0 ml3">{display}</p>
        </div>
        :
        <div className={'flex flex-column'}>
          <label className="">{title}</label>
          <input type="range" className="slider" min={min} max={max} onChange={onChange} value={value}></input>
          <p>{display}</p>
        </div>
      }
    </div>

  );
}

function SwitchControl({ title, onChange, value }: any): JSX.Element {
  return (

    <label className="mr4 switch flex flex-row items-center">
      <input className='hiddenCheck' type="checkbox" onChange={onChange} />
      {value ?
          <CheckboxCheckedFilled24 />
          :
          <Checkbox24 className='light-silver'/>
      }
      <p className='ma0 ml2'>{title}</p>
    </label>

  );
}

function OnOffControl({title, onChange, value }: any): JSX.Element {
  return (

    // <label className="ba bw1 b--black relative flex w-auto">
    <label className="relative flex flex-row items-center">
      <input className='hiddenCheck' type="checkbox" onChange={onChange} />
      <Power24 className={`pointer ${value ? "black" : "light-silver"}`} />
      <p className='ma0 ml2'>{title}</p>
    </label>

  );
}

export const OSCSynthInstrument = new Instrument('OSCSynth', OSCSynth);
