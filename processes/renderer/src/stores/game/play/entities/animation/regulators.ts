import { PickKeyof } from 'process-shared/types/basic-utility-types'

import { RegulatorList, RegulatorTargetsInitialValues } from '../regulators'
import { Animation } from './animation'

export type AnimationRegulatorTarget = PickKeyof<Animation, 'framesPerSprite'>

export type AnimationRegulatorList<RegulatorName extends string> = RegulatorList<
  Animation,
  RegulatorName,
  AnimationRegulatorTarget
>

export const regulatorTargetsInitialValues: RegulatorTargetsInitialValues<
  Animation,
  AnimationRegulatorTarget
> = {
  framesPerSprite: 'baseFramesPerSprite',
}
