import { CharacterMovementState } from 'stores/game/play/characters/movement/state'

type Regulator = {
  stepSizeMultiplier: number
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
      stepSizeMultiplier: 1.88,
    },
  }

  activeRegulatorNames: Array<RegulatorName> = []

  private applyActiveRegulators = (): void => {
    const { baseStepSize } = this.currentMovementState

    const newStepSize = this.activeRegulatorNames.reduce((acc, regulatorName) => {
      const regulator = this.list[regulatorName]
      return acc * regulator.stepSizeMultiplier
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
    this.activeRegulatorNames = this.activeRegulatorNames.filter((n) => n !== regulatorName)
    this.applyActiveRegulators()
  }
}
