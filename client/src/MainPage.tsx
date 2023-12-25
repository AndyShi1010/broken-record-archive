// 3rd party library imports
import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import * as Tone from 'tone';
import { Music32, Menu24 } from '@carbon/icons-react';

// project imports
import { AppState } from './State';
import { DispatchAction } from './Reducer';
import { SideNav } from './SideNav';
import { InstrumentContainer } from './Instruments';
import { VisualizerContainer } from './Visualizers';
import './MainPage.css';

// interface NavOpenInterface {
//   open: boolean;
//   toggleOpen: () => void;
// }

// const defaultNavState = {
//   open: true,
//   toggleOpen: () => console.log('nav toggled'),
// };

export const NavOpenContext = React.createContext({
  isOpen: true,
  toggleOpen: (open:boolean) => {
    console.log(open);
  }
});
/** ------------------------------------------------------------------------ **
 * MainPage component
 ** ------------------------------------------------------------------------ */

type PanelProps = {
  state: AppState;
  dispatch: React.Dispatch<DispatchAction>;
};

export function MainPage({ state, dispatch }: PanelProps): JSX.Element {
  /**
   * Component Layout
   * 
   * MainPage
   * |------------------------------------------------------------------|
   * | SideNav   ShowWelcomePanel                                       |
   * | |---|     |---------------------------------------------------|  |
   * | |   |     |                                                   |  |
   * | |   |     |                                                   |  |
   * | |   |     |                                                   |  |
   * | |   |     |                                                   |  |
   * | |   |     |                                                   |  |
   * | |   |     |                                                   |  |
   * | |   |     |                                                   |  |
   * | |   |     |                                                   |  |
   * | |   |     |                                                   |  |
   * | |---|     | --------------------------------------------------|  |
   * |------------------------------------------------------------------|
   * 
   * or
   * 
   * MainPage
   * |------------------------------------------------------------------|
   * | SideNav   InstrumentAndVisualizerPanel                           |
   * | |---|     |---------------------------------------------------|  |
   * | |   |     | InstrumentPanel                                   |  |
   * | |   |     | |-----------------------------------------------| |  |
   * | |   |     | |                                               | |  |
   * | |   |     | |-----------------------------------------------| |  |
   * | |   |     |                                                   |  |
   * | |   |     | VisualizerPanel                                   |  |
   * | |   |     | |-----------------------------------------------| |  |
   * | |   |     | |                                               | |  |
   * | |   |     | |-----------------------------------------------| |  |
   * | |---|     | --------------------------------------------------|  |
   * |------------------------------------------------------------------|
   */

  const location = useLocation();
  const isWelcome = !state.get('instrument');
  // const navState = state.get('navOpen');

  // const handleNavToggle = () => {
  //   if (navState) {
  //     state.set('navOpen', false);
  //   } else {
  //     state.set('navOpen', true);
  //   }
  //   console.log(navState);
  // }

  const [navState, navToggle] = useState(true);

  useEffect(() => {
    dispatch(new DispatchAction('SET_LOCATION', { location }));
  }, [dispatch, location]);

  return (
    <NavOpenContext.Provider value={{
      isOpen: navState,
      toggleOpen: navToggle,
    }}>
    <div
      className="fixed top-0 left-0 h-100 w-100 bg-white"
      id="app-container"
      onClick={() => Tone.start()}
    >
      <SideNav state={state} dispatch={dispatch}/>
      {isWelcome ? (
        <ShowWelcomePanel />
      ) : (
        <InstrumentAndVisualizerPanel state={state} dispatch={dispatch}/>
      )}
    </div>
    </NavOpenContext.Provider>
  );
}


/** ------------------------------------------------------------------------ **
 * MainPage Sub-Components
 ** ------------------------------------------------------------------------ */

/** ------------------------------------- **
 * Welcome
 ** ------------------------------------- */

function ShowWelcomePanel(): JSX.Element {

  const {isOpen, toggleOpen} = useContext(NavOpenContext);

  return (
    <div
      id="welcome-panel"
      // className="main-content absolute right-0 bottom-0 top-0 flex flex-column items-center justify-center"
      className="main-content right-0 bottom-0 top-0 flex flex-column items-center justify-center bg-light-gray"
      // style={{ left: '16rem' }}
    >
      <div id="title-hamburger" className={`absolute top-1 left-1 pa2 hamburger ${isOpen ? 'hidden': 'mr3'}`} onClick={() => {toggleOpen(!isOpen);}}>
        <Menu24 className='db'></Menu24>
      </div>
      <div className="mw6 lh-copy mb4">
        <Music32 />
        <div className="f3 fw7 mb2">Welcome to Broken Record.</div>
        <div className="f4 mb3">
          Select an instrument and a visualizer on the left to serve some fresh beats.
        </div>
        {/* <div className="f5">The UI is yours to design. Express yourself.</div> */}
      </div>
    </div>
  );
}


/** ------------------------------------- **
 * Instrument and visualizer
 ** ------------------------------------- */

function InstrumentAndVisualizerPanel({ state, dispatch}: PanelProps): JSX.Element {
  /**
   * This React component bundles the instrument panel and visualizer panel together.
   */

  return (
    <div
      id="instvis-panel"
      // className="absolute right-0 bottom-0 top-0 flex flex-column"
      className="overflow-x-auto vh-100"
      // style={{ left: '16rem' }}
    >
      <InstrumentPanel state={state} dispatch={dispatch} />
      <VisualizerPanel state={state} dispatch={dispatch} />
    </div>
  );
}


function InstrumentPanel({ state, dispatch }: PanelProps): JSX.Element {
  /**
   * This React component is the top-level for the instrument.
   */
  const instrument = state.get('instrument');

  return (
    <div className='flex-auto overflow-y-auto overflow-x-hidden'>
      {instrument && (
        <InstrumentContainer
          state={state}
          dispatch={dispatch}
          instrument={instrument}
        />
      )}
    </div>
  );
}

function VisualizerPanel({ state }: PanelProps): JSX.Element {
  /**
   * This React component is the top-level for the visualizer.
   */
  const visualizer = state.get('visualizer');

  return (
    <div className="flex-visfooter">
      {visualizer && (
        <VisualizerContainer key={visualizer.name} visualizer={visualizer} />
      )}
    </div>
  );
}
