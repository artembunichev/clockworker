import { Modifier } from 'project-utility-types/abstract'

import { areEquivalent } from 'lib/are-equivalent'
import { remove } from 'lib/arrays'

type Regulator = {
  stepSize: Modifier<number>
}

type RegulatorName = 'sprint'
type Regulators = Record<RegulatorName, Regulator>

export type CharacterMovementStateValue = {
  stepSize: number
}

export type CharacterMovementStateConfig = { baseStepSize: number }

export class CharacterMovementState {
  private baseStepSize: number

  config: CharacterMovementStateConfig

  constructor(initialConfig: CharacterMovementStateConfig) {
    this.setConfig(initialConfig)
  }

  setBaseStepSize = (stepSize: number): void => {
    this.baseStepSize = stepSize
    this.recalculateCurrentStepSize()
  }

  setConfig = (config: CharacterMovementStateConfig): void => {
    if (!this.config || !areEquivalent(this.config, config)) {
      this.config = config
      const { baseStepSize } = config
      this.setBaseStepSize(baseStepSize)
    }
  }

  private regulators: Regulators = {
    sprint: {
      stepSize: (prev) => prev * 1.88,
    },
  }

  activeRegulatorNames: Array<RegulatorName> = []

  isRegulatorActive = (regulatorName: RegulatorName): boolean => {
    return this.activeRegulatorNames.includes(regulatorName)
  }

  applyRegulator = (regulatorName: RegulatorName): void => {
    if (!this.isRegulatorActive(regulatorName)) {
      this.activeRegulatorNames.push(regulatorName)
      this.recalculateCurrentStepSize()
    }
  }
  removeRegulator = (regulatorName: RegulatorName): void => {
    if (this.activeRegulatorNames.includes(regulatorName)) {
      this.activeRegulatorNames = remove(this.activeRegulatorNames, regulatorName)
      this.recalculateCurrentStepSize()
    }
  }

  private currentStepSize: number
  private setCurrentStepSize = (stepSize: number): void => {
    this.currentStepSize = stepSize
  }
  private recalculateCurrentStepSize = (): void => {
    const newStepSize = this.activeRegulatorNames.reduce((_, regulatorName) => {
      const regulator = this.regulators[regulatorName]

      if (regulator.stepSize instanceof Function) {
        return regulator.stepSize(this.currentStepSize)
      } else {
        return regulator.stepSize
      }
    }, this.baseStepSize)
    this.setCurrentStepSize(newStepSize)
  }

  get currentValue(): CharacterMovementStateValue {
    return {
      stepSize: this.currentStepSize,
    }
  }
}
