import { makeAutoObservable } from 'mobx';

import { KeyboardStore } from 'stores/keyboard.store';
import { closeAllUnclosedPopups } from 'stores/lib/popups';
import { PopupHistory } from 'stores/popup-history';

import { DataFromPreGameForm, GamePlayStore } from './play/store';
import { PreGameForm } from './pre-game-form';

type GameScreen = 'preGameForm' | 'play';

type GameStoreConfig = {
  popupHistory: PopupHistory;
  keyboard: KeyboardStore;
};

export class GameStore {
  private popupHistory: PopupHistory;
  protected keyboard: KeyboardStore;

  screen: GameScreen = 'preGameForm';
  preGameForm = new PreGameForm();
  playStore: GamePlayStore | null = null;

  constructor( config: GameStoreConfig ) {
    const { popupHistory, keyboard } = config;

    this.popupHistory = popupHistory;
    this.keyboard = keyboard;

    makeAutoObservable( this );
  }

  setScreen = ( screen: GameScreen ): void => {
    this.screen = screen;
  };

  createGamePlayStore = (): void => {
    const dataFromPreGameForm: DataFromPreGameForm = {
      playerCharacterName: this.preGameForm.playerCharacterName,
      marketName: this.preGameForm.marketName,
    };

    const gamePlayStore = new GamePlayStore( {
      popupHistory: this.popupHistory,
      keyboard: this.keyboard,
      dataFromPreGameForm,
    } );

    this.playStore = gamePlayStore;
  };

  startGame = async (): Promise<void> => {
    this.createGamePlayStore();
    if ( this.playStore ) {
      this.playStore.run();
      this.setScreen( 'play' );
    }
  };

  endGame = (): void => {
    closeAllUnclosedPopups( this.popupHistory );
    this.playStore?.setIsPlay( false );
    this.playStore = null;
  };
}
