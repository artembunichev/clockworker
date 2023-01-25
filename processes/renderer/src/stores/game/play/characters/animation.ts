import { Modifier } from 'project-utility-types/abstract'

import {
  AnimationConfigForController,
  AnimationConfigsForController,
  AnimationController,
  ViewDirections,
} from '../entities/animation-controller'
import { AnimationSequence } from '../entities/animation/animation'
import { AnimationRLType, AnimationRegulatorList } from '../entities/animation/regulators'
import { getRowSequence } from '../lib/animation'

export type CharacterMovementAnimationName = 'walkDown' | 'walkRight' | 'walkUp' | 'walkLeft'

export type DefaultCharacterAnimationName = CharacterMovementAnimationName

export type CharacterAnimationName<AnimationName extends string> =
  | DefaultCharacterAnimationName
  | AnimationName

export type DefaultCharacterAnimationRegulatorName = 'speedup'

export type DefaultCharacterAnimationRL =
  AnimationRegulatorList<DefaultCharacterAnimationRegulatorName>

export const defaultCharacterAnimationRegulatorList: DefaultCharacterAnimationRL = {
  speedup: {
    framesPerSprite: ((prev) => Math.round(prev * 0.55)) as Modifier<number>,
  },
}

export type CharacterAnimationRegulatorList<RL extends AnimationRLType> = RL extends never
  ? DefaultCharacterAnimationRL
  : DefaultCharacterAnimationRL & RL

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

export type DefaultCharacterAnimationController = AnimationController<
  DefaultCharacterAnimationName,
  DefaultCharacterAnimationRL
>
