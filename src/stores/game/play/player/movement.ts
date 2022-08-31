import { makeAutoObservable } from 'mobx'

import {
  ExpandedMovementDirection,
  MovementLoopState,
  Position,
  PrimitiveMovementDirection,
  Size,
  ViewDirections,
} from 'game-utility-types'

import { Sprite } from 'stores/entities/sprite'
import { KeyboardStore } from 'stores/keyboard.store'

import { areSame } from 'lib/are-same'
import { last } from 'lib/arrays'

import {
  CurrentGameSettings,
  MovementControllersKeys,
  MovementKeys,
  MovementRegulatorsKeys,
} from '../settings/current-settings'

type PlayerMovementConfig = {
  keyboard: KeyboardStore
  mapSize: Size
  settings: CurrentGameSettings
  sprite: Sprite
}

type MovementStateName = 'idle' | 'walk' | 'entering'
type MovementState = {
  stepSize: number
  framesPerStep: number
}
type MovementStates = Record<MovementStateName, MovementState>

type MovementRegulatorName = 'sprint'
type MovementRegulator = {
  stepSizeMultiplier: number
  framesPerStepMultiplier: number
}
type MovementRegulators = Record<MovementRegulatorName, MovementRegulator>

type MovementConfigNames = {
  state: MovementStateName
  regulator: MovementRegulatorName | null
}
type MovementConfigValues = {
  state: MovementState
  regulator: MovementRegulator | null
}

type AutoMoveConfig = {
  start: Position
  end: Position
  state: MovementState
}

export class PlayerMovement {
  private keyboard: KeyboardStore
  private mapSize: Size
  private settings: CurrentGameSettings
  private sprite: Sprite

  constructor(config: PlayerMovementConfig) {
    this.keyboard = config.keyboard
    this.mapSize = config.mapSize
    this.settings = config.settings
    this.sprite = config.sprite

    makeAutoObservable(this, {}, { autoBind: true })
  }

  //@Позиция
  //!Позиция персонажа
  //Позиция верхнего левого угла спрайта
  position: Position = {
    x: 0,
    y: 0,
  }
  setPosition(x: number, y: number): void {
    this.position.x = x
    this.position.y = y
  }

  //!Позиция на следующий шаг
  getPositionOnNextStep(config?: { stepSize?: number }): Position {
    const { stepSize = this.currentMovementStateWithRegulators.stepSize } = config ?? {}

    //Длина шага по диагонали должна быть равна длине шага по прямой
    const diagonalStepSize = Math.sqrt(Math.pow(stepSize, 2) / 2)

    const { x, y } = this.position

    //Если герой упирается в границы карты
    const isRestedInDownMapBorder = y === this.maxYCoordinate
    const isRestedInRightMapBorder = x === this.maxXCoordinate
    const isRestedInTopMapBorder = y === 0
    const isRestedInLeftMapBorder = x === 0

    if (this.movementDirection === 'down') {
      return { x, y: y + stepSize }
    } else if (this.movementDirection === 'downright') {
      return {
        x: isRestedInRightMapBorder ? x : x + diagonalStepSize,
        y: isRestedInDownMapBorder ? y : y + diagonalStepSize,
      }
    } else if (this.movementDirection === 'right') {
      return { x: x + stepSize, y }
    } else if (this.movementDirection === 'upright') {
      return {
        x: isRestedInRightMapBorder ? x : x + diagonalStepSize,
        y: isRestedInTopMapBorder ? y : y - diagonalStepSize,
      }
    } else if (this.movementDirection === 'up') {
      return { x, y: y - stepSize }
    } else if (this.movementDirection === 'upleft') {
      return {
        x: isRestedInLeftMapBorder ? x : x - diagonalStepSize,
        y: isRestedInTopMapBorder ? y : y - diagonalStepSize,
      }
    } else if (this.movementDirection === 'left') {
      return { x: x - stepSize, y }
    } else {
      //downleft
      return {
        x: isRestedInLeftMapBorder ? x : x - diagonalStepSize,
        y: isRestedInDownMapBorder ? y : y + diagonalStepSize,
      }
    }
  }

  //!Допустимая позиция
  //С учётом размера спрайта
  isOutOfDownMapBorder(position: Position): boolean {
    return position.y > this.maxYCoordinate
  }
  isOutOfRightMapBorder(position: Position): boolean {
    return position.x > this.maxXCoordinate
  }
  isOutOfTopMapBorder(position: Position): boolean {
    return position.y < 0
  }
  isOutOfLeftMapBorder(position: Position): boolean {
    return position.x < 0
  }

  isAllowedPosition(position: Position): boolean {
    return !(
      this.isOutOfDownMapBorder(position) ||
      this.isOutOfRightMapBorder(position) ||
      this.isOutOfTopMapBorder(position) ||
      this.isOutOfLeftMapBorder(position)
    )
  }

