import { observer } from 'mobx-react-lite'
import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { colors } from 'lib/theme'

import { UpdateNotification } from 'components/update-notification/update-notification'
import { GameScreen } from 'screens/game/screen'
import { MainScreen } from 'screens/main/screen'

export const App: FC = observer(() => {
  const { appStore, updateStore } = useStore()

  return (
    <>
      <GlobalStyles />

      <Container>
        {appStore.screen === 'main' && <MainScreen />}
        {appStore.screen === 'game' && <GameScreen />}
      </Container>

      {updateStore && updateStore.isUpdateAvailable && (
        <UpdateNotification
          version={updateStore.version}
          releaseNotes={updateStore.releaseNotes}
          currentPercentage={updateStore.currentPercentage}
          updateGame={updateStore.updateGame}
        />
      )}
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

  ::-webkit-scrollbar {
    width: 12.5px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color:${colors.mainDark}
  }
`
const Container = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
`
