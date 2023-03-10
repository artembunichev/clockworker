import { CharacterController } from './characters/controller';
import { PlayerCharacter, PlayerCharacterConfig } from './characters/list/player/character';

type CreatePlayerCharacterConfig = {
  characterController: CharacterController;
  characterConfig: PlayerCharacterConfig;
};

export class Player {
  character: PlayerCharacter | null = null;
  createCharacter = async (config: CreatePlayerCharacterConfig): Promise<void> => {
    await config.characterController.createCharacter('player', config.characterConfig);
    this.character = config.characterController.characters.player;
  };
}
