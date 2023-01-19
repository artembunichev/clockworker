import { Callback } from 'process-shared/types/basic-utility-types'
import { Indexes, Modifier } from 'project-utility-types/abstract'

import { Sprite } from 'stores/game/play/entities/sprite'
import { SpriteSheet } from 'stores/game/play/entities/sprite-sheet'

type Regulator = {
  framesPerSprite: Modifier<number>
}

type Regulators = Record<string, Regulator>

export type AnimationSequence = Array<Indexes>

export type AnimationControls = {
  run: Callback
  stop: Callback
}

export type RunAnimationOptions = Partial<Pick<AnimationConfig, 'framesPerSprite'>>

export type AnimationConfig = {
  name: string
  spriteSheet: SpriteSheet
  sequence: AnimationSequence
  framesPerSprite: number
  initialScale: number
  startFrom?: number
  regulators?: Regulators
}

export class Animation {
  name: string
  private spriteSheet: SpriteSheet
  sequence: AnimationSequence
  framesPerSprite: number
  prevFramesPerSprite: number
  scale: number
  private startFrom: number

  currentSpriteIndex: number

  regulators: Regulators | null

  constructor(config: AnimationConfig) {
    const { name, spriteSheet, sequence, framesPerSprite, initialScale, startFrom, regulators } =
      config

    this.name = name
    this.spriteSheet = spriteSheet
    this.sequence = sequence
    this.framesPerSprite = framesPerSprite
    this.prevFramesPerSprite = this.framesPerSprite
    this.setScale(initialScale)

    this.startFrom = startFrom ?? 0

    this.currentSpriteIndex = this.startFrom

    this.regulators = regulators ?? null
  }

  setScale = (scale: number): void => {
    this.scale = scale
  }

  setCurrentSpriteIndex = (value: number): void => {
    this.currentSpriteIndex = value
  }
  updateCurrentSpriteIndex = (): void => {
    if (this.currentSpriteIndex === this.sequence.length - 1) {
      this.setCurrentSpriteIndex(0)
    } else {
      this.currentSpriteIndex += 1
    }
  }

  get currentSprite(): Sprite {
    const [row, column] = this.sequence[this.currentSpriteIndex]
    return this.spriteSheet.getSprite(row, column, { scale: this.scale })
  }

  frameCount = 0
  private setFrameCount = (value: number): void => {
    this.frameCount = value
  }
  private updateFrameCount = (): void => {
    this.frameCount += 1
  }
  private toFirstSprite = (): void => {
    this.setFrameCount(0)
    this.setCurrentSpriteIndex(0)
  }

  setFramesPerSprite = (value: number): void => {
    this.setPrevFramesPerSprite(this.framesPerSprite)
    this.framesPerSprite = value
  }
  setPrevFramesPerSprite = (value: number): void => {
    this.prevFramesPerSprite = value
  }

  currentRegulatorName: string | null = null

  get currentRegulator(): Regulator | null {
    if (this.currentRegulatorName && this.regulators) {
      return this.regulators[this.currentRegulatorName as keyof Regulators]
    }
    return null
  }

  private applyCurrentRegulator = (): void => {
    if (this.currentRegulator) {
      var newFramesPerSprite: number
      if (this.currentRegulator.framesPerSprite instanceof Function) {
        newFramesPerSprite = Math.round(this.currentRegulator.framesPerSprite(this.framesPerSprite))
      } else {
        newFramesPerSprite = Math.round(this.currentRegulator.framesPerSprite)
      }
      this.setFramesPerSprite(newFramesPerSprite)
    } else {
      this.setFramesPerSprite(this.prevFramesPerSprite)
    }
  }

  applyRegulator = (regulatorName: string): void => {
    if (this.regulators) {
      if (this.currentRegulatorName !== regulatorName) {
        this.currentRegulatorName = regulatorName
        this.applyCurrentRegulator()
      }
    }
  }
  clearRegulator = (): void => {
    this.currentRegulatorName = null
    this.applyCurrentRegulator()
  }
  removeRegulator = (regulatorName: string): void => {
    if (this.currentRegulatorName === regulatorName) {
      this.clearRegulator()
    }
  }

  isPlaying = false
  isPaused = false

  update = (): void => {
    if (!this.isPlaying) {
      return
    }
    if (!this.isPaused) {
      if (this.frameCount === 0) {
        this.setCurrentSpriteIndex(this.startFrom)
      }
      if (this.frameCount > this.framesPerSprite) {
        this.updateCurrentSpriteIndex()
        this.setFrameCount(0)
      }
      this.updateFrameCount()
    }
  }

  run = (options?: RunAnimationOptions): void => {
    const { framesPerSprite } = options ?? {}

    if (framesPerSprite) {
      this.setFramesPerSprite(framesPerSprite)
    }

    this.isPlaying = true
  }
  stop = (): void => {
    this.isPlaying = false
    this.toFirstSprite()
  }

  pause = (): void => {
    this.isPaused = true
  }
  resume = (): void => {
    this.isPaused = false
  }
}
