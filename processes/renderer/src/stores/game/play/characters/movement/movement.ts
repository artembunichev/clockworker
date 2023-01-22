import { ExpandedDirection, XY } from 'project-utility-types/plane'

import {
  CharacterMovementState,
  CharacterMovementStateConfig,
} from 'stores/game/play/characters/movement/state'

import { areEquivalent } from 'lib/are-equivalent'
import { capitalizeFirstSymbol } from 'lib/strings'

import { AnimationController } from '../../entities/animation-controller'
import { Position } from '../../entities/position'
import { ProhibitorsController } from '../../entities/prohibitors-controller'
import { convertExpandedDirectionToPrimitiveDirection, getMovementDirection } from '../../lib/movement'
import { CharacterMovementAnimationName } from '../animation'

type MoveConfig = {
  direction: ExpandedDirection
  stateConfig?: CharacterMovementStateConfig
}

type BaseAutomoveConfig = Pick<MoveConfig, 'stateConfig'>

export type AutomoveFromTo = BaseAutomoveConfig & { from?: XY; to: XY }
export type AutomoveDeltaX = BaseAutomoveConfig & { deltaX: number }
export type AutomoveDeltaY = BaseAutomoveConfig & { deltaY: number }

const isAutomoveFromToConfig = (config: any): config is AutomoveFromTo => {
  return (config as AutomoveFromTo).to !== undefined
}
const isAutomoveDeltaXConfig = (config: any): config is AutomoveDeltaX => {
  return (config as AutomoveDeltaX).deltaX !== undefined
}
const isAutomoveDeltaYConfig = (config: any): config is AutomoveDeltaY => {
  return (config as AutomoveDeltaY).deltaY !== undefined
}

export type ConfigForCharacterMovement = {
  position: Position
  animationController: AnimationController<any>
  initialMovementStateConfig: CharacterMovementStateConfig
}

export class CharacterMovement {
  private position: Position
  protected animationController: AnimationController<any>

  movementState: CharacterMovementState

  constructor(config: ConfigForCharacterMovement) {
    const { position, animationController, initialMovementStateConfig } = config

    this.position = position
    this.animationController = animationController

    this.movementState = new CharacterMovementState(initialMovementStateConfig)
  }

  //@ позиция
  //! позиция на следующий шаг
  getPositionOnNextStep = (): XY => {
    const { stepSize } = this.movementState.currentValue

    // длина шага по диагонали должна быть равна длине шага по прямой
    const diagonalStepSize = Math.sqrt(Math.pow(stepSize, 2) / 2)

    const { x, y } = this.position

    if (this.direction === 'down') {
      return { x, y: y + stepSize }
    } else if (this.direction === 'downright') {
      return { x: x + diagonalStepSize, y: y + diagonalStepSize }
    } else if (this.direction === 'right') {
      return { x: x + stepSize, y }
    } else if (this.direction === 'upright') {
      return { x: x + diagonalStepSize, y: y - diagonalStepSize }
    } else if (this.direction === 'up') {
      return { x, y: y - stepSize }
    } else if (this.direction === 'upleft') {
      return { x: x - diagonalStepSize, y: y - diagonalStepSize }
    } else if (this.direction === 'left') {
      return { x: x - stepSize, y }
    } else {
      // downleft
      return { x: x - diagonalStepSize, y: y + diagonalStepSize }
    }
  }

  //! направление движения
  // существует только в момент движения персонажа
  direction: ExpandedDirection | null = null
  setDirection = (direction: ExpandedDirection | null): void => {
    this.direction = direction
  }
  //^@ позиция

  //@ обработка движения
  //! движение
  // препятствия не запрещают движение, т.к. за ними следит коллайдер
  movementProhibitorsController = new ProhibitorsController()
  get isMovementProhibited(): boolean {
    return this.movementProhibitorsController.list.length > 0
  }

  isMoving = false
  setIsMoving = (value: boolean): void => {
    this.isMoving = value
  }

  isStuck = false
  setIsStuck = (value: boolean): void => {
    this.isStuck = value
  }

  move = ({ direction, stateConfig }: MoveConfig): void => {
    this.setDirection(direction)

    if (stateConfig) {
      this.movementState.setConfig(stateConfig)
    }

    if (this.movementState.currentValue) {
      const positionOnNextStep = this.getPositionOnNextStep()
      this.position.setXY(positionOnNextStep.x, positionOnNextStep.y)
    }
  }

