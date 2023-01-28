import { AnyCharacterConfig, Character } from 'stores/game/play/characters/character'
import { GameSettings } from 'stores/game/play/settings/settings'
import { KeyboardStore } from 'stores/keyboard.store'

import playerCharacterSpriteSheetSrc from 'content/sprites/characters/Player.png'

import {
  PlayerCharacterAnimationName,
  PlayerCharacterAnimationRegulatorList,
  playerCharacterAnimationConfigs,
} from './animation'
import {
  PlayerCharacterMovement,
  initialPlayerCharacterMovementStateConfig,
} from './movement/movement'

type ImageSrcs = { spriteSheet: typeof playerCharacterSpriteSheetSrc }

export type PlayerCharacterConfig = Pick<AnyCharacterConfig, 'name' | 'screen'> & {
  settings: GameSettings
  keyboard: KeyboardStore
}

export class PlayerCharacter extends Character<
  ImageSrcs,
  PlayerCharacterAnimationName,
  PlayerCharacterAnimationRegulatorList
> {
  private settings: GameSettings
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

    //! движение
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
