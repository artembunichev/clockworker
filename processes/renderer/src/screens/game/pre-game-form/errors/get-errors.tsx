import { DeepRequired, FieldErrorsImpl } from 'react-hook-form'

import { PreGameFormFields } from 'stores/game/pre-game-form'

type FieldError = {
  value: boolean
  message: string
}

export type FieldErrors = {
  isError: boolean
  isEmpty: FieldError
  isShort: FieldError
  isSpecSymbols: FieldError
}

type GetFormErrorsReturn = {
  [_ in keyof PreGameFormFields]: FieldErrors
}

export const getFormErrors = (
  errors: FieldErrorsImpl<DeepRequired<PreGameFormFields>>,
): GetFormErrorsReturn => {
  const isPlayerCharacterNameError = Boolean(errors.playerCharacterName)
  const isPlayerCharacterNameEmpty = errors.playerCharacterName?.type === 'required'
  const playerCharacterNameEmptyMessage = 'Вы не указали имя своего персонажа'
  const isPlayerCharacterNameShort = errors.playerCharacterName?.type === 'minLength'
  const playerCharacterNameShortMessage = 'Слишком короткое имя для персонажа'
  const isPlayerCharacterNameSpecSymbols = errors.playerCharacterName?.type === 'validate'
  const playerCharacterNameSpecSymbolsMessage = 'Имя персонажа содержит недопустимые символы'

  const isMarketNameError = Boolean(errors.marketName)
  const isMarketNameEmpty = errors.marketName?.type === 'required'
  const marketNameEmptyMessage = 'Вы не указали название магазина'
  const isMarketNameShort = errors.marketName?.type === 'minLength'
  const marketNameShortMessage = 'Название магазина слишком короткое'
  const isMarketNameSpecSymbols = errors.marketName?.type === 'validate'
  const marketNameSpecSymbolsMessage = 'Название магазина содержит недопустимые символы'

  return {
    playerCharacterName: {
      isError: isPlayerCharacterNameError,
      isEmpty: {
        value: isPlayerCharacterNameEmpty,
        message: playerCharacterNameEmptyMessage,
      },
      isShort: {
        value: isPlayerCharacterNameShort,
        message: playerCharacterNameShortMessage,
      },
      isSpecSymbols: {
        value: isPlayerCharacterNameSpecSymbols,
        message: playerCharacterNameSpecSymbolsMessage,
      },
    },
    marketName: {
      isError: isMarketNameError,
      isEmpty: {
        value: isMarketNameEmpty,
        message: marketNameEmptyMessage,
      },
      isShort: {
        value: isMarketNameShort,
        message: marketNameShortMessage,
      },
      isSpecSymbols: {
        value: isMarketNameSpecSymbols,
        message: marketNameSpecSymbolsMessage,
      },
    },
  }
}
