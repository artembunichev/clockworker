import { Modifier } from 'project-utility-types/abstract'

import { CharacterMovementState } from 'stores/game/play/characters/movement/state'

import { remove } from 'lib/arrays'

type Regulator = {
  stepSize: Modifier<number>
}

type RegulatorName = 'sprint'
type Regulators = Record<RegulatorName, Regulator>

type Config = {
  currentMovementState: CharacterMovementState
}

export class CharacterMovementRegulators {
  private currentMovementState: CharacterMovementState

  constructor(config: Config) {
    const { currentMovementState } = config
    this.currentMovementState = currentMovementState
  }

  list: Regulators = {
    sprint: {
      stepSize: (prev) => prev * 1.88,
    },
  }

  activeRegulatorNames: Array<RegulatorName> = []

  private applyActiveRegulators = (): void => {
    const { baseStepSize } = this.currentMovementState.value

    const newStepSize = this.activeRegulatorNames.reduce((acc, regulatorName) => {
      const regulator = this.list[regulatorName]

      if (regulator.stepSize instanceof Function) {
        return regulator.stepSize(this.currentMovementState.stepSize)
      } else {
        return regulator.stepSize
      }
    }, baseStepSize)

    this.currentMovementState.setStepSize(newStepSize)
  }

  isRegulatorActive = (regulatorName: RegulatorName): boolean => {
    return this.activeRegulatorNames.includes(regulatorName)
  }

  apply = (regulatorName: RegulatorName): void => {
    if (!this.isRegulatorActive(regulatorName)) {
      this.activeRegulatorNames.push(regulatorName)
      this.applyActiveRegulators()
    }
  }
  remove = (regulatorName: RegulatorName): void => {
    this.activeRegulatorNames = remove(this.activeRegulatorNames, regulatorName)
    this.applyActiveRegulators()
  }
}
