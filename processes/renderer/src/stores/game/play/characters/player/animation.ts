import { AnimationConfigs } from '../../entities/animation-controller'
import {
  CharacterMovementAnimationName,
  GetCharacterMovementAnimationConfig,
  getCharacterMovementAnimationConfigs,
} from '../animation'

export type PlayerCharacterAnimationName = CharacterMovementAnimationName

export const playerCharacterWalkFramesPerSprite = 11

const playerCharacterMovementAnimationConfig: Pick<
  GetCharacterMovementAnimationConfig,
  'framesPerSprite'
> = {
  framesPerSprite: playerCharacterWalkFramesPerSprite,
}

export const getPlayerCharacterAnimationConfigs = (
  config: Omit<GetCharacterMovementAnimationConfig, 'framesPerSprite'>,
): AnimationConfigs<PlayerCharacterAnimationName> => {
  return getCharacterMovementAnimationConfigs({ ...config, ...playerCharacterMovementAnimationConfig })
}
