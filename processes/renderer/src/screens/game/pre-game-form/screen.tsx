import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { colors } from 'lib/theme'

import { PixelatedButton } from 'components/pixelated/pixelated-components'
import { QuitInMainMenuConfirm } from 'screens/shared/popups/confirms/quit-in-main-menu-confirm'

import { useGameStore } from '../screen'
import { PreGameForm } from './form'
import { usePreGameFormScreenEsc } from './use-esc'

export const PreGameFormScreen: FC = observer(() => {
  const { appStore } = useStore()
  const gameStore = useGameStore()
  const gamePlayStore = gameStore.playStore

  usePreGameFormScreenEsc({ gamePlayStore })

  const goBack = (): void => {
    appStore.setScreen('main')
  }

  return (
    <Container>
      <QuitInMainMenuConfirm question={'Вернуться в главное меню?'} />

      <Title>Создайте персонажа</Title>
      <Body>
        <BackButton onClick={goBack}>Назад</BackButton>
        <PreGameForm />
      </Body>
    </Container>
  )
})

const Container = styled.div`
  position: relative;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  padding: 25px;
`
const BackButton = styled(PixelatedButton).attrs({
  pixelsSize: 'medium',
  backgroundColor: colors.mainLight,
})`
  position: absolute;
  bottom: 10px;
  left: 19px;
  padding: 5px;
  font-size: 24px;
`
const Title = styled.div`
  font-size: 50px;
  text-align: center;
  margin-top: 35px;
  color: ${colors.mainMedium};
`
const Body = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
`
