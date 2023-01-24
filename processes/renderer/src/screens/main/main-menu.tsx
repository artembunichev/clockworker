import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { colors } from 'lib/theme'

import { PixelatedButton } from 'components/pixelated/pixelated-components'
import { AppSettingsMenu } from 'screens/shared/app-settings/menu'

export const MainMenu: FC = observer(() => {
  const { appStore } = useStore()
  const { settingsMenu } = appStore.popups

  const createNewGame = (): void => {
    appStore.setScreen('game')
  }

  const openAppSettings = (): void => {
    settingsMenu.open()
  }

  return (
    <MainMenuButtons>
      <AppSettingsMenu />

      <Button onClick={createNewGame}>Новая игра</Button>
      <Button onClick={openAppSettings}>Настройки</Button>
    </MainMenuButtons>
  )
})

const MainMenuButtons = styled.menu`
  display: flex;
  flex-direction: column;
`
const Button = styled(PixelatedButton).attrs({
  pixelsSize: 'medium',
  backgroundColor: colors.mainLight,
})`
  font-size: 32px;
  padding: 22px 5px;
  margin-top: 20px;
  &:first-child {
    margin-top: 0;
  }
`
