import { Modifier } from 'project-utility-types/abstract'

import {
  RegulatorInitialValues,
  RegulatorList,
  Regulators,
} from 'stores/game/play/entities/regulators'

import { areEquivalent } from 'lib/are-equivalent'

type RegulatorName = 'sprint'

const regulatorTargets = ['currentStepSize'] as const
type RegulatorTarget = typeof regulatorTargets[number]

const initialValues: RegulatorInitialValues<RegulatorTarget> = {
  currentStepSize: 'baseStepSize',
}

const characterMovementRegulatorList: RegulatorList<RegulatorName, RegulatorTarget> = {
  sprint: {
    currentStepSize: ((prev) => prev * 1.88) as Modifier<number>,
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
    initialValues,
  })

  get currentValue(): CharacterMovementStateValue {
    return {
      stepSize: this.currentStepSize,
    }
  }
}
