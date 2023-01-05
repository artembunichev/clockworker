import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { useStore } from 'stores/root-store/context'

import { colors } from 'lib/theme'

import { PixelatedButton } from 'components/pixelated/pixelated-components'
import {
  GamePopup,
  GamePopupProps,
  closeGamePopup,
} from 'components/popup/game-popups/game-popup-template'

export type SettingsMenuTemplateProps = Omit<
  GamePopupProps,
  'width' | 'height' | 'styles' | 'title' | 'titleStyles' | 'withCloseButton'
> &
  Pick<GamePopupProps, 'onClose'>

export const SettingsMenuTemplate: FC<SettingsMenuTemplateProps> = observer(
  ({ popup, onClose, children }) => {
    const history = useStore().appStore.popupHistory

    const close = (): void => {
      closeGamePopup({ popup, history })
    }

    return (
      <GamePopup
        popup={popup}
        width={'600px'}
        height={'550px'}
        styles={{
          backgroundColor: colors.mainLight,
        }}
        title={'Настройки'}
        withCloseButton={false}
        onClose={onClose}
      >
        <Container>
          <List>{children}</List>
          <OKButtonContainer>
            <OKButton onClick={close}>ОК</OKButton>
          </OKButtonContainer>
        </Container>
      </GamePopup>
    )
  },
)

const Container = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`
const List = styled.ul`
  flex: 1 0 auto;
`
const OKButtonContainer = styled.div`
  text-align: right;
`
const OKButton = styled(PixelatedButton).attrs({
  pixelsSize: 'medium',
  backgroundColor: colors.mainMedium,
})`
  font-size: 30px;
  padding: 5px;
`
