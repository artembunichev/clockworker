import { observer } from 'mobx-react-lite';
import React from 'react';

import { FC } from 'basic-utility-types';

import { QuitGameConfirm } from 'screens/shared/popups/confirms/quit-game-confirm';
import { QuitInMainMenuConfirm } from 'screens/shared/popups/confirms/quit-in-main-menu-confirm';

import { GameOpening } from '../opening';
import { useGameStore } from '../screen';
import { GamePauseMenu } from './pause-menu';
import { PlayCanvas } from './play-canvas/canvas';
import { GameSettingsMenu } from './settings/menu';
import { useGamePlayScreenEsc } from './use-esc';

export const GamePlayScreen: FC = observer( () => {
  const gameStore = useGameStore();

  useGamePlayScreenEsc();

  return (
    <>
      <QuitGameConfirm onAccept={gameStore.endGame} />
      <QuitInMainMenuConfirm onAccept={gameStore.endGame} />

      <GameOpening />
      <GamePauseMenu />
      <GameSettingsMenu />
      <PlayCanvas />
    </>
  );
} );
