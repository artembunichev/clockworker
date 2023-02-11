import { Callback } from 'process-shared/types/basic-utility-types'
import { Indexes } from 'project-utility-types/abstract'

import {
  RegulatorTarget as RegulatorTargetType,
  RegulatorTargetsInitialValues,
  Regulators,
} from '../regulators'
import { Sprite } from '../sprite'
import { SpriteSheet } from '../sprite-sheet'
import { AnimationRLType, regulatorTargetsInitialValues } from './regulators'

export type AnimationSequence = Array<Indexes>

export type AnimationControls = {
  run: Callback
  stop: Callback
}

export type RunAnimationOptions<RL extends AnimationRLType = never> = Partial<
  Pick<AnimationConfig<RL>, 'framesPerSprite'>
>

export type AnimationConfig<RL extends AnimationRLType = never> = {
  name: string
  spriteSheet: SpriteSheet
  sequence: AnimationSequence
  framesPerSprite: number
  initialScale: number
  startFrom?: number
  regulators?: RL
}

export class Animation<RL extends AnimationRLType = never> {
  name: string
  private spriteSheet: SpriteSheet
  sequence: AnimationSequence
  baseFramesPerSprite: number
  framesPerSprite: number
  scale: number
  private startFrom: number
  currentSpriteIndex: number
  regulators: Regulators<RL, typeof this> | null

  frameCount = 0
  isPlaying = false
  isPaused = false

  constructor(config: AnimationConfig<RL>) {
    const { name, spriteSheet, sequence, framesPerSprite, initialScale, startFrom, regulators } =
      config

    this.name = name
    this.spriteSheet = spriteSheet
    this.sequence = sequence
    this.setBaseFramesPerSprite(framesPerSprite)
    this.setScale(initialScale)

    this.startFrom = startFrom ?? 0

    if (regulators) {
      this.regulators = new Regulators({
        list: regulators,
        sourceObject: this,
        targetsInitialValues: regulatorTargetsInitialValues as RegulatorTargetsInitialValues<
          typeof this,
          RegulatorTargetType<RL>
        >,
      })
    } else {
      this.regulators = null
    }

    this.currentSpriteIndex = this.startFrom
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

  setBaseFramesPerSprite = (value: number): void => {
    this.baseFramesPerSprite = value
    if (!this.framesPerSprite) {
      this.framesPerSprite = this.baseFramesPerSprite
    }
    this.regulators?.modifyAllRegulatorTargets()
  }

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

  run = (options?: RunAnimationOptions<RL>): void => {
    const { framesPerSprite } = options ?? {}

    if (framesPerSprite) {
      this.setBaseFramesPerSprite(framesPerSprite)
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

  get currentSprite(): Sprite {
    const [row, column] = this.sequence[this.currentSpriteIndex]
    return this.spriteSheet.getSprite(row, column, { scale: this.scale })
  }
}
