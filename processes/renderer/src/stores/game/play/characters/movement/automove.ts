import { Callback } from 'process-shared/types/basic-utility-types'
import { XY } from 'project-utility-types/plane'

import { areEquivalent } from 'lib/are-equivalent'

import { Position } from '../../entities/position'
import { ProhibitorsController } from '../../entities/prohibitors-controller'
import { getMovementDirection } from '../../lib/movement'
import { DefaultCharacterAnimationController } from '../animation'
import { MoveConfig, MoveFn } from './movement'
import { CharacterMovementState } from './state'

type BaseRunAutomoveConfig = Pick<MoveConfig, 'stateConfig'>

type RunAutomoveFromTo = BaseRunAutomoveConfig & { from?: XY; to: XY }
type RunAutomoveDeltaX = BaseRunAutomoveConfig & { deltaX: number }
type RunAutomoveDeltaY = BaseRunAutomoveConfig & { deltaY: number }

export type RunAutomove = {
  (config: RunAutomoveFromTo): Promise<boolean>
  (config: RunAutomoveDeltaX): Promise<boolean>
  (config: RunAutomoveDeltaY): Promise<boolean>
}

const isAutomoveFromToConfig = (config: any): config is RunAutomoveFromTo => {
  return (config as RunAutomoveFromTo).to !== undefined
}
const isAutomoveDeltaXConfig = (config: any): config is RunAutomoveDeltaX => {
  return (config as RunAutomoveDeltaX).deltaX !== undefined
}
const isAutomoveDeltaYConfig = (config: any): config is RunAutomoveDeltaY => {
  return (config as RunAutomoveDeltaY).deltaY !== undefined
}

type Config = {
  position: Position
  movementState: CharacterMovementState
  movementProhibitorsController: ProhibitorsController
  getPositionOnNextStep: () => XY
  move: MoveFn
  stopMove: Callback
  animationController: DefaultCharacterAnimationController
  clearRegulators: Callback
}

export class CharacterAutomove {
  private position: Position
  private movementState: CharacterMovementState
  private movementProhibitorsController: ProhibitorsController
  private getPositionOnNextStep: () => XY
  private move: MoveFn
  private stopMove: Callback
  private clearRegulators: Callback
  private animationController: DefaultCharacterAnimationController

  constructor(config: Config) {
    const {
      position,
      movementState,
      movementProhibitorsController,
      getPositionOnNextStep,
      move,
      stopMove,
      clearRegulators,
      animationController,
    } = config

    this.position = position
    this.movementState = movementState
    this.movementProhibitorsController = movementProhibitorsController
    this.getPositionOnNextStep = getPositionOnNextStep
    this.move = move
    this.stopMove = stopMove
    this.clearRegulators = clearRegulators
    this.animationController = animationController
  }

  isAutomoving = false
  setIsAutomoving = (value: boolean): void => {
    this.isAutomoving = value
  }

  isStuck = false
  setIsStuck = (value: boolean): void => {
    this.isStuck = value
  }

  // перемещает персонажа из стартовой позиции в конечную
  run: RunAutomove = (config: any) => {
    return new Promise((resolve) => {
      if (
        isAutomoveFromToConfig(config) ||
        isAutomoveDeltaXConfig(config) ||
        isAutomoveDeltaYConfig(config)
      ) {
        this.clearRegulators()

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

        // условие выше гарантирует, стартовая и конечная позиции не совпадают
        const direction = getMovementDirection(start, end)!

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
              if (!this.movementProhibitorsController.isProhibited) {
                this.animationController.resume()
                this.move({ direction, stateConfig })
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
}
