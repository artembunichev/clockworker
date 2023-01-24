import { Modifier } from 'project-utility-types/abstract'

import { AnimationRLType, AnimationRegulatorList, AnimationSequence } from '../entities/animation'
import {
  AnimationConfigForController,
  AnimationConfigsForController,
  AnimationController,
  ViewDirections,
} from '../entities/animation-controller'
import { getRowSequence } from '../lib/animation'

export type CharacterMovementAnimationName = 'walkDown' | 'walkRight' | 'walkUp' | 'walkLeft'

export type CharacterAnimationName<AnimationName extends string> =
  | CharacterMovementAnimationName
  | AnimationName

export type CharacterAnimationRegulatorName = 'sprint'

export type DefaultCharacterAnimationRL = AnimationRegulatorList<CharacterAnimationRegulatorName>

export const defaultCharacterAnimationRegulatorList: DefaultCharacterAnimationRL = {
  sprint: {
    framesPerSprite: ((prev) => Math.round(prev * 0.55)) as Modifier<number>,
  },
}

export type CharacterAnimationRegulatorList<RL extends AnimationRLType> = DefaultCharacterAnimationRL &
  RL

export type ShortCharacterMovementAnimationConfig = Omit<
  AnimationConfigForController,
  'sequence' | 'startFrom'
>

const getCharacterMovementAnimationSequence = (direction: ViewDirections): AnimationSequence => {
  return getRowSequence(direction, 4)
}

const getCharacterMovementAnimationConfigForController = (
  direction: ViewDirections,
  shortConfig: ShortCharacterMovementAnimationConfig,
): AnimationConfigForController => {
  const sequence: AnimationSequence = getCharacterMovementAnimationSequence(direction)

  const configForController: AnimationConfigForController = {
    ...shortConfig,
    sequence,
    // начинаем со 2-го спрайта, чтобы сразу после начала движения была анимация шага
    startFrom: 1,
  }

  return configForController
}

export type CharacterAnimationConfigsForController =
  AnimationConfigsForController<CharacterMovementAnimationName>

// возвращает список с анимациями движения, одинаковыми для всех персонажей
export const getCharacterMovementAnimationConfigsForController = (
  config: ShortCharacterMovementAnimationConfig,
): CharacterAnimationConfigsForController => {
  return {
    walkDown: getCharacterMovementAnimationConfigForController(ViewDirections.DOWN, config),
    walkRight: getCharacterMovementAnimationConfigForController(ViewDirections.RIGHT, config),
    walkUp: getCharacterMovementAnimationConfigForController(ViewDirections.UP, config),
    walkLeft: getCharacterMovementAnimationConfigForController(ViewDirections.LEFT, config),
  }
}

export type CharacterAnimationController<
  AnimationName extends string,
  AnimationRL extends AnimationRLType = never,
> = AnimationController<
  CharacterAnimationName<AnimationName>,
  CharacterAnimationRegulatorList<AnimationRL>
>