  //!Установка позиции к краям карты
  get maxXCoordinate(): number {
    return this.mapSize.width - this.sprite.scaledWidth
  }
  get maxYCoordinate(): number {
    return this.mapSize.height - this.sprite.scaledHeight
  }

  setPositionToDownMapBorder(x?: number): void {
    this.setPosition(x ?? this.position.x, this.maxYCoordinate)
  }
  setPositionToRightMapBorder(y?: number): void {
    this.setPosition(this.maxXCoordinate, y ?? this.position.y)
  }
  setPositionToTopMapBorder(x?: number): void {
    this.setPosition(x ?? this.position.x, 0)
  }
  setPositionToLeftMapBorder(y?: number): void {
    this.setPosition(0, y ?? this.position.y)
  }

  //!Прятание героя за границы
  hideInDownMapBorder(x?: number): void {
    this.setPosition(x ?? this.position.x, this.mapSize.height)
  }
  hideInRightMapBorder(y?: number): void {
    this.setPosition(this.mapSize.width, y ?? this.position.y)
  }
  hideInTopMapBorder(x?: number): void {
    this.setPosition(x ?? this.position.x, -this.sprite.scaledHeight)
  }
  hideInLeftMapBorder(y?: number): void {
    this.setPosition(-this.sprite.scaledWidth, y ?? this.position.y)
  }

  //!Направление взгляда
  viewDirection: ViewDirections = ViewDirections.DOWN
  setViewDirection(direction: ViewDirections): void {
    this.viewDirection = direction
  }

  //!Направление движения
  //Существует только в момент движения персонажа
  movementDirection: ExpandedMovementDirection | null = null
  setMovementDirection(direction: ExpandedMovementDirection | null): void {
    //Установка направления взгляда
    if (direction) {
      const newViewDirection: ViewDirections = direction.includes('right')
        ? ViewDirections.RIGHT
        : direction.includes('left')
        ? ViewDirections.LEFT
        : direction === 'down'
        ? ViewDirections.DOWN
        : ViewDirections.UP

      //Чтобы при смене напрвления взгляда сразу была анимация шага
      if (!this.movementDirection || newViewDirection !== this.viewDirection) {
        this.setMovementFramesCount(0)
        this.setMovementLoopIndex(1)
      }

      this.setViewDirection(newViewDirection)
    }
    this.movementDirection = direction
  }

  getReversedPrimitiveDirection(direction: PrimitiveMovementDirection): PrimitiveMovementDirection {
    if (direction === 'down') {
      return 'up'
    } else if (direction === 'right') {
      return 'left'
    } else if (direction === 'up') {
      return 'down'
    } else {
      return 'right'
    }
  }

  //^@Позиция

  //@Анимация движения
  //!Цикл ходьбы
  movementLoop: Array<MovementLoopState> = [0, 1, 2, 3]
  movementLoopIndex = 0
  setMovementLoopIndex(index: MovementLoopState): void {
    this.movementLoopIndex = index
  }
  increaseMovementLoopIndex(): void {
    if (this.movementLoopIndex === this.movementLoop.length - 1) {
      this.setMovementLoopIndex(0)
    } else {
      this.movementLoopIndex += 1
    }
  }
  get movementLoopState(): MovementLoopState {
    return this.movementLoop[this.movementLoopIndex]
  }

  //!Счётчик кадров
  private movementFramesCount = 0
  private setMovementFramesCount(value: number): void {
    this.movementFramesCount = value
  }
  private increaseMovementFramesCount(): void {
    this.movementFramesCount += 1
  }
  //^@Анимация движения

  //@Обработка движения
  //!Состояния движения
  get movementStates(): MovementStates {
    return {
      idle: {
        stepSize: 0,
        framesPerStep: 0,
      },
      walk: {
        stepSize: 1.8,
        framesPerStep: 11,
      },
      entering: {
        stepSize: 0.45,
        framesPerStep: 11,
      },
    }
  }
  get movementRegulators(): MovementRegulators {
    return { sprint: { stepSizeMultiplier: 1.88, framesPerStepMultiplier: 0.72 } }
  }

  currentMovementConfigNames: MovementConfigNames = {
    state: 'idle',
    regulator: null,
  }
  setCurrentMovementState(name: MovementStateName): void {
    this.currentMovementConfigNames.state = name
  }
  setCurrentMovementRegulator(name: MovementRegulatorName | null): void {
    this.currentMovementConfigNames.regulator = name
  }
  get currentMovementConfigValues(): MovementConfigValues {
    return {
      state: this.movementStates[this.currentMovementConfigNames.state],
      regulator: this.currentMovementConfigNames.regulator
        ? this.movementRegulators[this.currentMovementConfigNames.regulator]
        : null,
    }
  }

