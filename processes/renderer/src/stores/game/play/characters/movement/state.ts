import { areEquivalent } from 'lib/are-equivalent'

import { Regulators } from '../../entities/regulators'
import {
  characterMovementRegulatorList,
  characterMovementRegulatorTargetsInitialValues,
} from './regulators'

export type CharacterMovementStateValue = {
  stepSize: number
}

export type CharacterMovementStateConfig = { baseStepSize: number }

export class CharacterMovementState {
  baseStepSize: number
  currentStepSize: number
  config: CharacterMovementStateConfig

  regulators = new Regulators({
    list: characterMovementRegulatorList,
    sourceObject: this,
    targetsInitialValues: characterMovementRegulatorTargetsInitialValues,
  })

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

  get currentValue(): CharacterMovementStateValue {
    return {
      stepSize: this.currentStepSize,
    }
  }
}
