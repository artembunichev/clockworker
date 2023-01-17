import { observer } from 'mobx-react-lite'
import React from 'react'

import { FC } from 'basic-utility-types'

import { SingleValueSetting } from 'stores/entities/editable-settings/single-value-setting'

import { colors } from 'lib/theme'

import { PixelatedCheckbox } from 'components/checkbox/pixelated-checkbox'

type Props = {
  setting: SingleValueSetting<boolean>
  checkboxSize: number
}

export const FlagSetting: FC<Props> = observer(({ setting, checkboxSize }) => {
  const onSelect = (): void => {
    setting.setValue(true)
  }

  const onUnselect = (): void => {
    setting.setValue(false)
  }

  return (
    <PixelatedCheckbox
      size={checkboxSize}
      checked={setting.value}
      onSelect={onSelect}
      onUnselect={onUnselect}
      backgroundColor={colors.mainMedium}
      checkedBackgroundColor={colors.mainMediumWell}
    />
  )
})