  get currentMovementStateWithRegulators(): MovementState {
    const stepSizeMultiplier = this.currentMovementConfigValues.regulator?.stepSizeMultiplier ?? 1
    const framesPerStepMultiplier =
      this.currentMovementConfigValues.regulator?.framesPerStepMultiplier ?? 1

    const stepSize = this.currentMovementConfigValues.state.stepSize * stepSizeMultiplier
    const framesPerStep = Math.round(
      this.currentMovementConfigValues.state.framesPerStep * framesPerStepMultiplier,
    )

    return { stepSize, framesPerStep }
  }

  get isMoving(): boolean {
    return this.currentMovementConfigNames.state !== 'idle'
  }

  //@Клавиши управления
  get movementKeys(): MovementKeys {
    return this.settings.movement.keys
  }

  //!Контроллеры
  get movementControllersKeys(): MovementControllersKeys {
    return this.movementKeys.controllers
  }
  isMovementControllerKey(key: string): boolean {
    return Object.values(this.movementControllersKeys).some((controller) => key === controller)
  }

  get pressedMovementControllers(): Array<string> {
    return this.keyboard.pressedKeysArray.reverse().filter(this.isMovementControllerKey)
  }
  get pressedMovementDirections(): Array<PrimitiveMovementDirection> {
    return this.pressedMovementControllers.map((controller) =>
      controller === this.movementControllersKeys.down
        ? 'down'
        : controller === this.movementControllersKeys.right
        ? 'right'
        : controller === this.movementControllersKeys.up
        ? 'up'
        : 'left',
    )
  }

  get isMovementControllerPressed(): boolean {
    return this.pressedMovementControllers.length !== 0
  }
  get isMoveDownControllerPressed(): boolean {
    return this.pressedMovementControllers.includes(this.movementControllersKeys.down)
  }
  get isMoveRightControllerPressed(): boolean {
    return this.pressedMovementControllers.includes(this.movementControllersKeys.right)
  }
  get isMoveUpControllerPressed(): boolean {
    return this.pressedMovementControllers.includes(this.movementControllersKeys.up)
  }
  get isMoveLeftControllerPressed(): boolean {
    return this.pressedMovementControllers.includes(this.movementControllersKeys.left)
  }

  //!Регуляторы
  get movementRegulatorsKeys(): MovementRegulatorsKeys {
    return this.movementKeys.regulators
  }
  isMovementRegulatorKey(key: string): boolean {
    return Object.values(this.movementRegulatorsKeys).some((regulator) => key === regulator)
  }

  get pressedMovementRegulators(): Array<string> {
    return this.keyboard.pressedKeysArray.filter(this.isMovementRegulatorKey)
  }
  get lastPressedMovementRegulator(): string {
    return last(this.pressedMovementRegulators)
  }

  get isSprintKeyPressed(): boolean {
    return this.lastPressedMovementRegulator === this.movementRegulatorsKeys.sprint
  }
  //^@Клавиши управления

  //!Движение
  //Отвечает за анимацию движения и за перемещение персонажа в валидную позицию
  move(direction: ExpandedMovementDirection, state?: MovementState): void {
    this.setMovementDirection(direction)

    const {
      stepSize = this.currentMovementStateWithRegulators.stepSize,
      framesPerStep = this.currentMovementStateWithRegulators.framesPerStep,
    } = state ?? {}

    const positionOnNextStep = this.getPositionOnNextStep({ stepSize })

    if (!this.isAutoMoving) {
      this.setCurrentMovementRegulator(this.isSprintKeyPressed ? 'sprint' : null)
      //Проверка, если следующим шагом персонаж выходит за границы
      if (!this.isAllowedPosition(positionOnNextStep)) {
        if (this.isOutOfDownMapBorder(positionOnNextStep)) {
          this.setPositionToDownMapBorder()
        } else if (this.isOutOfRightMapBorder(positionOnNextStep)) {
          this.setPositionToRightMapBorder()
        } else if (this.isOutOfTopMapBorder(positionOnNextStep)) {
          this.setPositionToTopMapBorder()
        } else if (this.isOutOfLeftMapBorder(positionOnNextStep)) {
          this.setPositionToLeftMapBorder()
        }
      } else {
        //Персонаж идёт дальше, только если не выходит за пределы карты
        this.setPosition(positionOnNextStep.x, positionOnNextStep.y)
      }
    } else {
      //Автомувнутый персонаж может выходить за пределы карты
      this.setPosition(positionOnNextStep.x, positionOnNextStep.y)
    }

    //Обновление счётчика кадров и анимации ходьбы
    this.increaseMovementFramesCount()
    if (this.movementFramesCount >= framesPerStep) {
      this.setMovementFramesCount(0)
      this.increaseMovementLoopIndex()
    }
  }

