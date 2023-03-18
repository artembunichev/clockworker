import { makeAutoObservable } from 'mobx';
import { Popup } from 'stores/entities/popup';
import { PopupHistory } from 'stores/popup-history';

export class AppPopups {
  private history: PopupHistory;
  quitGameConfirm: Popup;
  quitInMainMenuConfirm: Popup;
  settingsMenu: Popup;

  constructor( popupHistory: PopupHistory ) {
    this.history = popupHistory;

    this.quitGameConfirm = new Popup( { name: 'app_quitGameConfirm', history: this.history } );

    this.quitInMainMenuConfirm = new Popup( {
      name: 'app_quitInMainMenuConfirm',
      history: this.history,
    } );

    this.settingsMenu = new Popup( { name: 'app_settingsMenu', history: this.history } );

    makeAutoObservable( this );
  }
}
