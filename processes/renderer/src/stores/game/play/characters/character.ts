import { ImageContainer, ImageContainerOptions, ImageSrcs } from 'stores/entities/image-container'

import { merge } from 'lib/objects'

import { Body, BodyConfig } from '../body'
import { AnimationRLType } from '../entities/animation'
import { AnimationConfigsForController, AnimationController } from '../entities/animation-controller'
import { Sprite } from '../entities/sprite'
import { SpriteSheet, SpriteSheetConfig } from '../entities/sprite-sheet'
import { GameScreen } from '../screen'
import {
  CharacterAnimationController,
  CharacterAnimationName,
  CharacterAnimationRegulatorList,
  defaultCharacterAnimationRegulatorList,
} from './animation'
import { CharacterMovement, ConfigForCharacterMovement } from './movement/movement'

export type AnyCharacter = Character<any, any, any>
export type AnyCharacterConfig = CharacterConfig<any, any, any>

type CharacterImageSrcs = ImageSrcs & { spriteSheet: string }

type ConfigForCharacter<
  ImageSrcs extends CharacterImageSrcs,
  AnimationName extends string,
  RL extends AnimationRLType,
> = {
  name: string
  imageContainerConfig: {
    imageSrcs: ImageSrcs
    options?: ImageContainerOptions
  }
  spriteSheetConfig: Omit<SpriteSheetConfig, 'image'>
  animationConfigs: AnimationConfigsForController<AnimationName>
  animationRegulators?: RL
  screen: GameScreen
}

type ConfigForMovement<AnimationName extends string, AnimationRL extends AnimationRLType> = Omit<
  ConfigForCharacterMovement<AnimationName, AnimationRL>,
  'position' | 'animationController'
>

export type CharacterConfig<
  ImageSrcs extends CharacterImageSrcs,
  AnimationName extends string,
  AnimationRL extends AnimationRLType,
> = BodyConfig &
  ConfigForCharacter<ImageSrcs, AnimationName, AnimationRL> &
  ConfigForMovement<AnimationName, AnimationRL>

export class Character<
  ImageSrcs extends CharacterImageSrcs,
  AnimationName extends string,
  AnimationRL extends AnimationRLType = never,
> extends Body {
  name: string
  imageContainer: ImageContainer<ImageSrcs>
  spriteSheet: SpriteSheet
  screen: GameScreen

  animationController: CharacterAnimationController<AnimationName, AnimationRL>
  movement: CharacterMovement<AnimationName, AnimationRL>

  constructor(
    config: CharacterConfig<
      ImageSrcs,
      CharacterAnimationName<AnimationName>,
      CharacterAnimationRegulatorList<AnimationRL>
    >,
  ) {
    const {
      is,
      name,
      screen,
      imageContainerConfig,
      spriteSheetConfig,
      animationConfigs,
      animationRegulators,
      initialMovementStateConfig,
    } = config

    super({ is: is })

    this.name = name
    this.screen = screen

    this.imageContainer = new ImageContainer(
      imageContainerConfig.imageSrcs,
      imageContainerConfig.options,
    )

    this.spriteSheet = new SpriteSheet({
      ...spriteSheetConfig,
      image: this.imageContainer.list.spriteSheet.imageElement,
    })

    this.animationController = new AnimationController<
      CharacterAnimationName<AnimationName>,
      CharacterAnimationRegulatorList<AnimationRL>
    >({
      spriteSheet: this.spriteSheet,
      configs: animationConfigs,
      initialValue: 'walkDown',
      regulators: merge(
        defaultCharacterAnimationRegulatorList,
        animationRegulators ?? {},
      ) as CharacterAnimationRegulatorList<AnimationRL>,
    })

    this.setSpriteScale(this.animationController.currentSprite.scale)

    this.movement = new CharacterMovement({
      position: this.position,
      animationController: this.animationController,
      initialMovementStateConfig,
    })
  }

  setSpriteScale = (scale: number): void => {
    this.animationController.setScale(scale)
    this.setSize({ width: this.currentSprite.scaledWidth, height: this.currentSprite.scaledHeight })
  }

  get currentSprite(): Sprite {
    return this.animationController.currentSprite
  }

  update = (): void => {
    this.animationController.currentAnimation.update()
    this.screen.drawSprite(this.currentSprite, this.position)
  }
}
