import { AnimationSequence } from '../entities/animation'
import {
  AnimationConfigNoNameNoSpriteSheet,
  AnimationConfigs,
  ViewDirections,
} from '../entities/animation-controller'
import { getRowSequence } from '../lib/animation'

export type CharacterMovementAnimationName = 'walkDown' | 'walkRight' | 'walkUp' | 'walkLeft'

export type GetCharacterMovementAnimationConfig = Omit<
  AnimationConfigNoNameNoSpriteSheet,
  'sequence' | 'startFrom'
>

const getCharacterMovementAnimationSequence = (direction: ViewDirections): AnimationSequence => {
  return getRowSequence(direction, 4)
}

const getCharacterMovementAnimationConfig = (
  direction: ViewDirections,
  template: GetCharacterMovementAnimationConfig,
): AnimationConfigNoNameNoSpriteSheet => {
  const sequence: AnimationSequence = getCharacterMovementAnimationSequence(direction)

  // начинаем со 2-го спрайта, чтобы сразу после начала движения была анимация шага
  return { ...template, sequence, startFrom: 1 }
}

// возвращает список с анимациями движения, одинаковыми для всех персонажей
export const getCharacterMovementAnimationConfigs = (
  config: GetCharacterMovementAnimationConfig,
): AnimationConfigs<CharacterMovementAnimationName> => {
  return {
    walkDown: getCharacterMovementAnimationConfig(ViewDirections.DOWN, config),
    walkRight: getCharacterMovementAnimationConfig(ViewDirections.RIGHT, config),
    walkUp: getCharacterMovementAnimationConfig(ViewDirections.UP, config),
    walkLeft: getCharacterMovementAnimationConfig(ViewDirections.LEFT, config),
  }
}
