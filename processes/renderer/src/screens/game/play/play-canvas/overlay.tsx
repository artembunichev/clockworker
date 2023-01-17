import { observer } from 'mobx-react-lite'
import React from 'react'

import { FC } from 'basic-utility-types'

import { GameTextbox } from 'components/textbox/game-textbox'

export const PlayCanvasOverlay: FC = observer(() => {
  return <GameTextbox />
})
