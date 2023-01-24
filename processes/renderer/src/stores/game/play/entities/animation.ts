import { Callback } from 'process-shared/types/basic-utility-types'
import { Indexes } from 'project-utility-types/abstract'

import {
  RegulatorList,
  RegulatorTarget as RegulatorTargetType,
  RegulatorTargetsInitialValues,
  Regulators,
} from 'stores/game/play/entities/regulators'
import { Sprite } from 'stores/game/play/entities/sprite'
import { SpriteSheet } from 'stores/game/play/entities/sprite-sheet'

export type AnimationSequence = Array<Indexes>

export type AnimationControls = {
  run: Callback
  stop: Callback
}

const regulatorTargets = ['framesPerSprite'] as const
type RegulatorTarget = typeof regulatorTargets[number]

export type AnimationRLType = RegulatorList<string, RegulatorTarget> | never

export type AnimationRegulatorList<RegulatorName extends string> = RegulatorList<
  RegulatorName,
  RegulatorTarget
>

const regulatorTargetsInitialValues: RegulatorTargetsInitialValues<RegulatorTarget> = {
  framesPerSprite: 'baseFramesPerSprite',
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

  regulators: Regulators<RL> | null

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

  setBaseFramesPerSprite = (value: number): void => {
    this.baseFramesPerSprite = value
    if (!this.framesPerSprite) {
      this.framesPerSprite = this.baseFramesPerSprite
    }
    this.regulators?.modifyAllRegulatorTargets()
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
}
