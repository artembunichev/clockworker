import {
  DefaultCharacterAnimationName,
  DefaultCharacterAnimationRegulatorName,
  ShortCharacterMovementAnimationConfig,
  getCharacterMovementAnimationConfigsForController,
} from '../../animation';

export type PlayerCharacterAnimationName = DefaultCharacterAnimationName;
export type PlayerCharacterAnimationRegulatorName = DefaultCharacterAnimationRegulatorName;

const playerCharacterMovementAnimationConfig: ShortCharacterMovementAnimationConfig = {
  initialScale: 2.5,
  framesPerSprite: 11,
};

export const playerCharacterAnimationConfigs = getCharacterMovementAnimationConfigsForController(
  playerCharacterMovementAnimationConfig,
);
