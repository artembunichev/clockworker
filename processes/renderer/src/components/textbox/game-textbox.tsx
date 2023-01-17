import { observer } from 'mobx-react-lite'
import React from 'react'

import { useGamePlayStore } from 'screens/game/screen'

import { Textbox } from './textbox'

export const GameTextbox = observer(() => {
  const gamePlayStore = useGamePlayStore()
  const { textboxController } = gamePlayStore

  const text = textboxController.currentTextbox?.text

  return <Textbox isOpened={textboxController.isTextboxOpened} text={text} />
})
