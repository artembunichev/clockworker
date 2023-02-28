import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'

import { FC } from 'basic-utility-types'
import { SubmitHandler, useForm } from 'react-hook-form'
import { doubleBorderStyle } from 'shared-styles'
import { isLetter, isNumber } from 'shared/lib/strings'

import { PreGameFormFields } from 'stores/game/pre-game-form'

import { colors } from 'lib/theme'

import {
  PixelatedButton,
  PixelatedDiv,
  PixelatedInput,
} from 'components/pixelated/pixelated-components'

import { useGameStore } from '../screen'
import { FieldErrorMessages } from './errors/field-error-messages'
import { getFormErrors } from './errors/get-errors'

export const PreGameForm: FC = observer(() => {
  const gameStore = useGameStore()
  const { preGameForm } = gameStore

  const { register, handleSubmit, getValues, setValue, formState } = useForm<PreGameFormFields>()

  const errors = getFormErrors(formState.errors)

  const trimPlayerCharacterName = (): void => {
    const { playerCharacterName } = getValues()
    setValue('playerCharacterName', playerCharacterName.trim())
  }
  const trimMarketName = (): void => {
    const { marketName } = getValues()
    setValue('marketName', marketName.trim())
  }

  const validateNoSpecialSymbols = (value: string): boolean => {
    return value
      .split('')
      .every((symbol) => isLetter(symbol) || isNumber(symbol) || symbol === ' ' || symbol === '-')
  }

  const startGame: SubmitHandler<PreGameFormFields> = ({ playerCharacterName, marketName }) => {
    preGameForm.setPlayerCharacterName(playerCharacterName)
    preGameForm.setMarketName(marketName)
    gameStore.startGame()
  }

  return (
    <FormBlock>
      <Form onSubmit={handleSubmit(startGame)}>
        <InputContainer>
          <Input
            {...register('playerCharacterName', {
              required: true,
              validate: validateNoSpecialSymbols,
              onBlur: trimPlayerCharacterName,
              minLength: 2,
            })}
            maxLength={20}
            placeholder={'Имя персонажа'}
          />
          {errors.playerCharacterName.isError && (
            <ExclamationMarkContainer>
              <ExclamationMark>!</ExclamationMark>
            </ExclamationMarkContainer>
          )}
          <FieldErrorMessages errors={errors.playerCharacterName} />
        </InputContainer>
        <InputContainer>
          <Input
            {...register('marketName', {
              required: true,
              validate: validateNoSpecialSymbols,
              onBlur: trimMarketName,
              minLength: 2,
            })}
            maxLength={20}
            placeholder={'Название магазина'}
          />
          {errors.marketName.isError && (
            <ExclamationMarkContainer>
              <ExclamationMark>!</ExclamationMark>
            </ExclamationMarkContainer>
          )}
          <FieldErrorMessages errors={errors.marketName} />
        </InputContainer>
        <StartGameButtonContainer>
          <StartGameButton type='submit'>Начать игру</StartGameButton>
        </StartGameButtonContainer>
      </Form>
    </FormBlock>
  )
})

const FormBlock = styled.div`
  position: relative;
  width: 640px;
  height: 700px;
  padding: 15px 22px;
  background: ${colors.mainLight};
  box-shadow: 0px 0px 25px 7px ${colors.shadow};
  ${doubleBorderStyle}
`
const Form = styled.form`
  position: relative;
  height: 100%;
`
const InputContainer = styled.div`
  position: relative;
  margin-bottom: 50px;
`
const Input = styled(PixelatedInput).attrs({
  pixelsSize: 'medium',
  backgroundColor: colors.mainMedium,
  containerStyles: {
    width: '92%',
  },
})`
  padding: 7px 5px;
  font-size: 28px;
  font-weight: bold;
`
const ExclamationMarkContainer = styled(PixelatedDiv).attrs({
  pixelsSize: 'small',
  backgroundColor: colors.error,
})`
  position: absolute;
  right: 0;
  top: 3px;
  width: 24px;
  height: 38px;
  font-size: 30px;
  text-align: center;
  color: #ffffff;
`
const ExclamationMark = styled.div`
  position: absolute;
  left: 10px;
`
const StartGameButtonContainer = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
`
const StartGameButton = styled(PixelatedButton).attrs({
  pixelsSize: 'medium',
  backgroundColor: colors.mainMedium,
})`
  font-size: 26px;
  padding: 8px;
  margin-top: 10px;
`
