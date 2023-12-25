// 3rd party library imports
import P5 from 'p5';
import * as Tone from 'tone';

// project imports
import { Visualizer } from '../Visualizers';


export const StevenVisualizer = new Visualizer(
  'Steven\'s', //The name of the visualizer displayed on the side panel
  (p5: P5, analyzer: Tone.Analyser) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dim = Math.min(width, height);

    p5.background(0, 0, 0, 255);

    p5.strokeWeight(dim * 0.01);
    p5.stroke(255, 36, 255, 255);
    p5.noFill();


    const values = analyzer.getValue();

    //My testing shapes
    p5.strokeJoin("miter")
    for (let i = 0; i < values.length; i++) {
      const amplitude = values[i] as number;
      const y = height / 2 + amplitude * height;

      // The little circles
      p5.circle(75, 100, y/12)
      p5.circle(225, 100, y/12)
      p5.circle(375, 100, y/12)
      p5.circle(525, 100, y/12)
      p5.circle(675, 100, y/12)
      p5.circle(825, 100, y/12)
      p5.circle(975, 100, y/12)
      p5.circle(1125, 100, y/12)
      p5.circle(1275, 100, y/12)
      p5.circle(1425, 100, y/12)

      // Small triangle 1
      p5.beginShape();
      p5.vertex(i/2 + 75, y-200);
      p5.vertex(150, 512-y);
      p5.endShape();
    
      // Big triangle 1
      p5.beginShape();
      p5.vertex(i/2 + 225, y-25);
      p5.vertex(300, 512-y);
      p5.endShape();

      // Small triangle 2
      p5.beginShape();
      p5.vertex(i/2 + 375, y-200);
      p5.vertex(450, 512-y);
      p5.endShape();

      // Big triangle 2
      p5.beginShape();
      p5.vertex(i/2 + 525, y-25);
      p5.vertex(600, 512-y);
      p5.endShape();

      // Small triangle 3
      p5.beginShape();
      p5.vertex(i/2 + 675, y-200);
      p5.vertex(750, 512-y);
      p5.endShape();

      // Big triangle 3
      p5.beginShape();
      p5.vertex(i/2 + 825, y-25);
      p5.vertex(900, 512-y);
      p5.endShape();

      // Small triangle 4
      p5.beginShape();
      p5.vertex(i/2 + 975, y-200);
      p5.vertex(1050, 512-y);
      p5.endShape();

      // Big triangle 4
      p5.beginShape();
      p5.vertex(i/2 + 1125, y-25);
      p5.vertex(1200, 512-y);
      p5.endShape();

      // Small triangle 5
      p5.beginShape();
      p5.vertex(i/2 + 1275, y-200);
      p5.vertex(1350, 512-y);
      p5.endShape();
    }
  },
  'waveform',
  256
);
