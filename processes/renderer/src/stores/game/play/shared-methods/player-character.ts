import { PlayerCharacter } from '../characters/list/player/character';

export class PlayerCharacterSharedMethods {
  private playerCharacter: PlayerCharacter | null = null;

  setPlayerCharacter = (playerCharacter: PlayerCharacter): void => {
    this.playerCharacter = playerCharacter;
  };

  addMovementKeysProhibitor = (prohibitorName: string): void => {
    this.playerCharacter?.movement.keys.prohibitorsController.add(prohibitorName);
  };
  removeMovementKeysProhibitor = (prohibitorName: string): void => {
    this.playerCharacter?.movement.keys.prohibitorsController.remove(prohibitorName);
  };
}
