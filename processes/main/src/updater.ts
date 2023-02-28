import { autoUpdater } from 'electron-updater'
import { DownloadProgressInfo, UpdateInfo } from 'shared/types'

import { ipcMain } from './ipc-main'
import { mainWindow } from './main-window'

export const handleUpdater = (): void => {
  autoUpdater.disableWebInstaller = true
  autoUpdater.autoDownload = false
  autoUpdater.on('update-available', ({ version, releaseNotes }) => {
    if (mainWindow) {
      mainWindow.webContents.send<UpdateInfo>('updateAvailable', {
        version,
        releaseNotes: releaseNotes as string,
      })
    }
  })

  ipcMain.on('updateGame', () => {
    autoUpdater.downloadUpdate()
  })

  autoUpdater.on('download-progress', ({ percent }) => {
    if (mainWindow) {
      return mainWindow.webContents.send<DownloadProgressInfo>('downloadProgress', {
        percentage: percent,
      })
    }
  })

  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall()
  })
}
