import { RegulatorList, RegulatorTargetsInitialValues } from '../regulators'

export const animationRegulatorTargets = ['framesPerSprite'] as const
export type AnimationRegulatorTarget = typeof animationRegulatorTargets[number]

export type AnimationRLType = RegulatorList<string, AnimationRegulatorTarget> | never

export type AnimationRegulatorList<RegulatorName extends string> = RegulatorList<
  RegulatorName,
  AnimationRegulatorTarget
>

export const regulatorTargetsInitialValues: RegulatorTargetsInitialValues<AnimationRegulatorTarget> = {
  framesPerSprite: 'baseFramesPerSprite',
}
