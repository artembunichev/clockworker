import {
  CharacterMovement,
  ConfigForCharacterMovement,
} from 'stores/game/play/characters/movement/movement'
import { CharacterMovementStateConfig } from 'stores/game/play/characters/movement/state'
import { getSingleMovementDirection } from 'stores/game/play/lib/movement'
import { GameSettings } from 'stores/game/play/settings/settings'
import { KeyboardStore } from 'stores/keyboard.store'

import { RunAutomove } from '../../../movement/automove'
import { PlayerCharacterMovementKeys } from './keys'

export const initialPlayerCharacterMovementStateConfig: CharacterMovementStateConfig = {
  baseStepSize: 1.8,
}

type PlayerCharacterMovementConfig = ConfigForCharacterMovement & {
  settings: GameSettings
}

export class PlayerCharacterMovement extends CharacterMovement {
  private settings: GameSettings

  keys: PlayerCharacterMovementKeys

  constructor(config: PlayerCharacterMovementConfig) {
    const { position, animationController, initialMovementStateConfig, settings } = config

    super({
      position,
      animationController,
      initialMovementStateConfig,
    })

    this.settings = settings

    // клавиши управления
    this.keys = new PlayerCharacterMovementKeys({ settings: this.settings })

    // автомув
    const superAutomoveRun = this.automove.run

    const runAutomove: RunAutomove = (config: any) => {
      this.keys.prohibitorsController.add('automove')
      return superAutomoveRun(config).then((response) => {
        this.keys.prohibitorsController.remove('automove')
        return response
      })
    }

    this.automove.run = runAutomove
  }

  //! обработка клавиш управления
  handleMovementKeys = (keyboard: KeyboardStore): void => {
    if (!this.keys.prohibitorsController.isProhibited) {
      const prevPressedControllersLength = this.keys.pressedControllers.length

      this.keys.setPressedKeys(keyboard.pressedKeysArray)

      // остановить движение только в момент, когда была отпущена последняя клавиша движения
      if (this.keys.pressedControllers.length === 0 && prevPressedControllersLength > 0) {
        this.stopMove()
      } else {
        if (this.keys.isControllerPressed) {
          // проверка на нажатие регуляторов
          if (this.keys.isRegulatorKeysPressed) {
            if (this.keys.isSprintKeyPressed) {
              this.startSprint()
            }
          } else {
            this.endSprint()
          }

          const movementDirection = getSingleMovementDirection(this.keys.pressedDirections)

          if (movementDirection) {
            if (!this.isMovementProhibited) {
              this.animationController.resume()
              this.moveWithAnimation({
                direction: movementDirection,
                stateConfig: initialPlayerCharacterMovementStateConfig,
              })
            }
          } else {
            this.stopMove()
          }
        }
      }
    } else {
      if (
        this.keys.prohibitorsController.list.every(
          (p) => p !== 'automove' && p !== 'pause' && p !== 'textbox',
        )
      ) {
        // когда клавиши заблокированы автомувом - анимация продолжается
        // всё, кроме паузы и текстбокса полностью прекращает анимацию
        this.animationController.stop()
      } else if (this.keys.prohibitorsController.list.some((p) => p === 'pause' || p === 'textbox')) {
        // когда игра на паузе или открыт текстбокс - анимация замирает
        this.animationController.pause()
      }
    }
  }
}
