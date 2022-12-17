import { Animation, AnimationConfig, RunAnimationOptions } from 'stores/entities/animation'
import { Sprite } from 'stores/entities/sprite'
import { SpriteSheet } from 'stores/entities/sprite-sheet'


export enum ViewDirections {
  DOWN = 0,
  RIGHT = 1,
  UP = 2,
  LEFT = 3,
}

export type AnimationConfigNoNameNoSpriteSheet = Omit<AnimationConfig, 'name' | 'spriteSheet'>

export type AnimationList<AnimationName extends string> = Record<
  AnimationName,
  AnimationConfigNoNameNoSpriteSheet
>

export type AnimationControllerConfig<AnimationName extends string> = {
  spriteSheet: SpriteSheet
  animationList: AnimationList<AnimationName>
  initialValue: AnimationName
}
export class AnimationController<AnimationName extends string> {
  private spriteSheet: SpriteSheet
  private list: AnimationList<AnimationName>

  current: Animation

  constructor(config: AnimationControllerConfig<AnimationName>) {
    this.spriteSheet = config.spriteSheet
    this.list = config.animationList
    this.current = this.getAnimation(config.initialValue)
  }

  getAnimation = (animationName: AnimationName): Animation => {
    return new Animation({
      name: animationName,
      spriteSheet: this.spriteSheet,
      ...this.list[animationName],
    })
  }

  setAnimation = (animationName: AnimationName): void => {
    this.current = this.getAnimation(animationName)
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
