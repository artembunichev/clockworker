import { Animation, AnimationConfig, RunAnimationOptions } from 'stores/game/play/entities/animation'
import { Sprite } from 'stores/game/play/entities/sprite'
import { SpriteSheet } from 'stores/game/play/entities/sprite-sheet'

export enum ViewDirections {
  DOWN = 0,
  RIGHT = 1,
  UP = 2,
  LEFT = 3,
}

export type AnimationConfigNoNameNoSpriteSheet = Omit<AnimationConfig, 'name' | 'spriteSheet'>

export type AnimationConfigs<AnimationName extends string> = Record<
  AnimationName,
  AnimationConfigNoNameNoSpriteSheet
>

type AnimationList<AnimationName extends string> = Record<AnimationName, Animation>

export type AnimationControllerConfig<AnimationName extends string> = {
  spriteSheet: SpriteSheet
  configs: AnimationConfigs<AnimationName>
  initialValue: AnimationName
}

export class AnimationController<AnimationName extends string> {
  private spriteSheet: SpriteSheet
  private configs: AnimationConfigs<AnimationName>
  private list: AnimationList<AnimationName> = {} as AnimationList<AnimationName>

  current: Animation

  constructor(config: AnimationControllerConfig<AnimationName>) {
    const { spriteSheet, configs, initialValue } = config

    this.spriteSheet = spriteSheet
    this.configs = configs

    this.createAnimations()

    this.current = this.list[initialValue]
  }

  private createAnimations = (): void => {
    Object.entries<AnimationConfigNoNameNoSpriteSheet>(this.configs).forEach(
      ([animationName, animationConfig]) => {
        this.list[animationName as AnimationName] = new Animation({
          name: animationName,
          spriteSheet: this.spriteSheet,
          ...animationConfig,
        })
      },
    )
  }

  setScale = (scale: number): void => {
    Object.values<Animation>(this.list).forEach((animation) => {
      animation.setScale(scale)
    })
  }

  setAnimation = (animationName: AnimationName): void => {
    this.current = this.list[animationName]
  }

  start = (options?: RunAnimationOptions): void => {
    this.current.run(options)
  }
  stop = (): void => {
    this.current.stop()
  }

  run = (animationName: AnimationName, options?: RunAnimationOptions): void => {
    if (this.current.name !== animationName) {
      this.setAnimation(animationName)
    }
    if (!this.current.isPlaying) {
      this.start(options)
    }
  }

  pause = (): void => {
    this.current.pause()
  }
  resume = (): void => {
    this.current.resume()
  }

  applyRegulator = (regulatorName: string): void => {
    this.current.applyRegulator(regulatorName)
  }
  removeRegulator = (regulatorName: string): void => {
    this.current.removeRegulator(regulatorName)
  }

  viewDirection: ViewDirections = ViewDirections.DOWN
  setViewDirection = (direction: ViewDirections): void => {
    this.viewDirection = direction
  }

  get currentSprite(): Sprite {
    return this.current.currentSprite
  }
}
