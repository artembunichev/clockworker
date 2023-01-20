import { ImageContainer, ImageContainerOptions, ImageSrcs } from 'stores/entities/image-container'

import { Body, BodyConfig } from '../body'
import { AnimationConfigs, AnimationController } from '../entities/animation-controller'
import { Sprite } from '../entities/sprite'
import { SpriteSheet, SpriteSheetConfig } from '../entities/sprite-sheet'
import { GameScreen } from '../screen'
import { CharacterMovementAnimationName } from './animation'
import { CharacterMovement, ConfigForCharacterMovement } from './movement/movement'

export type AnyCharacter = Character<any, any>
export type AnyCharacterConfig = CharacterConfig<any, any>

type CharacterImageSrcs = ImageSrcs & { spriteSheet: string }

type ConfigForCharacter<ImageSrcs extends CharacterImageSrcs, AnimationName extends string> = {
  name: string
  imageContainerConfig: {
    imageSrcs: ImageSrcs
    options?: ImageContainerOptions
  }
  initialSpriteScale: number
  spriteSheetConfig: Omit<SpriteSheetConfig, 'image'>
  screen: GameScreen
  animationConfigs: AnimationConfigs<AnimationName>
}

type ConfigForMovement = Omit<ConfigForCharacterMovement, 'position' | 'animationController'>

export type CharacterConfig<
  ImageSrcs extends CharacterImageSrcs,
  AnimationName extends CharacterMovementAnimationName,
> = BodyConfig & ConfigForCharacter<ImageSrcs, AnimationName> & ConfigForMovement

export class Character<
  ImageSrcs extends CharacterImageSrcs,
  AnimationName extends CharacterMovementAnimationName,
> extends Body {
  name: string
  imageContainer: ImageContainer<ImageSrcs>
  spriteSheet: SpriteSheet
  screen: GameScreen

  animationController: AnimationController<AnimationName>
  movement: CharacterMovement

  constructor(config: CharacterConfig<ImageSrcs, AnimationName>) {
    const {
      is,
      name,
      screen,
      imageContainerConfig,
      spriteSheetConfig,
      initialSpriteScale,
      animationConfigs,
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

    this.animationController = new AnimationController({
      spriteSheet: this.spriteSheet,
      configs: animationConfigs,
      initialValue: 'walkDown' as AnimationName,
    })

    this.setSpriteScale(initialSpriteScale ?? 1)

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
    this.animationController.current.update()
    this.screen.drawSprite(this.currentSprite, this.position)
  }
}
