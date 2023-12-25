import * as Tone from 'tone';
import classNames from 'classnames';
import { List } from 'immutable';
// import React from 'react';

import { Instrument } from '../Instruments';
import React from 'react';
import P5 from 'p5';
import tromboneImage from '../img/trombone.png';

interface TromboneProps {
  note?: Tone.Unit.Frequency;
  duration?: string;
  synth: Tone.Synth;
}

type position = 7 | 6 | 5 | 4 | 3 | 2 | 1;
type partial = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const notes = List<{slide: [position, partial], name: Tone.Unit.Frequency}>([
  // { slide: [[2, 1], [6, 3], [2, 5], [4, 6]], name: 'A' }, // A2, A3, A4
  // { slide: [[3, 1], [7, 3], [3, 5], [5, 6]], name: 'Ab'}, // Ab2, Ab3, Ab4
  // { slide: [[4, 1], [4, 5], [6, 6]], name: 'G' }, // G2, G3, G4
  // { slide: [[5, 1], [5, 5], [7, 6]], name: 'Gb'}, // Gb2, Gb3, Gb4
  // { slide: [[6, 1], [1, 2], [1, 4], [6, 5]], name: 'F' }, // F2, F3, F4, F5
  // { slide: [[7, 1], [2, 2], [2, 4], [7, 5]], name: 'E' }, //E2, E3, E4, E5
  // { slide: [[3, 2], [3, 4]], name: 'Eb'}, // Eb3, Eb4, Eb5
  // { slide: [[4, 2], [1, 3], [4, 4]], name: 'D' }, // D3, D4, D5
  // { slide: [[5, 2], [2, 3], [5, 4]], name: 'Db'}, // Db3, Db4, Db5
  // { slide: [[6, 2], [3, 3], [6, 4], [1, 6]], name: 'C' }, // C3, C4
  // { slide: [[7, 2], [4, 3], [7, 4], [2, 6]], name: 'B' }, // B2, B3, B4
  // { slide: [[1, 1], [5, 3], [1, 5], [3, 6]], name: 'Bb'}, // Bb2, Bb3, Bb4
  {slide: [7, 1], name: 'E2'},
  {slide: [6, 1], name: 'F2'},
  {slide: [5,1], name: 'Gb2'},
  {slide: [4,1], name: 'G2'},
  {slide: [3,1], name: 'Ab2'},
  {slide: [2,1], name: 'A2'},
  {slide: [1,1], name: 'Bb2'},
  {slide: [7,2], name: 'B2'},
  {slide: [6,2], name: 'C3'},
  {slide: [5,2], name: 'Db3'},
  {slide: [4,2], name: 'D3'},
  {slide: [3,2], name: 'Eb3'},
  {slide: [2,2], name: 'E3'},
  {slide: [1,2], name: 'F3'},
  {slide: [7,3], name: 'E3'},
  {slide: [6,3], name: 'F3'},
  {slide: [5,3], name: 'Gb3'},
  {slide: [4,3], name: 'G3'},
  {slide: [3,3], name: 'Ab3'},
  {slide: [2,3], name: 'A3'},
  {slide: [1,3], name: 'Bb3'},
  {slide: [7,4], name: 'Ab3'},
  {slide: [6,4], name: 'A3'},
  {slide: [5,4], name: 'Bb3'},
  {slide: [4,4], name: 'B3'},
  {slide: [3,4], name: 'C4'},
  {slide: [2,4], name: 'Db4'},
  {slide: [1,4], name: 'D4'},
  {slide: [7,5], name: 'B3'},
  {slide: [6,5], name: 'C4'},
  {slide: [5,5], name: 'Db4'},
  {slide: [4,5], name: 'D4'},
  {slide: [3,5], name: 'Eb4'},
  {slide: [2,5], name: 'E4'},
  {slide: [1,5], name: 'F4'},
  {slide: [7,6], name: 'D4'},
  {slide: [6,6], name: 'Eb4'},
  {slide: [5,6], name: 'E4'},
  {slide: [4,6], name: 'F4'},
  {slide: [3,6], name: 'Gb4'},
  {slide: [2,6], name: 'G4'},
  {slide: [1,6], name: 'Bb4'},
  {slide: [7,7], name: 'Ab4'},
  {slide: [6,7], name: 'A4'},
  {slide: [5,7], name: 'Bb4'},
  {slide: [4,7], name: 'B4'},
  {slide: [3,7], name: 'C5'},
  {slide: [2,7], name: 'Db5'},
  {slide: [1,7], name: 'D5'},
]);

function posToNote(slide_position: position, partial: partial): Tone.Unit.Frequency
{
  for (const note of notes)
  {
    if (note.slide[0] === slide_position && note.slide[1] === partial)
      return `${note.name}`;
  }
  return "";
}

function toPosition(n: number): position
{
  n = Math.round(n)
  switch(n)
  {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      return n;
    default:
      return 1;
  }
}

function toPartial(n: number): partial
{
  n = Math.round(n)
  switch(n)
  {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      return n;
    default:
      return 1;
  }
}

function mymap(n: number, start1: number, stop1: number, start2: number, stop2: number)
{
  return (((n - start1)/(stop1-start1)) * (stop2-start2) + start2);
};

function Trombone (): JSX.Element {
  let tromboneSynth = new Tone.Synth();
  tromboneSynth.set({
    portamento: 0.01,
    oscillator: {
      type: "sawtooth"
    },
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.6,
      release: 0.5
    }
  });
  tromboneSynth.toDestination();
//     "filter": {
//         "Q": 2,
//         "type": "lowpass",
//         "rolloff": -24
//     },
//     "filterEnvelope": {
//         "attack": 0.05,
//         "decay": 0.8,
//         "sustain": 0.4,
//         "release": 1.5,
//         "baseFrequency": 2000,
//         "octaves": 1.5
//     }
// };

  function getNote(mouseX: number, mouseY: number): Tone.Unit.Frequency
  {
    const playArea = document.getElementById('trombone-parent-div');
    if (playArea === null)
    {
      return 'C4';
    }
    return posToNote(toPosition(mymap(mouseX, window.innerWidth - playArea.clientWidth, window.innerWidth, 1, 7)),
          toPartial(mymap(mouseY, window.innerHeight, 0, 1, 7)));
  }

  const handleRotateImage = (e: React.MouseEvent): number => {
    let img = document.getElementById("trombone-image");
    if (img === null)
    {
      return 0;
    }
    let imgX = img.offsetLeft + img.offsetWidth / 2;
    let imgY = img.offsetTop + img.offsetHeight / 2;
    let dX = imgX - e.clientX;
    let dY = imgY - e.clientY;

    let degree = Math.atan(-dX/dY) * 180 / Math.PI;
    if (dY > 0)
    {
      degree += 180;
    }

    img.style.transform = "rotate("+degree+")";
    return degree;
  }

  return (
    <div className='pv4' id='trombone-parent-div'
      onMouseMove={(e) => handleRotateImage(e)}
      onMouseDown = {(e) => tromboneSynth.triggerAttack(getNote(e.clientX, e.clientY))}
      // onMouseDown={(e) => console.log("note: " + JSON.stringify(getNote(e.clientX, e.clientY)) + e.clientX, e.clientY)}
      onMouseUp = {() => tromboneSynth.triggerRelease('+0.15')}>
      <div className='relative dib h4 w-100 ml4' id='trombone'>
        <img draggable='false' id='trombone-image' src={tromboneImage} style={{transform: 'rotate(340deg)'}}/>
      </div>
    </div>
  );
}

export const TromboneInstrument = new Instrument('Trombone - faiyazc', Trombone);