  moveWithAnimation = (moveConfig: MoveConfig): void => {
    this.move(moveConfig)

    if (this.direction) {
      const animationName: CharacterMovementAnimationName = ('walk' +
        capitalizeFirstSymbol(
          convertExpandedDirectionToPrimitiveDirection(this.direction),
        )) as CharacterMovementAnimationName

      this.animationController.run(animationName)
    }
  }

  startSprint = (): void => {
    this.movementState.regulators.applyRegulator('sprint')
    this.animationController.applyRegulator('sprint')
  }
  endSprint = (): void => {
    this.movementState.regulators.removeRegulator('sprint')
    this.animationController.removeRegulator('sprint')
  }

  //! остановка
  stopMove = (): void => {
    this.setIsMoving(false)
    this.setDirection(null)
    this.animationController.stop()
  }

  //! автомув
  isAutomoving = false
  setIsAutomoving = (value: boolean): void => {
    this.isAutomoving = value
  }

  // перемещает персонажа из стартовой позиции в конечную
  automove(config: AutomoveFromTo): Promise<boolean>
  automove(config: AutomoveDeltaX): Promise<boolean>
  automove(config: AutomoveDeltaY): Promise<boolean>
  automove(config: any): Promise<boolean> {
    return new Promise((resolve) => {
      if (
        isAutomoveFromToConfig(config) ||
        isAutomoveDeltaXConfig(config) ||
        isAutomoveDeltaYConfig(config)
      ) {
        this.animationController.clearRegulators()
        const { stateConfig } = config

        if (stateConfig) {
          this.movementState.setConfig(stateConfig)
        }

        const start: XY = { x: this.position.x, y: this.position.y }
        const end: XY = { x: this.position.x, y: this.position.y }

        if (isAutomoveFromToConfig(config)) {
          const { from, to } = config
          if (from) {
            start.x = from.x
            start.y = from.y
          }
          end.x = to.x
          end.y = to.y
        } else if (isAutomoveDeltaXConfig(config)) {
          const { deltaX } = config
          end.x = start.x + deltaX
        } else if (isAutomoveDeltaYConfig(config)) {
          const { deltaY } = config
          end.y = start.y + deltaY
        }

        // если движение НЕ по прямой
        if ((start.x !== end.x && start.y !== end.y) || areEquivalent(start, end)) {
          return resolve(false)
        }

        const startAutoMoving = (): void => {
          this.setIsAutomoving(true)
        }
        const stopAutomoving = (): void => {
          this.stopMove()
          this.setIsAutomoving(false)
        }

        startAutoMoving()

        // перемещаем героя в стартовую позицию
        this.position.setXY(start.x, start.y)

        const direction = getMovementDirection(start, end)

        // нужна, чтобы не вызывать move(), после того, как встали на конечную позицию
        var shouldMove = true

        // двигаемся в текущем направлении, пока не дойдём до конечной позиции
        const automoveInDirection = (): void => {
          if (this.isStuck) {
            this.setIsAutomoving(false)
          }

          if (this.isAutomoving && !areEquivalent(this.position.value, end)) {
            // остановка на конечной позиции, если следующим шагом уходим дальше
            const setPositionToEndAndStopAutomoving = (x: number, y: number): void => {
              this.position.setXY(x, y)
              shouldMove = false
            }

            const positionOnNextStep = this.getPositionOnNextStep()

            if (direction === 'down') {
              if (positionOnNextStep.y > end.y) {
                setPositionToEndAndStopAutomoving(this.position.x, end.y)
              }
            } else if (direction === 'right') {
              if (positionOnNextStep.x > end.x) {
                setPositionToEndAndStopAutomoving(end.x, this.position.y)
              }
            } else if (direction === 'up') {
              if (positionOnNextStep.y < end.y) {
                setPositionToEndAndStopAutomoving(this.position.x, end.y)
              }
            } else if (direction === 'left') {
              if (positionOnNextStep.x < end.x) {
                setPositionToEndAndStopAutomoving(end.x, this.position.y)
              }
            }

            if (shouldMove) {
              if (!this.isMovementProhibited) {
                this.animationController.resume()
                this.moveWithAnimation({ direction, stateConfig })
              } else {
                if (
                  this.movementProhibitorsController.list.every(
                    (p) => p !== 'pause' && p !== 'textbox',
                  )
                ) {
                  // всё, кроме паузы и текстбокса прекращает анимацию
                  this.animationController.stop()
                } else {
                  // когда игра на паузе или открыт текстбокс - анимация замирает
                  this.animationController.pause()
                }
              }
            }

            window.requestAnimationFrame(automoveInDirection)
          } else {
            stopAutomoving()
            resolve(true)
          }
        }
        automoveInDirection()
      }
    })
  }
  //^@ обработка движения
}
