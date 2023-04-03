import { PickKeyof } from 'shared/types/basic-utility-types'
import { Animation } from '.'
import { RegulatorList, RegulatorTargetsInitialValues } from '../regulators'

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
