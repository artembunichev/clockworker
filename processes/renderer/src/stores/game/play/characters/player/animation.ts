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
  'framesPerSprite' | 'regulators'
> = {
  framesPerSprite: playerCharacterWalkFramesPerSprite,
  regulators: {
    sprint: {
      framesPerSpriteMultiplier: 0.55,
    },
  },
}

export const getPlayerCharacterAnimationConfigs = (
  config: Omit<GetCharacterMovementAnimationConfig, 'framesPerSprite'>,
): AnimationConfigs<PlayerCharacterAnimationName> => {
  return getCharacterMovementAnimationConfigs({ ...config, ...playerCharacterMovementAnimationConfig })
}
