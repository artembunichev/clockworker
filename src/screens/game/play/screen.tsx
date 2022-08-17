import { observer } from 'mobx-react-lite'
import React, { createContext, useContext, useState } from 'react'

import { FC } from 'basic-utility-types'

import { GamePlayStore } from 'stores/game/play/game-play.store'
import { useStore } from 'stores/root-store/context'

import { useKey } from 'hooks/use-key'

import { QuitInMainMenuConfirm } from 'components/game-popups/quit-in-main-menu-confirm'
import { SettingsMenu } from 'screens/main/settings/menu'

import { useGameStore } from '../game'
import { GameOpening } from '../opening'
import { PauseMenu } from './pause-menu'
import { PlayCanvas } from './play-canvas'

const GamePlayStoreContext = createContext<GamePlayStore | null>(null)
export const useGamePlayStore = (): GamePlayStore => {
  const gamePlayStore = useContext(GamePlayStoreContext)
  if (!gamePlayStore) {
    throw new Error('You have forgotten to wrap game play screen component with GamePlayStoreProvider')
  }
  return gamePlayStore
}

export const GamePlayScreen: FC = observer(() => {
  const { appStore } = useStore()
  const gameStore = useGameStore()
  const [gamePlayStore] = useState(gameStore.createGamePlayStore)

  useKey({
    key: 'Escape',
    fn: () => {
      if (!gameStore.opening.isOpening) {
        if (!gamePlayStore.isTextboxOpened) {
          if (appStore.isQuitGameConfirmOpened) {
            appStore.closeQuitGameConfirm()
          } else if (appStore.isQuitInMainMenuConfirmOpened) {
            appStore.closeQuitInMainMenuConfirm()
          } else if (gamePlayStore.isSettingsMenuOpened) {
            gamePlayStore.closeSettingsMenu()
            gamePlayStore.openGamePauseMenu()
          } else {
            gamePlayStore.toggleGamePause()
            gamePlayStore.toggleGamePauseMenu()
          }
        }
      }
    },
  })

  return (
    <GamePlayStoreContext.Provider value={gamePlayStore}>
      <GameOpening isOpened={gameStore.opening.isOpening} />
      <PauseMenu isOpened={gamePlayStore.isGamePauseMenuOpened} />
      <SettingsMenu
        isOpened={gamePlayStore.isSettingsMenuOpened}
        onClose={gamePlayStore.closeSettingsMenu}
        afterClose={gamePlayStore.openGamePauseMenu}
      />
      <QuitInMainMenuConfirm isOpened={appStore.isQuitInMainMenuConfirmOpened} />
      <PlayCanvas />
    </GamePlayStoreContext.Provider>
  )
})
