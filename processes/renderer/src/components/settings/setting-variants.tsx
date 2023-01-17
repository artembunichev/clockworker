import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { CheckboxSetting } from 'stores/entities/editable-settings/checkbox-setting'
import { RadioSetting } from 'stores/entities/editable-settings/radio-setting'

import { colors } from 'lib/theme'

import { PixelatedCheckbox } from 'components/checkbox/pixelated-checkbox'

type Props = {
  setting: CheckboxSetting<unknown> | RadioSetting<unknown>
  checkboxSize: number
}

export const SettingVariants: FC<Props> = observer(({ setting, checkboxSize }) => {
  const onSelect = (variantId: string): void => {
    setting.selectVariant(variantId)
  }

  const onUnselect = (variantId: string): void => {
    if (setting instanceof CheckboxSetting) {
      setting.unselectVariant(variantId)
    }
  }

  return (
    <Variants>
      {setting.variants.map((variant) => {
        return (
          <Variant key={variant.id}>
            <Label>{variant.label}</Label>
            <PixelatedCheckbox
              size={checkboxSize}
              checked={variant.isSelected}
              onSelect={() => onSelect(variant.id)}
              onUnselect={() => onUnselect(variant.id)}
              backgroundColor={colors.mainMedium}
              checkedBackgroundColor={colors.mainMediumWell}
            />
          </Variant>
        )
      })}
    </Variants>
  )
})

const Variants = styled.div`
  flex: 1 0 auto;
  display: flex;
  justify-content: space-around;
`
const Variant = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Label = styled.div`
  margin-bottom: 8px;
`
