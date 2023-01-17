import playerCharacterSpriteSheetSrc from 'content/sprites/characters/Player.png'

import { GameSettings } from '../../settings/settings'
import { AnyCharacterConfig, Character } from '../character'
import { PlayerCharacterAnimationName, getPlayerCharacterAnimationConfigs } from './animation'
import {
  PlayerCharacterMovement,
  PlayerCharacterMovementRegulatorName,
  PlayerCharacterMovementTypeName,
  playerCharacterInitialMovementType,
  playerCharacterMovementRegulators,
  playerCharacterMovementTypes,
} from './movement/movement'

type ImageSrcs = { spriteSheet: typeof playerCharacterSpriteSheetSrc }

const initialSpriteScale = 2.5

export type PlayerCharacterConfig = Pick<AnyCharacterConfig, 'name' | 'screen'> & {
  settings: GameSettings
}

export class PlayerCharacter extends Character<
  ImageSrcs,
  PlayerCharacterAnimationName,
  PlayerCharacterMovementTypeName,
  PlayerCharacterMovementRegulatorName
> {
  private settings: GameSettings

  movement: PlayerCharacterMovement

  constructor(config: PlayerCharacterConfig) {
    const { name, screen, settings } = config

    super({
      name,
      is: 'player',
      imageContainerConfig: {
        imageSrcs: {
          spriteSheet: playerCharacterSpriteSheetSrc,
        },
        options: {
          loadImmediately: true,
        },
      },
      spriteSheetConfig: {
        spriteWidth: 14,
        spriteHeight: 27,
        firstSkipX: 1,
        firstSkipY: 5,
        skipX: 2,
        skipY: 5,
        defaultScale: initialSpriteScale,
      },
      initialSpriteScale,
      screen,
      animationConfigs: getPlayerCharacterAnimationConfigs({ initialScale: initialSpriteScale }),
      movementTypes: playerCharacterMovementTypes,
      regulators: playerCharacterMovementRegulators,
      initialMovementType: playerCharacterInitialMovementType,
    })

    this.settings = settings

    //! движение
    this.movement = new PlayerCharacterMovement({
      position: this.position,
      settings: this.settings,
      animationController: this.animationController,
      movementTypes: playerCharacterMovementTypes,
      regulators: playerCharacterMovementRegulators,
      initialMovementType: playerCharacterInitialMovementType,
    })
  }
}
