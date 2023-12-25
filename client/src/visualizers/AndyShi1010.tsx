// 3rd party library imports
import P5 from 'p5';
import * as Tone from 'tone';

// project imports
import { Visualizer } from '../Visualizers';

let pointCount = 1024;
let peaks:number[] = [];
let peaksInit = false;

export const SpectrumVisualizer = new Visualizer(
  'Spectrum',
  (p5: P5, analyzer: Tone.Analyser) => {
    let spectrum = analyzer.getValue();
    p5.clear();

    if (p5.frameCount % 120 == 0 || !peaksInit) {
      //console.log("reset");
      peaks = [];
      for (let i = 0; i < spectrum.length; i++) {
        peaks.push(spectrum[i] as number);
      }
      peaksInit = true;
    } else {
      for (let i = 0; i < spectrum.length; i++) {
        if (spectrum[i] > peaks[i]) {
          peaks[i] = spectrum[i] as number;
        }
      }
      //console.log(peaks.length);
    }

    p5.beginShape();
    // setInterval(() => console.log(spectrum), 1000);
    // setGradient(0, 0, width, height, c1, c2);
    //p5.background('gray');
    p5.noFill();
    //p5.noStroke();
    p5.stroke('white');
    p5.strokeWeight(3);
    // p5.curveVertex(01, 0);
    for (let i = 0; i < spectrum.length; i++) {
      // let dataPoint = p5.height;
      // if (spectrum[i] !== Number.NEGATIVE_INFINITY) {
      //   dataPoint = Math.round((spectrum[i] as number) * -1);
      // }
      let dataPoint = spectrum[i] as number * -1;
      //console.log(dataPoint);
      //console.log(p5.map(Math.round(spectrum[i] as number), Number.NEGATIVE_INFINITY, 0, window.innerHeight, 0));
      //p5.vertex(i * (p5.width/64), p5.map(dataPoint, 0, 500, 0, p5.height));
      let pointX = p5.map(Math.log(i), 0, Math.log(spectrum.length), 0, p5.width);
      let pointY = p5.map(dataPoint, 0, 255, 0, p5.height);
      p5.curveVertex(pointX, pointY);
     
    }
    //p5.vertex(p5.width, p5.height);
    p5.endShape();

    p5.beginShape();
    p5.noFill();
    p5.stroke('gray');
    p5.strokeWeight(1);
    for (let i = 0; i < peaks.length; i++) {
      let dataPoint = peaks[i] as number * -1;
      let pointX = p5.map(Math.log(i), 0, Math.log(peaks.length), 0, p5.width);
      let pointY = p5.map(dataPoint, 0, 255, 0, p5.height);
      p5.curveVertex(pointX, pointY);
    }
    p5.endShape();
    // const width = window.innerWidth;
    // const height = window.innerHeight / 2;
    // const dim = Math.min(width, height);

    // p5.background(0, 0, 0, 255);

    // p5.strokeWeight(dim * 0.01);
    // p5.stroke(255, 255, 255, 255);
    // p5.noFill();

    // const values = analyzer.getValue();
    // p5.beginShape();
    // for (let i = 0; i < values.length; i++) {
    //   const amplitude = values[i] as number;
    //   const x = p5.map(i, 0, values.length - 1, 0, width);
    //   const y = height / 2 + amplitude * height;
    //   // Place vertex
    //   p5.vertex(x, y);
    // }
    // p5.endShape();
  },
  'fft',
  pointCount
);
