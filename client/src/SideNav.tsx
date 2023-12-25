// 3rd party library imports
import classNames from 'classnames';
import { List } from 'immutable';
import React, { useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  RadioButton20,
  RadioButtonChecked20,
  Music20,
  Menu24,
  PlayFilledAlt20,
  Play20
} from '@carbon/icons-react';

// project imports
import { DispatchAction } from './Reducer';
import { AppState } from './State';
import { Instrument } from './Instruments';
import { Visualizer } from './Visualizers';
import { NavOpenContext } from './MainPage';


/** ------------------------------------------------------------------------ **
 * SideNav component
 ** ------------------------------------------------------------------------ */

type SideNavProps = {
  state: AppState;
  dispatch: React.Dispatch<DispatchAction>;
};

export function SideNav({ state, dispatch }: SideNavProps): JSX.Element {
  /**
   *
   * SideNav
   * |-----------------|
   * | Nameless App    |
   * | |-----------|   |
   * | |           |   |
   * | |-----------|   |
   * |                 |
   * | InstrumentsNav  |
   * | |-----------|   |
   * | |           |   |
   * | |-----------|   |
   * |                 |
   * | VisualizersNav  |
   * | |-----------|   |
   * | |           |   |
   * | |-----------|   |
   * |                 |
   * | SongsNav        |
   * | |-----------|   |
   * | |           |   |
   * | |-----------|   |
   * |                 |
   * |-----------------|
  */
  const {isOpen, toggleOpen} = useContext(NavOpenContext);

  return (
    // <div id="sidenav" className="absolute top-0 left-0 bottom-0 w5 z-1 shadow-1 bg-white flex flex-column">
    <div id="sidenav" className={`${isOpen ? '' : 'hidden-nav'}`}>
      {/* <h1>{isOpen ? 'OPEN' : 'CLOSED'}</h1> */}
      <div className={`vh-100 w5 z-1 br b--black-20 bg-white flex flex-column ${isOpen ? '' : 'hidden-nav'}`}>
        <div className="h3 fw7 f5 flex items-center pl3 bb b--light-gray">
          <div id="side-hamburger" className='pa2 hamburger' onClick={() => {toggleOpen(!isOpen);}}>
            <Menu24 className='db'></Menu24>
          </div>
          <h1 className='ml3 f5 ma0'>Broken Record</h1>
        </div>
        <div className="overflow-y-auto" style={{flex: 1}}>
          <InstrumentsNav state={state} dispatch={dispatch} />
          <VisualizersNav state={state} dispatch={dispatch} />
          <SongsNav state={state} dispatch={dispatch} />
        </div>
      </div>
    </div >
  );
}


/** ------------------------------------------------------------------------ **
 * SideNav Sub-Components
 ** ------------------------------------------------------------------------ */

function InstrumentsNav({ state }: SideNavProps): JSX.Element {
  /** 
   *  InstrumentsNav
   *  |-----------------|
   *  | Section         |
   *  | |-------------| |
   *  | | RadioButton | |
   *  | |-------------| |
   *  | | RadioButton | |
   *  | |-------------| |
   *  |      ...        |
   *  |-----------------|
  */

  const instruments: List<Instrument> = state.get('instruments');
  const activeInstrument = state.get('instrument')?.name;
  const location = useLocation();

  return (
    <Section title="Instruments">
      {instruments.map(i => (
        <PlayRadioButton
          key={i.name}
          to={`/${i.name}${location.search}`}
          text={i.name}
          active={i.name === activeInstrument}
          onClick={() => console.log(i.name)}
        />
      ))}
    </Section>
  );
}

function VisualizersNav({ state }: SideNavProps): JSX.Element {
  /**
   *  VisualizersNav
   *  |-----------------|
   *  | Section         |
   *  | |-------------| |
   *  | | RadioButton | |
   *  | |-------------| |
   *  | | RadioButton | |
   *  | |-------------| |
   *  |      ...        |
   *  |-----------------|
  */

  const visualizers: List<Visualizer> = state.get('visualizers');
  const activeVisualizer = state.get('visualizer')?.name;
  const location = useLocation();

  return (
    <Section title="Visualizers">
      <RadioButton
          key={'None'}
          to={{
            pathname: location.pathname,
            search: `?`,
          }}
          text={'None'}
          active={activeVisualizer === undefined}
          onClick={() => console.log(activeVisualizer)}
        />
      {visualizers.map(v => (
        <RadioButton
          key={v.name}
          // to={
          //   v.name !== activeVisualizer ? {
          //   pathname: location.pathname,
          //   search: `?visualizer=${v.name}`,
          // }:
          // {
          //   pathname: location.pathname,
          //   search: `?`,
          // }
          // }
          to={{
            pathname: location.pathname,
            search: `?visualizer=${v.name}`,
          }}
          text={v.name}
          active={v.name === activeVisualizer}
          onClick={() => console.log(v.name)}
        />
      ))}
    </Section>
  );
}

function SongsNav({ state, dispatch }: SideNavProps): JSX.Element {
  /**
   *
   *  SongsNav
   *  |-----------------|
   *  | Section         |
   *  | |-------------| |
   *  | | Music20     | |
   *  | |-------------| |
   *  | | Music20     | |
   *  | |-------------| |
   *  |      ...        |
   *  |-----------------|
  */

  const songs: List<any> = state.get('songs', List());
  return (
    <Section title="Playlist">
      {songs.map(song => (
        <div
          key={song.get('id')}
          className="f6 pointer flex items-center i pa2 dim lh-title"
          onClick={() =>
            dispatch(new DispatchAction('PLAY_SONG', { id: song.get('id') }))
          }
        >
          <Music20 className="mr2" />
          <div>{song.get('songTitle')}</div>
        </div>
      ))}
    </Section>
  );
}


/** ------------------------------------------------------------------------ **
 * Auxilliary components
 ** ------------------------------------------------------------------------ */

/** ------------------------------------- **
 * Radio Button
 ** ------------------------------------- */

type RadioButtonProps = {
  to: any,
  text: string,
  active: boolean,
  onClick: () => void
};

function RadioButton({ to, text, active, onClick }: RadioButtonProps): JSX.Element {
  return (
    <Link to={to} className="no-underline">

      <div
        className={classNames('f6 flex items-center black pa2 dim', { 'fw7 bg-light-gray': active })}
        onClick={onClick}
      >
        {active ? (
          <RadioButtonChecked20 className="mr2" />
        ) : (
          <RadioButton20 className="mr2" />
        )}
        <div className="dim">{text}</div>
      </div>
    </Link>
  );
}

function PlayRadioButton({ to, text, active, onClick }: RadioButtonProps): JSX.Element {
  return (
    <Link to={to} className="no-underline">

      <div
        className={classNames('f6 flex items-center black pa2 dim', { 'fw7 bg-light-gray': active })}
        onClick={onClick}
      >
        {active ? (
          <PlayFilledAlt20 className="mr2" />
        ) : (
          <Play20 className="mr2" />
        )}
        <div className="dim">{text}</div>
      </div>
    </Link>
  );
}


/** ------------------------------------- **
 * Section
 ** ------------------------------------- */

const Section: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div className="flex flex-column bb b--light-gray pa3">
      <div className="fw7 mb2">{title} </div>
      <div className="flex-auto h-100">{children}</div>
    </div>
  );
};