  //!Остановка
  stop(): void {
    this.setMovementDirection(null)
    this.setMovementFramesCount(0)
    this.setMovementLoopIndex(0)
    this.setCurrentMovementState('idle')
  }

  //!Обработка клавиш движения
  handleMovementKeys(): void {
    if (this.isMovementControllerPressed) {
      const getMovementDirection = (): ExpandedMovementDirection | null => {
        var movementDirection: ExpandedMovementDirection | null = null

        //Убираем направления, компенсирующие друг друга (пример: вверх-вниз)
        const filteredPressedMovementDirections = this.pressedMovementDirections.filter(
          (pressedDirection) => {
            return this.pressedMovementDirections.every(
              (d) => d !== this.getReversedPrimitiveDirection(pressedDirection),
            )
          },
        )

        //Если длина массива 0, значит, все направления скомпенсировали друг друга - персонаж стоит на месте
        if (filteredPressedMovementDirections.length) {
          movementDirection = filteredPressedMovementDirections
            //Сортируем, чтобы названия направлений получались в едином формате
            .sort((_, b) => (b === 'down' || b === 'up' ? 1 : -1))
            .join('') as ExpandedMovementDirection
        } else {
          this.stop()
        }

        return movementDirection
      }

      const movementDirection = getMovementDirection()

      if (movementDirection) {
        const movementStateName: MovementStateName = 'walk'
        this.setCurrentMovementState(movementStateName)
        this.move(movementDirection)
      }
    } else {
      this.stop()
    }
  }

  //!Автомув персонажа
  isAutoMoving = false
  setIsAutoMoving(value: boolean): void {
    this.isAutoMoving = value
  }

  isAutoMovePaused = false
  pauseAutoMove(): void {
    this.isAutoMovePaused = true
  }
  resumeAutoMove(): void {
    this.isAutoMovePaused = false
  }

  //Перемещает персонажа из стартовой позиции в конечную
  autoMove({ start, end, state }: AutoMoveConfig): Promise<boolean> {
    const { stepSize, framesPerStep } = state

    return new Promise((resolve) => {
      const startX = start.x
      const startY = start.y
      const endX = end.x
      const endY = end.y

      //Если движение по прямой
      if ((startX === endX || startY === endY) && !areSame(start, end)) {
        this.setIsAutoMoving(true)

        //Перемещаем героя в стартовую позицию
        this.setPosition(startX, startY)

        var movementDirection: PrimitiveMovementDirection
        //Вычисляем направление движения
        if (endY > startY) {
          movementDirection = 'down'
        } else if (endX > startX) {
          movementDirection = 'right'
        } else if (endY < startY) {
          movementDirection = 'up'
        } else if (endX < startX) {
          movementDirection = 'left'
        }

        const stopAutoMoving = (): void => {
          this.stop()
          this.setIsAutoMoving(false)
        }

        //Нужна, чтобы не вызывать move(), после того, как встали на конечную позицию
        var shouldMove = true

        //Двигаемся в текущем направлении, пока не дойдём до конечной позиции
        const autoMoveInDirection = (): void => {
          if (!areSame(this.position, end)) {
            if (!this.isAutoMovePaused) {
              //Остановка на конечной позиции, если следующим шагом уходим дальше
              const setPositionToEndAndStopAutoMoving = (x: number, y: number): void => {
                this.setPosition(x, y)
                shouldMove = false
              }

              const positionOnNextStep = this.getPositionOnNextStep()

              if (movementDirection === 'down') {
                if (positionOnNextStep.y > end.y) {
                  setPositionToEndAndStopAutoMoving(this.position.x, end.y)
                }
              } else if (movementDirection === 'right') {
                if (positionOnNextStep.x > end.x) {
                  setPositionToEndAndStopAutoMoving(end.x, this.position.y)
                }
              } else if (movementDirection === 'up') {
                if (positionOnNextStep.y < end.y) {
                  setPositionToEndAndStopAutoMoving(this.position.x, end.y)
                }
              } else if (movementDirection === 'left') {
                if (positionOnNextStep.x < end.x) {
                  setPositionToEndAndStopAutoMoving(end.x, this.position.y)
                }
              }
              if (shouldMove) {
                this.move(movementDirection, { stepSize, framesPerStep })
              }
            }

            window.requestAnimationFrame(autoMoveInDirection)
          } else {
            stopAutoMoving()
            resolve(true)
          }
        }
        autoMoveInDirection()
      } else {
        resolve(false)
      }
    })
  }
  //^@Обработка движения
}
