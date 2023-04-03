import { PrimitiveDirection } from 'project-utility-types/plane'
import { last } from 'shared/lib/arrays'
import { objectValues } from 'shared/lib/objects'
import { ProhibitorsController } from 'stores/game/play/entities/prohibitors-controller'
import { MovementControllersKeys, MovementRegulatorsKeys } from 'stores/game/play/settings'
import { KeyboardStore } from 'stores/keyboard.store'
import { PlayerCharacterMovementSettings } from '.'

type Config = {
  keyboard: KeyboardStore
  settings: PlayerCharacterMovementSettings
}

export class PlayerCharacterMovementKeys {
  private keyboard: KeyboardStore
  private settings: PlayerCharacterMovementSettings

  pressedKeys: Array<string> = [];
  prohibitorsController = new ProhibitorsController();

  constructor( config: Config ) {
    const { keyboard, settings } = config

    this.keyboard = keyboard
    this.settings = settings
  }

  updatePressedKeys = (): void => {
    this.pressedKeys = this.keyboard.pressedKeysArray
  };

  isControllerKey = ( key: string ): boolean => {
    return objectValues( this.controllerKeys ).some( ( controller ) => key === controller )
  };

  isRegulatorKey = ( key: string ): boolean => {
    return objectValues( this.regulatorKeys ).some( ( regulator ) => key === regulator )
  };

  // контроллеры
  get controllerKeys(): MovementControllersKeys {
    return this.settings.values.movementControllers
  }
  get pressedControllers(): Array<string> {
    return this.pressedKeys.slice().reverse().filter( this.isControllerKey )
  }
  get pressedDirections(): Array<PrimitiveDirection> {
    return this.pressedControllers.map( ( controller ) =>
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
    return this.pressedControllers.includes( this.controllerKeys.down )
  }
  get isMoveRightControllerPressed(): boolean {
    return this.pressedControllers.includes( this.controllerKeys.right )
  }
  get isMoveUpControllerPressed(): boolean {
    return this.pressedControllers.includes( this.controllerKeys.up )
  }
  get isMoveLeftControllerPressed(): boolean {
    return this.pressedControllers.includes( this.controllerKeys.left )
  }

  // регуляторы
  get regulatorKeys(): MovementRegulatorsKeys {
    return this.settings.values.movementRegulators
  }

  get pressedRegulators(): Array<string> {
    return this.pressedKeys.filter( this.isRegulatorKey )
  }
  get lastPressedRegulator(): string {
    return last( this.pressedRegulators )
  }

  get isSprintKeyPressed(): boolean {
    return this.lastPressedRegulator === this.regulatorKeys.sprint
  }
}
