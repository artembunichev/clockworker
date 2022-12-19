import { Callback } from 'basic-utility-types'
import { Indexes } from 'project-utility-types'

import { Sprite } from 'stores/entities/sprite'
import { SpriteSheet } from 'stores/entities/sprite-sheet'

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
  scale: number
  startFrom?: number
}

export class Animation {
  name: string
  private spriteSheet: SpriteSheet
  sequence: AnimationSequence
  framesPerSprite: number
  scale: number
  private startFrom: number

  currentSpriteIndex: number

  constructor(config: AnimationConfig) {
    this.name = config.name
    this.spriteSheet = config.spriteSheet
    this.sequence = config.sequence
    this.framesPerSprite = config.framesPerSprite
    this.scale = config.scale

    this.startFrom = config.startFrom ?? 0

    this.currentSpriteIndex = this.startFrom
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
    this.framesPerSprite = value
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
