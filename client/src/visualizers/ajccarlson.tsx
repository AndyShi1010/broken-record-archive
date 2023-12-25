// 3rd party library imports
import P5 from 'p5';
import * as Tone from 'tone';

// project imports
import { Visualizer } from '../Visualizers';

export const digitalRainVisualizer = new Visualizer(
  'Digital Rain',
  (p5: P5, analyzer: Tone.Analyser) => {
    const width = window.innerWidth;
    const height = window.innerHeight / 2;

    p5.background(0, 0, 0, 255);
    p5.noFill();
    p5.colorMode('hsb');

    const values = analyzer.getValue();
    
    for (let i = 0; i < values.length; i++){
      const amplitude = values[i] as number;

      p5.stroke(i * 3, 255, 255);
      let x = p5.map(i, 0, 110, 0, width);
      let h = 1.5 * (-height + p5.map(amplitude, 0, 255, height - 200, 0));
      p5.rect(x, height, width / values.length, h);

      p5.stroke(20);
      p5.rect(x, 0, width / 110, height + h - 50);
    }
  },
  'fft',
  1024
);
