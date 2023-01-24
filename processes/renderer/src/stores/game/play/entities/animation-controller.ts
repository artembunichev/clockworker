import {
  Animation,
  AnimationConfig,
  AnimationRLType,
  RunAnimationOptions,
} from 'stores/game/play/entities/animation'
import { Sprite } from 'stores/game/play/entities/sprite'
import { SpriteSheet } from 'stores/game/play/entities/sprite-sheet'

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

  current: Animation<RL>

  constructor(config: AnimationControllerConfig<AnimationName, RL>) {
    const { spriteSheet, configs, initialValue, regulators } = config

    this.spriteSheet = spriteSheet
    this.configs = configs
    if (regulators) {
      this.regulators = regulators
    }

    this.createAnimations()

    this.current = this.list[initialValue]
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

  viewDirection: ViewDirections = ViewDirections.DOWN
  setViewDirection = (direction: ViewDirections): void => {
    this.viewDirection = direction
  }

  get currentSprite(): Sprite {
    return this.current.currentSprite
  }
}
