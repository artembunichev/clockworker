import { PrimitiveDirection } from 'project-utility-types/plane'

import { ProhibitorsController } from 'stores/game/play/entities/prohibitors-controller'
import { MovementControllersKeys, MovementRegulatorsKeys } from 'stores/game/play/settings/settings'
import { KeyboardStore } from 'stores/keyboard.store'

import { last } from 'lib/arrays'

import { PlayerCharacterMovementSettings } from './movement'

type Config = {
  keyboard: KeyboardStore
  settings: PlayerCharacterMovementSettings
}

export class PlayerCharacterMovementKeys {
  private keyboard: KeyboardStore
  private settings: PlayerCharacterMovementSettings

  constructor(config: Config) {
    const { keyboard, settings } = config

    this.keyboard = keyboard
    this.settings = settings
  }

  prohibitorsController = new ProhibitorsController()

  pressedKeys: Array<string> = []
  updatePressedKeys = (): void => {
    this.pressedKeys = this.keyboard.pressedKeysArray
  }

  //! контроллеры
  get controllerKeys(): MovementControllersKeys {
    return this.settings.values.movementControllers
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
    return this.settings.values.movementRegulators
  }
  isRegulatorKey = (key: string): boolean => {
    return Object.values(this.regulatorKeys).some((regulator) => key === regulator)
  }

  get pressedRegulators(): Array<string> {
    return this.pressedKeys.filter(this.isRegulatorKey)
  }
  get lastPressedRegulator(): string {
    return last(this.pressedRegulators)
  }

  get isSprintKeyPressed(): boolean {
    return this.lastPressedRegulator === this.regulatorKeys.sprint
  }
}
