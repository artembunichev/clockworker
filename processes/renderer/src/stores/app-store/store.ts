import { makeAutoObservable } from 'mobx';

import { isElectron } from 'shared/lib/is-electron';

import { AppSettingsStore } from 'stores/app-settings/store';

import { closeAllUnclosedPopups } from '../lib/popups';
import { PopupHistory } from '../popup-history';
import { AppPopups } from './popups';

type AppScreen = 'main' | 'game';

type Config = {
  appSettings: AppSettingsStore;
  popupHistory: PopupHistory;
};

export class AppStore {
  private appSettings: AppSettingsStore;
  private popupHistory: PopupHistory;
  popups: AppPopups;

  screen: AppScreen = 'main';
  isQuit = false;

  constructor( config: Config ) {
    const { appSettings, popupHistory } = config;

    this.appSettings = appSettings;
    this.popupHistory = popupHistory;
    this.popups = new AppPopups( this.popupHistory );

    makeAutoObservable( this );
  }

  setScreen = ( screen: AppScreen ): void => {
    closeAllUnclosedPopups( this.popupHistory );
    this.screen = screen;
  };

  setIsQuit = ( value: boolean ): void => {
    this.isQuit = value;
  };
  quitGame = async (): Promise<void> => {
    this.setIsQuit( true );
    if ( isElectron() ) {
      await this.appSettings.saveSettingsToFile();
    }
    closeAllUnclosedPopups( this.popupHistory );
    window.close();
  };
}
