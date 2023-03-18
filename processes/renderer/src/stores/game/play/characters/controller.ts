import { computed, makeObservable, observable } from 'mobx';
import { remove } from 'shared/lib/arrays';
import { objectValues } from 'shared/lib/objects';
import { PropertyOf } from 'shared/types/basic-utility-types';
import { PlayerCharacter } from './list/player/character';

export type CharacterName = keyof CharacterController[ 'refList' ];
type Character = InstanceType<PropertyOf<CharacterController[ 'refList' ]>>;
export type Characters = Record<CharacterName, Character>;

export class CharacterController {
  // список персонажей, использующихся в контроллере
  private refList = { player: PlayerCharacter };
  // список созданных персонажей
  characters: Characters = {} as Characters;
  activeCharactersNames: Array<CharacterName> = [];

  constructor() {
    makeObservable( this, {
      characters: observable,
      activeCharactersNames: observable,
      isAllActiveCharactersImagesLoaded: computed,
    } );
  }

  createCharacter = async <
    T extends CharacterName,
    CharacterConfig extends ConstructorParameters<CharacterController[ 'refList' ][ T ]>[ number ],
  >(
    name: T,
    ...args: CharacterConfig extends never ? [ undefined ] : [ CharacterConfig ]
  ): Promise<void> => {
    const characterConfig = args[ 0 ];
    this.characters[ name ] = new this.refList[ name ]( characterConfig );
    await this.characters[ name ].imageContainer.loadAll();
  };

  addActiveCharacter = ( characterName: CharacterName ): void => {
    this.activeCharactersNames.push( characterName );
  };
  addActiveCharacters = ( charactersNames: Array<CharacterName> ): void => {
    charactersNames.forEach( ( characterName ) => {
      this.addActiveCharacter( characterName );
    } );
  };

  removeActiveCharacter = ( characterName: CharacterName ): void => {
    this.activeCharactersNames = remove( this.activeCharactersNames, characterName );
  };
  removeActiveCharacters = ( characterNames: Array<CharacterName> ): void => {
    this.activeCharactersNames = this.activeCharactersNames.filter( ( name ) =>
      characterNames.every( ( characterName ) => name === characterName ),
    );
  };

  clearActiveCharacters = (): void => {
    this.activeCharactersNames = [];
  };

  get activeCharacters(): Array<Character> {
    return this.activeCharactersNames.map( ( characterName ) => {
      return this.characters[ characterName ];
    } );
  }

  get isAllActiveCharactersImagesLoaded(): boolean {
    return objectValues( this.characters ).every(
      ( activeCharacter ) => activeCharacter.imageContainer.isAllImagesLoaded,
    );
  }
}
