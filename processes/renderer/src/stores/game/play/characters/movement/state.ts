export type CharacterMovementStateValue = {
  stepSize: number
  baseStepSize: number
}

export type CharacterMovementStateConfig = Pick<CharacterMovementStateValue, 'baseStepSize'>

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

  get value(): CharacterMovementStateValue {
    return {
      stepSize: this.stepSize,
      baseStepSize: this.baseStepSize,
    }
  }
}
