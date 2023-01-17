import { PrimitiveDirection } from 'project-utility-types/plane'

import { ProhibitorsController } from 'stores/game/play/entities/prohibitors-controller'
import {
  GameSettings,
  MovementControllersKeys,
  MovementRegulatorsKeys,
} from 'stores/game/play/settings/settings'

import { last } from 'lib/arrays'

type Config = {
  settings: GameSettings
}

export class PlayerCharacterMovementKeys {
  private settings: GameSettings

  constructor(config: Config) {
    const { settings } = config
    this.settings = settings
  }

  prohibitorsController = new ProhibitorsController()

  pressedKeys: Array<string> = []
  setPressedKeys = (keys: Array<string>): void => {
    this.pressedKeys = keys
  }

  //! контроллеры
  get controllerKeys(): MovementControllersKeys {
    return this.settings.current.movementControllers
  }
  isControllerKey = (key: string): boolean => {
    return Object.values(this.controllerKeys).some((controller) => key === controller)
  }

  get pressedControllers(): Array<string> {
    return this.pressedKeys.slice().reverse().filter(this.isControllerKey)
  }
  get pressedDirections(): Array<PrimitiveDirection> {
    return this.pressedControllers.map((controller) =>
      controller === this.controllerKeys.down
        ? 'down'
        : controller === this.controllerKeys.right
        ? 'right'
        : controller === this.controllerKeys.up
        ? 'up'
        : 'left',
    )
  }

  get isControllerPressed(): boolean {
    return this.pressedControllers.length !== 0
  }
  get isMoveDownControllerPressed(): boolean {
    return this.pressedControllers.includes(this.controllerKeys.down)
  }
  get isMoveRightControllerPressed(): boolean {
    return this.pressedControllers.includes(this.controllerKeys.right)
  }
  get isMoveUpControllerPressed(): boolean {
    return this.pressedControllers.includes(this.controllerKeys.up)
  }
  get isMoveLeftControllerPressed(): boolean {
    return this.pressedControllers.includes(this.controllerKeys.left)
  }

  //! регуляторы
  get regulatorKeys(): MovementRegulatorsKeys {
    return this.settings.current.movementRegulators
  }
  isRegulatorKey = (key: string): boolean => {
    return Object.values(this.regulatorKeys).some((regulator) => key === regulator)
  }

  get pressedRegulators(): Array<string> {
    return this.pressedKeys.filter(this.isRegulatorKey)
  }
  get isRegulatorKeysPressed(): boolean {
    return this.pressedRegulators.length > 0
  }
  get lastPressedRegulator(): string {
    return last(this.pressedRegulators)
  }

  get isSprintKeyPressed(): boolean {
    return this.lastPressedRegulator === this.regulatorKeys.sprint
  }
}
