import { animated, useTransition } from '@react-spring/web';
import { FC } from 'basic-utility-types';
import { observer } from 'mobx-react-lite';
import { createContext, useContext, useState } from 'react';
import { GamePlayStore } from 'stores/game/play/store';
import { GameStore } from 'stores/game/store';
import { useStore } from 'stores/root-store/context';
import styled from 'styled-components';
import { GamePlayScreen } from './play/screen';
import { PreGameFormScreen } from './pre-game-form/screen';

// контекст для GameStore
const GameStoreContext = createContext<GameStore | null>( null );
export const useGameStore = (): GameStore => {
  const gameStore = useContext( GameStoreContext );
  if ( !gameStore ) {
    throw new Error( 'You have forgotten to wrap game screen component with GameStoreProvider' );
  }
  return gameStore;
};

// контекст для GamePlayStore
const GamePlayStoreContext = createContext<GamePlayStore | null>( null );
export const useGamePlayStore = (): GamePlayStore => {
  const gamePlayStore = useContext( GamePlayStoreContext );
  if ( !gamePlayStore ) {
    throw new Error(
      'You have forgotten to wrap game play screen component with GamePlayStoreProvider',
    );
  }
  return gamePlayStore;
};

export const GameScreen: FC = observer( () => {
  const { createGameStore } = useStore();
  const [ gameStore ] = useState( createGameStore );
  const { playStore } = gameStore;

  const gameTransition = useTransition( gameStore.screen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      duration: playStore?.opening.appearanceMs ?? 0,
    },
  } );

  return (
    <GameStoreContext.Provider value={ gameStore }>
      { gameTransition( ( styles, item ) => {
        return item === 'preGameForm' ? (
          <GamePageContainer
            style={ {
              ...styles,
              opacity: 1,
            } }
          >
            <PreGameFormScreen />
          </GamePageContainer>
        ) : (
          gameStore.playStore && (
            <GamePageContainer style={ styles }>
              <GamePlayStoreContext.Provider value={ playStore }>
                <GamePlayScreen />
              </GamePlayStoreContext.Provider>
            </GamePageContainer>
          )
        );
      } ) }
    </GameStoreContext.Provider>
  );
} );

const GamePageContainer = styled( animated.div )`
  position: absolute;
  bottom: 0;
  right: 0;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
`;
