// 3rd party library imports
import * as Tone from 'tone';
// project imports
import { Visualizer } from '../Visualizers';


export const faiyazc = new Visualizer(
  'rainbowWaves - faiyazc',
  (p5, analyzer: Tone.Analyser) => {
    const width = window.innerWidth;
    const height = window.innerHeight / 2;
    const dim = Math.min(width, height);

    p5.background(0, 0, 0, 255);

    p5.strokeWeight(dim * 0.025);
    p5.stroke(255, 255, 255, 255);
    p5.noFill();

    let values = analyzer.getValue();

    let stop = values[0] as number;
    for (let i = 1; i < values.length; i++) {
      if (values[i] > stop)
        stop = values[i] as number;
    }
    // let duration = analyzer.sampleTime;
    p5.beginShape();
    for (let i = 0; i < values.length; i++)
    {
      let x = p5.map(i, 0, values.length, 0, width);
      let h = -height + p5.map(values[i] as number, 0, 255, height, 0);

      p5.noStroke();
      // p5.stroke((5*p5.frameCount * p5.map(values[i] as number, 0, stop, 0.1, 1)) % 255, 40, 100);
      // p5.fill((5*p5.frameCount) % 360, 100, 100);
      p5.fill((5*p5.map(h, 0, stop, 0, 255)), 100, 100);
      p5.vertex(x, h);
      p5.noStroke();
    }
    p5.endShape();
  },
);
