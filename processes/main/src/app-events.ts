import { app } from 'electron'
import { autoUpdater } from 'electron-updater'

import { createWindow, mainWindow } from './main-window'

export const handleAppEvents = (): void => {
  app.on('ready', () => {
    createWindow()
    autoUpdater.checkForUpdates()
  })

  app.on('window-all-closed', () => {
    app.quit()
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
}
