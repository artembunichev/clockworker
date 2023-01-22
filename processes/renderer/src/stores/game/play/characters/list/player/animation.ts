import { Modifier } from 'project-utility-types/abstract'

import {
  CharacterMovementAnimationName,
  GetCharacterMovementAnimationConfig,
  getCharacterMovementAnimationConfigs,
} from 'stores/game/play/characters/animation'
import { AnimationConfigs } from 'stores/game/play/entities/animation-controller'

export type PlayerCharacterAnimationName = CharacterMovementAnimationName

const playerCharacterMovementAnimationConfig: Pick<
  GetCharacterMovementAnimationConfig,
  'framesPerSprite' | 'regulators'
> = {
  framesPerSprite: 11,
  regulators: {
    sprint: {
      framesPerSprite: ((prev) => Math.round(prev * 0.55)) as Modifier<number>,
    },
  },
}

export const getPlayerCharacterAnimationConfigs = (
  config: Omit<GetCharacterMovementAnimationConfig, 'framesPerSprite'>,
): AnimationConfigs<PlayerCharacterAnimationName> => {
  return getCharacterMovementAnimationConfigs({ ...config, ...playerCharacterMovementAnimationConfig })
}
