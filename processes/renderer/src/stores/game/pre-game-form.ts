import { makeAutoObservable } from 'mobx'

export type PreGameFormFields = Pick<PreGameForm, 'playerCharacterName' | 'marketName'>

export class PreGameForm {
  constructor() {
    makeAutoObservable(this)
  }

  playerCharacterName = ''
  setPlayerCharacterName = (name: string): void => {
    this.playerCharacterName = name
  }

  marketName = ''
  setMarketName = (name: string): void => {
    this.marketName = name
  }
}
