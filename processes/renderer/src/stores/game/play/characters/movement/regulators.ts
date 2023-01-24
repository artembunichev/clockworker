import { Modifier } from 'project-utility-types/abstract'

import { RegulatorList, RegulatorTargetsInitialValues } from '../../entities/regulators'

export type CharacterMovementRegulatorName = 'sprint'

const characterMovementRegulatorTargets = ['currentStepSize'] as const
type CharacterMovementRegulatorTarget = typeof characterMovementRegulatorTargets[number]

export const characterMovementRegulatorTargetsInitialValues: RegulatorTargetsInitialValues<CharacterMovementRegulatorTarget> =
  {
    currentStepSize: 'baseStepSize',
  }

export const characterMovementRegulatorList: RegulatorList<
  CharacterMovementRegulatorName,
  CharacterMovementRegulatorTarget
> = {
  sprint: {
    currentStepSize: ((prev) => prev * 2.1) as Modifier<number>,
  },
}
