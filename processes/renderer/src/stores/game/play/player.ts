import {
  PlayerCharacter,
  PlayerCharacterConfig,
} from 'stores/game/play/characters/list/player/character'

import { CharacterController } from './characters/controller'

type CreatePlayerCharacterConfig = {
  characterController: CharacterController
  characterConfig: PlayerCharacterConfig
}

export class Player {
  character: PlayerCharacter | null = null
  createCharacter = async (config: CreatePlayerCharacterConfig): Promise<void> => {
    await config.characterController.createCharacter('player', config.characterConfig)
    this.character = config.characterController.characters.player
  }
}
