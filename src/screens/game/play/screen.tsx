import { observer } from 'mobx-react-lite'
import React from 'react'

import { FC } from 'basic-utility-types'

import { QuitGameConfirm } from 'components/popup/game-popups/confirms/quit-game-confirm'
import { QuitInMainMenuConfirm } from 'components/popup/game-popups/confirms/quit-in-main-menu-confirm'

import { GameOpening } from '../opening'
import { useGameStore } from '../screen'
import { PauseMenu } from './pause-menu'
import { PlayCanvas } from './play-canvas/canvas'
import { GameSettingsMenu } from './settings/menu'
import { useGamePlayScreenEsc } from './use-esc'

export const GamePlayScreen: FC = observer(() => {
  const gameStore = useGameStore()

  useGamePlayScreenEsc()

  return (
    <>
      <QuitGameConfirm onAccept={gameStore.endGame} />
      <QuitInMainMenuConfirm onAccept={gameStore.endGame} />

      <GameOpening />
      <PauseMenu />
      <GameSettingsMenu />
      <PlayCanvas />
    </>
  )
})
