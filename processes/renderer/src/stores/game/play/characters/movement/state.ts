export type CharacterMovementStateConfig = {
  baseStepSize: number
}

export class CharacterMovementState {
  baseStepSize: number
  stepSize: number

  constructor(config: CharacterMovementStateConfig) {
    const { baseStepSize } = config
    this.setBaseStepSize(baseStepSize)
  }

  setBaseStepSize = (baseStepSize: number): void => {
    this.baseStepSize = baseStepSize
  }
  setStepSize = (stepSize: number): void => {
    this.stepSize = stepSize
  }
}
