import { Sprite } from 'stores/game/play/entities/sprite'
import { SpriteSheet } from 'stores/game/play/entities/sprite-sheet'

import { Animation, AnimationConfig, RunAnimationOptions } from './animation/animation'
import { AnimationRLType } from './animation/regulators'

export enum ViewDirections {
  DOWN = 0,
  RIGHT = 1,
  UP = 2,
  LEFT = 3,
}

export type AnimationConfigForController = Omit<AnimationConfig, 'name' | 'spriteSheet' | 'regulators'>

export type AnimationConfigsForController<AnimationName extends string> = Record<
  AnimationName,
  AnimationConfigForController
>

type AnimationList<AnimationName extends string, RL extends AnimationRLType> = Record<
  AnimationName,
  Animation<RL>
>

export type AnimationControllerConfig<
  AnimationName extends string,
  RL extends AnimationRLType = never,
> = {
  spriteSheet: SpriteSheet
  configs: AnimationConfigsForController<AnimationName>
  initialValue: AnimationName
  regulators?: RL
}

export class AnimationController<AnimationName extends string, RL extends AnimationRLType> {
  private spriteSheet: SpriteSheet
  private configs: AnimationConfigsForController<AnimationName>
  private list: AnimationList<AnimationName, RL> = {} as AnimationList<AnimationName, RL>
  private regulators: RL | null = null

  currentAnimation: Animation<RL>

  constructor(config: AnimationControllerConfig<AnimationName, RL>) {
    const { spriteSheet, configs, initialValue, regulators } = config

    this.spriteSheet = spriteSheet
    this.configs = configs
    if (regulators) {
      this.regulators = regulators
    }

    this.createAnimations()

    this.currentAnimation = this.list[initialValue]
  }

  private createAnimations = (): void => {
    Object.entries<AnimationConfigForController>(this.configs).forEach(
      ([animationName, animationConfig]) => {
        this.list[animationName as AnimationName] = new Animation<RL>({
          name: animationName,
          spriteSheet: this.spriteSheet,
          regulators: this.regulators ? this.regulators : undefined,
          ...animationConfig,
        })
      },
    )
  }

  setScale = (scale: number): void => {
    Object.values<Animation<RL>>(this.list).forEach((animation) => {
      animation.setScale(scale)
    })
  }

  setAnimation = (animationName: AnimationName): void => {
    this.currentAnimation = this.list[animationName]
  }

  start = (options?: RunAnimationOptions): void => {
    this.currentAnimation.run(options)
  }
  stop = (): void => {
    this.currentAnimation.stop()
  }

  run = (animationName: AnimationName, options?: RunAnimationOptions): void => {
    if (this.currentAnimation.name !== animationName) {
      this.setAnimation(animationName)
    }
    if (!this.currentAnimation.isPlaying) {
      this.start(options)
    }
  }

  pause = (): void => {
    this.currentAnimation.pause()
  }
  resume = (): void => {
    this.currentAnimation.resume()
  }

  viewDirection: ViewDirections = ViewDirections.DOWN
  setViewDirection = (direction: ViewDirections): void => {
    this.viewDirection = direction
  }

  get currentSprite(): Sprite {
    return this.currentAnimation.currentSprite
  }
}
