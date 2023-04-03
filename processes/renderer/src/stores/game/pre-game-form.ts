import { makeAutoObservable } from 'mobx'

export type PreGameFormFields = Pick<PreGameForm, 'playerCharacterName' | 'marketName'>

export class PreGameForm {
  playerCharacterName = '';
  marketName = '';

  constructor() {
    makeAutoObservable( this )
  }

  setPlayerCharacterName = ( name: string ): void => {
    this.playerCharacterName = name
  };

  setMarketName = ( name: string ): void => {
    this.marketName = name
  };
}
