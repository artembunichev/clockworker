import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { UpdateStore } from 'stores/update-store'

import { colors } from 'lib/theme'

import { PixelatedButton } from 'components/pixelated/pixelated-components'
import { Popup } from 'components/popup/popup-template'

type Props = {
  updateStore: UpdateStore
}

export const UpdateNotification: FC<Props> = observer(({ updateStore }) => {
  const { version, releaseNotes } = updateStore

  return (
    <>
      {version !== null && releaseNotes !== null && (
        <Popup
          width={'630px'}
          height={'auto'}
          isOpened={true}
          withCloseButton={false}
          title={'Доступно обновление!'}
          styles={{
            backgroundColor: colors.primary,
          }}
        >
          <Version>Clockworker v{version}</Version>
          <ReleaseNotesContainer>
            <ReleaseNotes dangerouslySetInnerHTML={{ __html: releaseNotes }} />
          </ReleaseNotesContainer>
          <UpdateGameButtonContainer>
            <UpdateGameButton onClick={updateStore.updateGame}>Обновить игру</UpdateGameButton>
          </UpdateGameButtonContainer>
        </Popup>
      )}
    </>
  )
})

const Version = styled.div`
  margin-top: 6px;
  margin-bottom: 6px;
  margin-left: 8px;
  font-size: 33px;
  text-align: left;
`
const ReleaseNotesContainer = styled.div`
  max-height: 600px;
  padding: 10px;
  margin-bottom: 16px;
  font-size: 28px;
  font-weight: bold;
  background-color: ${colors.tertiary};
  border-radius: 16px;
  overflow-y: auto;

  ::-webkit-scrollbar-track {
    margin-top: 7px;
    margin-bottom: 7px;
  }
`
const ReleaseNotes = styled.div`
  h1 {
    position: relative;
    font-size: 28px;
    margin-bottom: 16px;
    margin-left: 9px;
    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      background-color: #000000;
      bottom: -8px;
      left: 0;
    }
  }
  li {
    margin-bottom: 5.5px;
    margin-left: 30px;
    font-size: 22px;
    font-weight: 400;
    &:last-child {
      margin-bottom: 0;
    }
  }
`
const UpdateGameButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`
const UpdateGameButton = styled(PixelatedButton).attrs({
  pixelsSize: 'medium',
  backgroundColor: colors.secondary,
})`
  padding: 7px;
  font-size: 24px;
`
