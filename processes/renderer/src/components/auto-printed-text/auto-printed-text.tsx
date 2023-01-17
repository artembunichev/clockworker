import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'
import { nanoid } from 'nanoid'
import { Callback } from 'process-shared/types/basic-utility-types'

type Props = {
  text: string
  interval?: number
  onPrintEnd?: Callback
  isPrintSkipped?: boolean
}

type TextSymbol = { id: string; value: string; isVisible: boolean }
type TextSymbols = Array<TextSymbol>

export const AutoPrintedText: FC<Props> = observer(
  ({ text, interval = 50, onPrintEnd, isPrintSkipped = false }) => {
    const [textSymbols, setTextSymbols] = useState<TextSymbols>(() => {
      return text.split('').map((symbol) => ({ id: nanoid(), value: symbol, isVisible: false }))
    })

    const intervalIdRef = useRef<NodeJS.Timer>()

    const makeSymbolVisible = (index: number): void => {
      setTextSymbols((prev) => {
        return prev.map((textSymbol, symbolIndex) => {
          if (symbolIndex === index) {
            return {
              ...textSymbol,
              isVisible: true,
            }
          }
          return {
            ...textSymbol,
          }
        })
      })
    }

    const setPrintEnds = (): void => {
      clearInterval(intervalIdRef.current)
      onPrintEnd?.()
    }

    const skipPrintAndShowEntireText = (): void => {
      setTextSymbols((prev) => prev.map((textSymbol) => ({ ...textSymbol, isVisible: true })))
      setPrintEnds()
    }

    useEffect(() => {
      if (!isPrintSkipped) {
        var currentSymbolIndex = 0
        intervalIdRef.current = setInterval(() => {
          if (currentSymbolIndex <= text.length - 1) {
            makeSymbolVisible(currentSymbolIndex)
            currentSymbolIndex += 1
          } else {
            setPrintEnds()
          }
        }, interval)
      } else {
        skipPrintAndShowEntireText()
      }
    }, [isPrintSkipped])

    return (
      <Text>
        {textSymbols.map((textSymbol) => {
          return (
            <TextSymbol key={textSymbol.id} isVisible={textSymbol.isVisible}>
              {textSymbol.value}
            </TextSymbol>
          )
        })}
      </Text>
    )
  },
)

const Text = styled.div``
const TextSymbol = styled.span<{ isVisible: boolean }>`
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
`
