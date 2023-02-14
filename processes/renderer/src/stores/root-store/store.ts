import isElectron from 'is-electron'

import { AppSettingsStore } from 'stores/app-settings/store'
import { AppStore } from 'stores/app-store/store'
import { GameStore } from 'stores/game/store'
import { KeyboardStore } from 'stores/keyboard.store'
import { PopupHistory } from 'stores/popup-history'
import { UpdateStore } from 'stores/update.store'

export class RootStore {
  appSettingsStore = new AppSettingsStore()
  popupHistory = new PopupHistory()
  appStore = new AppStore({ appSettings: this.appSettingsStore, popupHistory: this.popupHistory })
  updateStore: UpdateStore | null = isElectron()
    ? new UpdateStore({ settings: this.appSettingsStore })
    : null
  keyboardStore = new KeyboardStore()
  createGameStore = (): GameStore => {
    return new GameStore({
      popupHistory: this.popupHistory,
      keyboard: this.keyboardStore,
    })
  }
}
