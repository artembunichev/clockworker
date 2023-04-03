import { AnimationSequence } from '../entities/animation'
import {
  AnimationConfigForController,
  AnimationConfigsForController,
  AnimationController,
  ViewDirections
} from '../entities/animation-controller'
import { AnimationRegulatorList } from '../entities/animation/regulators'
import { getRowSequence } from '../lib/animation'

export type CharacterMovementAnimationName = 'walkDown' | 'walkRight' | 'walkUp' | 'walkLeft'
export type DefaultCharacterAnimationName = CharacterMovementAnimationName
export type CharacterAnimationName<Name extends string> = DefaultCharacterAnimationName | Name

export type DefaultCharacterAnimationRegulatorName = 'speedup' | 'slowdown'
export type CharacterAnimationRegulatorName<Name extends string> =
  | DefaultCharacterAnimationRegulatorName
  | Name

type DefaultCharacterAnimationRL = AnimationRegulatorList<DefaultCharacterAnimationRegulatorName>

export type CharacterAnimationRegulatorList<RegulatorName extends string> = RegulatorName extends never
  ? DefaultCharacterAnimationRL
  : AnimationRegulatorList<DefaultCharacterAnimationRegulatorName | RegulatorName>

export const defaultCharacterAnimationRegulatorList: DefaultCharacterAnimationRL = {
  speedup: {
    framesPerSprite: ( prev ) => Math.round( prev * 0.55 ),
  },
  slowdown: {
    framesPerSprite: ( prev ) => Math.round( prev * 1.3 ),
  },
}

export type ShortCharacterMovementAnimationConfig = Omit<
  AnimationConfigForController,
  'sequence' | 'startFrom'
>

const getCharacterMovementAnimationSequence = ( direction: ViewDirections ): AnimationSequence => {
  return getRowSequence( direction, 4 )
}

const getCharacterMovementAnimationConfigForController = (
  direction: ViewDirections,
  shortConfig: ShortCharacterMovementAnimationConfig,
): AnimationConfigForController => {
  const sequence: AnimationSequence = getCharacterMovementAnimationSequence( direction )

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
    walkDown: getCharacterMovementAnimationConfigForController( ViewDirections.DOWN, config ),
    walkRight: getCharacterMovementAnimationConfigForController( ViewDirections.RIGHT, config ),
    walkUp: getCharacterMovementAnimationConfigForController( ViewDirections.UP, config ),
    walkLeft: getCharacterMovementAnimationConfigForController( ViewDirections.LEFT, config ),
  }
}

export type CharacterAnimationController<
  AnimationName extends string,
  RegulatorName extends string = never,
> = AnimationController<
  CharacterAnimationName<AnimationName>,
  CharacterAnimationRegulatorName<RegulatorName>
>

export type DefaultCharacterAnimationController = AnimationController<
  DefaultCharacterAnimationName,
  DefaultCharacterAnimationRegulatorName
>
