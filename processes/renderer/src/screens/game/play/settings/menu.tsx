import { observer } from 'mobx-react-lite'
import React from 'react'

import { FC } from 'basic-utility-types'

import { SettingsMenuTemplate } from 'components/settings/settings-menu-template'
import { useGamePlayStore } from 'screens/game/screen'

import { ControlsSettingsSection } from './sections/controls'

export const GameSettingsMenu: FC = observer(() => {
  const gamePlayStore = useGamePlayStore()

  return (
    <SettingsMenuTemplate popup={gamePlayStore.popups.settingsMenu}>
      <ControlsSettingsSection />
    </SettingsMenuTemplate>
  )
})
