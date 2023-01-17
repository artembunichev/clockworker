import { observer } from 'mobx-react-lite'
import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'
import { Callback, RequiredBy } from 'process-shared/types/basic-utility-types'

import { PixelatedButton } from 'components/pixelated/pixelated-components'

import { GamePopup, GamePopupProps, closeGamePopup } from './game-popup-template'

type ExtraProps = {
  question: string
  questionStyles?: CSSProperties
  acceptText: string
  onAccept: Callback | null
  rejectText: string
  onReject: Callback | null
  buttonsStyles: RequiredBy<CSSProperties, 'backgroundColor'>
}

export type GameConfirmPopupProps = Omit<GamePopupProps, 'withCloseButton'> & ExtraProps

export const GameConfirmPopup: FC<GameConfirmPopupProps> = observer(
  ({
    popup,
    width,
    height,
    styles,
    title,
    titleStyles,
    question,
    questionStyles,
    acceptText,
    onAccept,
    rejectText,
    onReject,
    buttonsStyles,
  }) => {
    const { backgroundColor, ...buttonsStylesWithoutBackgroundColor } = buttonsStyles

    const close = (): void => {
      closeGamePopup(popup)
    }

    const accept = (): void => {
      close()
      onAccept?.()
    }

    const reject = (): void => {
      close()
      onReject?.()
    }

    return (
      <GamePopup
        popup={popup}
        width={width}
        height={height}
        styles={styles}
        title={title}
        titleStyles={titleStyles}
        withCloseButton={false}
      >
        <Container>
          <Question style={questionStyles}>{question}</Question>
          <Buttons>
            <Button
              onClick={accept}
              style={buttonsStylesWithoutBackgroundColor}
              backgroundColor={backgroundColor}
            >
              {acceptText}
            </Button>
            <Button
              onClick={reject}
              style={buttonsStylesWithoutBackgroundColor}
              backgroundColor={backgroundColor}
            >
              {rejectText}
            </Button>
          </Buttons>
        </Container>
      </GamePopup>
    )
  },
)

const Container = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const Question = styled.div`
  text-align: center;
  font-size: 36px;
`
const Buttons = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
`
const Button = styled(PixelatedButton).attrs({
  pixelsSize: 'medium',
})`
  font-size: 32px;
`
