import { makeAutoObservable } from 'mobx';

import { Popup } from 'stores/entities/popup';
import { PopupHistory } from 'stores/popup-history';

import { GamePauseController } from './pause-controller';

type Config = {
  popupHistory: PopupHistory;
  pauseController: GamePauseController;
};

export class GamePopups {
  history: PopupHistory;
  private pauseController: GamePauseController;

  pauseMenu: Popup;
  settingsMenu: Popup;

  constructor( config: Config ) {
    const { popupHistory, pauseController } = config;
    this.history = popupHistory;
    this.pauseController = pauseController;

    this.pauseMenu = new Popup( {
      name: 'game_pauseMenu',
      onOpen: () => this.pauseController.pauseGame(),
      onClose: () => this.pauseController.resumeGame(),
      history: this.history,
    } );
    this.settingsMenu = new Popup( { name: 'game_settingsMenu', history: this.history } );

    makeAutoObservable( this );
  }
}
