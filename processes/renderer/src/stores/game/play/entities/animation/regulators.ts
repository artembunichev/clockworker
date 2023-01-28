import { PickKeyof } from 'process-shared/types/basic-utility-types'

import { RegulatorList, RegulatorTargetsInitialValues } from '../regulators'
import { Animation } from './animation'

export type AnimationRegulatorTarget = PickKeyof<Animation, 'framesPerSprite'>

export type AnimationRLType = RegulatorList<string, AnimationRegulatorTarget> | never

export type AnimationRegulatorList<RegulatorName extends string> = RegulatorList<
  RegulatorName,
  AnimationRegulatorTarget
>

export const regulatorTargetsInitialValues: RegulatorTargetsInitialValues<
  Animation,
  AnimationRegulatorTarget
> = {
  framesPerSprite: 'baseFramesPerSprite',
}
