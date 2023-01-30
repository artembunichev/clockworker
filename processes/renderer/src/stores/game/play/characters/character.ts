import { ImageContainer, ImageContainerOptions, ImageSrcs } from 'stores/entities/image-container'

import { merge } from 'lib/objects'

import { Body, BodyConfig } from '../body'
import { AnimationConfigsForController, AnimationController } from '../entities/animation-controller'
import { AnimationRLType } from '../entities/animation/regulators'
import { Sprite } from '../entities/sprite'
import { SpriteSheet, SpriteSheetConfig } from '../entities/sprite-sheet'
import { GameScreen } from '../screen'
import {
  CharacterAnimationController,
  CharacterAnimationName,
  CharacterAnimationRegulatorList,
  DefaultCharacterAnimationController,
  defaultCharacterAnimationRegulatorList,
} from './animation'
import { CharacterMovement, ConfigForCharacterMovement } from './movement/movement'

export type AnyCharacter = Character<any, any, any>
export type AnyCharacterConfig = CharacterConfig<any, any, any>

type BaseCharacterConfig = BodyConfig & { name: string; screen: GameScreen }

type CharacterImageSrcs = ImageSrcs & { spriteSheet: string }
type ImageContainerCharacterConfig<Srcs extends CharacterImageSrcs> = {
  srcs: Srcs
  options?: ImageContainerOptions
}

type AnimationCharacterConfig<AnimationName extends string, AnimationRL extends AnimationRLType> = {
  spriteSheetConfig: Omit<SpriteSheetConfig, 'image'>
  configs: AnimationConfigsForController<AnimationName>
  regulators?: AnimationRL
}

type MovementCharacterConfig = Omit<ConfigForCharacterMovement, 'position' | 'animationController'>

export type CharacterConfig<
  ImageSrcs extends CharacterImageSrcs,
  AnimationName extends string,
  AnimationRL extends AnimationRLType,
> = BaseCharacterConfig & {
  images: ImageContainerCharacterConfig<ImageSrcs>
  animation: AnimationCharacterConfig<AnimationName, AnimationRL>
  movement: MovementCharacterConfig
}

export class Character<
  ImageSrcs extends CharacterImageSrcs,
  AnimationName extends string,
  AnimationRL extends AnimationRLType = never,
> extends Body {
  name: string
  screen: GameScreen
  imageContainer: ImageContainer<ImageSrcs>
  spriteSheet: SpriteSheet
  animationController: CharacterAnimationController<AnimationName, AnimationRL>
  movement: CharacterMovement

  constructor(
    config: CharacterConfig<
      ImageSrcs,
      CharacterAnimationName<AnimationName>,
      CharacterAnimationRegulatorList<AnimationRL>
    >,
  ) {
    const { is, name, screen, images, animation, movement } = config

    super({ is: is })

    this.name = name
    this.screen = screen

    this.imageContainer = new ImageContainer(images.srcs, images.options)

    this.spriteSheet = new SpriteSheet({
      ...animation.spriteSheetConfig,
      image: this.imageContainer.list.spriteSheet.imageElement,
    })

    this.animationController = new AnimationController<
      CharacterAnimationName<AnimationName>,
      CharacterAnimationRegulatorList<AnimationRL>
    >({
      spriteSheet: this.spriteSheet,
      configs: animation.configs,
      initialValue: 'walkDown',
      regulators: merge(
        defaultCharacterAnimationRegulatorList,
        animation.regulators ?? {},
      ) as CharacterAnimationRegulatorList<AnimationRL>,
    })

    this.setSpriteScale(this.animationController.currentSprite.scale)

    this.movement = new CharacterMovement({
      position: this.position,
      animationController: this.animationController as DefaultCharacterAnimationController,
      initialMovementStateConfig: movement.initialMovementStateConfig,
    })
  }

  setSpriteScale = (scale: number): void => {
    this.animationController.setScale(scale)
    this.setSize({ width: this.currentSprite.scaledWidth, height: this.currentSprite.scaledHeight })
  }

  update = (): void => {
    this.animationController.currentAnimation.update()
    this.screen.drawSprite(this.currentSprite, this.position)
  }

  get currentSprite(): Sprite {
    return this.animationController.currentSprite
  }
}
