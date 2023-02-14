import { KeyboardStore } from 'stores/keyboard.store'

import playerCharacterSpriteSheetSrc from 'content/sprites/characters/Player.png'

import { AnyCharacterConfig, Character } from '../../character'
import {
  PlayerCharacterAnimationName,
  PlayerCharacterAnimationRegulatorName,
  playerCharacterAnimationConfigs,
} from './animation'
import {
  PlayerCharacterMovement,
  PlayerCharacterMovementSettings,
  initialPlayerCharacterMovementStateConfig,
} from './movement/movement'

type PlayerCharacterSettings = PlayerCharacterMovementSettings

type ImageSrcs = { spriteSheet: typeof playerCharacterSpriteSheetSrc }

export type PlayerCharacterConfig = Pick<AnyCharacterConfig, 'name' | 'screen'> & {
  settings: PlayerCharacterSettings
  keyboard: KeyboardStore
}

export class PlayerCharacter extends Character<
  ImageSrcs,
  PlayerCharacterAnimationName,
  PlayerCharacterAnimationRegulatorName
> {
  private settings: PlayerCharacterSettings
  private keyboard: KeyboardStore
  movement: PlayerCharacterMovement

  constructor(config: PlayerCharacterConfig) {
    const { name, screen, settings, keyboard } = config

    super({
      is: 'player',
      name,
      screen,
      images: {
        srcs: {
          spriteSheet: playerCharacterSpriteSheetSrc,
        },
        options: {
          loadImmediately: true,
        },
      },
      animation: {
        spriteSheetConfig: {
          spriteWidth: 14,
          spriteHeight: 27,
          firstSkipX: 1,
          firstSkipY: 5,
          skipX: 2,
          skipY: 5,
        },
        configs: playerCharacterAnimationConfigs,
      },
      movement: { initialMovementStateConfig: initialPlayerCharacterMovementStateConfig },
    })

    this.settings = settings
    this.keyboard = keyboard

    this.movement = new PlayerCharacterMovement({
      position: this.position,
      settings: this.settings,
      animationController: this.animationController,
      initialMovementStateConfig: initialPlayerCharacterMovementStateConfig,
      keyboard: this.keyboard,
    })

    const superUpdate = this.update
    this.update = (): void => {
      superUpdate()
      this.movement.update()
    }
  }
}
