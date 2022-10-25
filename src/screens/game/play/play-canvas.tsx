import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { Textbox } from 'components/textbox/textbox'

import { useGamePlayStore } from './screen'

export const PlayCanvas: FC = observer(() => {
  const gamePlayStore = useGamePlayStore()

  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (gamePlayStore.isGamePrepared && gamePlayStore.screen.canvas && containerRef.current) {
      //"рендер" канваса, созданного в сторе
      containerRef.current.appendChild(gamePlayStore.screen.canvas)
    }
  }, [gamePlayStore.isGamePrepared])

  return (
    <Container ref={containerRef}>
      <Textbox
        isOpened={gamePlayStore.textboxController.isTextboxOpened}
        text={gamePlayStore.textboxController.currentTextbox?.text ?? ''}
      />
    </Container>
  )
})

const Container = styled.div`
  position: relative;
  flex: 1 0 auto;
  display: flex;
`
