// 3rd party library imports
import * as Tone from 'tone';
import Sketch from 'react-p5';
import P5 from 'p5';
import React, { useEffect, useMemo, useCallback } from 'react';

type VisualizerDrawer = (p5: P5, analyzer: Tone.Analyser) => void;

interface VisualizerContainerProps {
  visualizer: Visualizer;
}

export class Visualizer {
  public readonly name: string;
  public readonly draw: VisualizerDrawer;
  public readonly analyzerType?: Tone.AnalyserType;
  public readonly size?: number;

  constructor(name: string, draw: VisualizerDrawer, analyzerType?: Tone.AnalyserType, size?: number) {
    this.name = name;
    this.draw = draw;
    this.analyzerType = analyzerType;
    this.size = size;
  }
}

export function VisualizerContainer({ visualizer }: VisualizerContainerProps) {
  const { name, draw, analyzerType, size } = visualizer;

  const analyzer: Tone.Analyser = useMemo(
    () => new Tone.Analyser(analyzerType, size === undefined ? 256 : size),
    [],
  );
  
  // let width = 0;
  // let height = 0; 
  // if (document.getElementById("vis-container") != null) {
  //   width = document.getElementById("vis-container")!.offsetWidth;
  //   height = document.getElementById("vis-container")!.offsetHeight;
  //   let observer = new ResizeObserver(e => {
  //     for (const entry of e) {
  //       width = entry.contentRect.width;
  //       height = entry.contentRect.height; 
  //       console.log(width, height);
  //     }
  //   });
  //   observer.observe(document.getElementById("vis-container")!);
  
  // }
  
  const onResize = useCallback((p5: P5) => {
    let width = window.innerWidth;
    let height = (window.innerHeight / 2);
    // if (document.getElementById("instvis-panel") !== null) {
    width = document.getElementById("instvis-panel")!.offsetWidth;
    console.log(width, height);
    // }
    p5.resizeCanvas(width, height, false);
  }, []);

  // const onResize = useCallback((p5: P5) => {
  //   p5.resizeCanvas(width, height, false);
  // }, []);

  useEffect(() => {
    Tone.getDestination().volume.value = -5;
    Tone.getDestination().connect(analyzer);
    return () => {
      Tone.getDestination().disconnect(analyzer);
    };
  }, [analyzer]);

  const setup = (p5: P5, canvasParentRef: Element) => {
    let width = window.innerWidth;
    let height = (window.innerHeight / 2);
    // if (document.getElementById("sidenav") !== null) {
    //   width = window.innerWidth - document.getElementById("sidenav")!.offsetWidth;
    //   console.log(width); 
    // }
    // if (document.getElementById("instvis-panel") !== null) {
    width = window.innerWidth - document.getElementById("sidenav")!.offsetWidth;
    //console.log(width, height);
    // }
    p5.frameRate(60);
    p5.createCanvas(width, height).parent(canvasParentRef);
  };

  return (
    <div id="vis-container" className={'bg-black h-100'}>
      <div className={'z-1 left-0 top-0 h3 ph4 bb b--dark-gray flex items-center white f5'}>{name}</div>
      <Sketch
        setup={setup}
        draw={p5 => draw(p5, analyzer)}
        windowResized={onResize}
      />
    </div>
  );
}
