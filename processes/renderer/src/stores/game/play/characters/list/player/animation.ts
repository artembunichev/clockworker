import {
  CharacterMovementAnimationName,
  DefaultCharacterAnimationRL,
  ShortCharacterMovementAnimationConfig,
  getCharacterMovementAnimationConfigsForController,
} from '../../animation'

export type PlayerCharacterAnimationName = CharacterMovementAnimationName
export type PlayerCharacterAnimationRegulatorList = DefaultCharacterAnimationRL

const playerCharacterMovementAnimationConfig: ShortCharacterMovementAnimationConfig = {
  initialScale: 2.5,
  framesPerSprite: 11,
}

export const playerCharacterAnimationConfigs = getCharacterMovementAnimationConfigsForController(
  playerCharacterMovementAnimationConfig,
)
