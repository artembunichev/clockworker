import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'

import { colors, theme } from 'lib/theme'

import { Popup } from 'components/popup/popup-template'

type Props = {
  percentage: number
}

export const DownloadProgress: FC<Props> = observer(({ percentage }) => {
  const downloadLineWidth = 400
  const totalPiecesCount = 10
  const gap = 0.95
  const pieceWidth = (downloadLineWidth - (totalPiecesCount - 1) * gap) / totalPiecesCount

  const piecesCount = Math.floor((percentage / 100) * totalPiecesCount)

  return (
    <Popup
      width={`500px`}
      height={'155px'}
      styles={{ backgroundColor: colors.mainLight }}
      title={'Загрузка обновления'}
      titleStyles={{ fontSize: 28 }}
      isOpened={true}
      withCloseButton={false}
    >
      <Container>
        <DownloadLine width={downloadLineWidth}>
          <Pieces>
            {[...Array(piecesCount)].map((_, index) => (
              <Piece key={index} width={pieceWidth} gap={gap} />
            ))}
          </Pieces>
        </DownloadLine>
        <Percentage>{Math.trunc(percentage)}%</Percentage>
      </Container>
    </Popup>
  )
})

const Container = styled.div`
  flex: 1 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`
const DownloadLine = styled.div<{ width: number }>`
  min-width: ${(props) => props.width}px;
  height: 40px;
  border-radius: ${theme.borderRadius}px;
  background-color: ${colors.mainMedium};
  overflow: hidden;
`
const Pieces = styled.div`
  display: flex;
  height: 100%;
`
const Piece = styled.div<{ width: number; gap: number }>`
  width: ${(props) => props.width}px;
  margin-right: ${(props) => props.gap}px;
  height: 100%;
  background-color: ${colors.mainDarkWell};
  &:last-child {
    margin-right: 0;
  }
`
const Percentage = styled.span`
  min-width: 54px;
  text-align: center;
  margin-top: -5px;
  margin-left: 11px;
  font-size: 24px;
`
