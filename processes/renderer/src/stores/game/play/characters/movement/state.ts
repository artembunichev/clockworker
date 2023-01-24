import { Modifier } from 'project-utility-types/abstract'

import {
  RegulatorList,
  RegulatorTargetsInitialValues,
  Regulators,
} from 'stores/game/play/entities/regulators'

import { areEquivalent } from 'lib/are-equivalent'

export type CharacterMovementRegulatorName = 'sprint'

const regulatorTargets = ['currentStepSize'] as const
type RegulatorTarget = typeof regulatorTargets[number]

const regulatorTargetsInitialValues: RegulatorTargetsInitialValues<RegulatorTarget> = {
  currentStepSize: 'baseStepSize',
}

const characterMovementRegulatorList: RegulatorList<CharacterMovementRegulatorName, RegulatorTarget> =
  {
    sprint: {
      currentStepSize: ((prev) => prev * 2.1) as Modifier<number>,
    },
  }

export type CharacterMovementStateValue = {
  stepSize: number
}

export type CharacterMovementStateConfig = { baseStepSize: number }

export class CharacterMovementState {
  private baseStepSize: number
  private currentStepSize: number

  config: CharacterMovementStateConfig

  constructor(initialConfig: CharacterMovementStateConfig) {
    this.setConfig(initialConfig)
  }

  setBaseStepSize = (stepSize: number): void => {
    this.baseStepSize = stepSize
    if (!this.currentStepSize) {
      this.currentStepSize = this.baseStepSize
    }
    this.regulators.modifyAllRegulatorTargets()
  }

  setConfig = (config: CharacterMovementStateConfig): void => {
    if (!this.config || !areEquivalent(this.config, config)) {
      this.config = config
      const { baseStepSize } = config
      this.setBaseStepSize(baseStepSize)
    }
  }

  regulators = new Regulators({
    list: characterMovementRegulatorList,
    sourceObject: this,
    targetsInitialValues: regulatorTargetsInitialValues,
  })

  get currentValue(): CharacterMovementStateValue {
    return {
      stepSize: this.currentStepSize,
    }
  }
}
