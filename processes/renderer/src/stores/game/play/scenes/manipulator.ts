import { Size } from 'project-utility-types/abstract';
import { XY } from 'project-utility-types/plane';
import { CharacterName, Characters } from '../characters/controller';

type PositionOnScene = { x: 'right' | 'left' | 'center'; y: 'down' | 'top' | 'center'; };

type CharacterPositionOnMap = Partial<XY> | Partial<PositionOnScene>;
const isPositionOnScene = ( position: CharacterPositionOnMap ): position is Partial<PositionOnScene> => {
  return typeof position.x === 'string' || typeof position.y === 'string';
};

type SceneCharactersManipulatorConfig = {
  mapSize: Size;
  characterList: Characters;
};

export class SceneCharactersManipulator {
  private mapSize: Size;
  private characterList: Characters;

  constructor( config: SceneCharactersManipulatorConfig ) {
    const { mapSize, characterList } = config;

    this.mapSize = mapSize;
    this.characterList = characterList;
  }

  positionCharacter = ( characterName: CharacterName, position: CharacterPositionOnMap ): void => {
    const character = this.characterList[ characterName ];

    var x = character.position.x;
    var y = character.position.y;

    if ( isPositionOnScene( position ) ) {
      const rightmostX = this.mapSize.width - character.size.width;
      const leftmostX = 0;
      const downmostY = this.mapSize.height - character.size.height;
      const topmostY = 0;
      const centerX = ( rightmostX - leftmostX ) / 2;
      const centerY = ( downmostY - topmostY ) / 2;

      if ( position.x ) {
        if ( position.x === 'right' ) {
          x = rightmostX;
        } else if ( position.x === 'center' ) {
          x = centerX;
        } else if ( position.x === 'left' ) {
          x = leftmostX;
        }
      }

      if ( position.y ) {
        if ( position.y === 'down' ) {
          y = downmostY;
        } else if ( position.y === 'center' ) {
          y = centerY;
        } else if ( position.y === 'top' ) {
          y = topmostY;
        }
      }
    }

    character.position.setXY( x, y );
  };
}
