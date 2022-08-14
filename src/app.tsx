import { observer } from 'mobx-react-lite'
import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { QuitGameConfirm } from 'components/game-popups/quit-game-confirm'
import { CreateHeroScreen } from 'screens/create-hero/screen'
import { GameScreen } from 'screens/game/screen'
import { MainScreen } from 'screens/main/screen'

export const App: FC = observer(() => {
  const { appStore } = useStore()

  return (
    <>
      <GlobalStyles />

      <QuitGameConfirm isOpened={appStore.isQuitGameConfirmOpened} />

      <Container>
        {appStore.screen === 'main' && <MainScreen />}
        {appStore.screen === 'createHero' && <CreateHeroScreen />}
        {appStore.screen === 'game' && <GameScreen />}
      </Container>
    </>
  )
})

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding:0;
    box-sizing: border-box;
    font-family: Pixel;
    user-select: none;
    cursor: default;
  }

  body {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  body > #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  button {
    border: none;
    outline: none;
  }

  input {
    border:0;
    outline: 0;
  }
`
const Container = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
`