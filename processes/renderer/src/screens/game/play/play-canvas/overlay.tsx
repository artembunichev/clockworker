import { FC } from 'basic-utility-types';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { GameTextbox } from 'screens/game/game-textbox';

export const PlayCanvasOverlay: FC = observer( () => {
  return <GameTextbox />;
} );
