import { BrowserWindow, ipcMain as _ipcMain, app } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as fs from 'fs'
import * as path from 'path'

import { AnyObject } from '../shared/types/basic-utility-types'
import { TypedBrowserWindow, TypedIpcMain } from '../shared/types/typed-electron-api'
import { DownloadProgressInfo, IpcEventName, UpdateInfo } from '../shared/types/types'
import { appSettingsFilename } from './filenames'

const ipcMain = _ipcMain as TypedIpcMain<IpcEventName>

var mainWindow: TypedBrowserWindow<IpcEventName> | null
const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../assets/clockworker-icon.ico'),
  })

  mainWindow.setFullScreen(true)
  mainWindow.removeMenu()

  mainWindow.loadFile(path.join(__dirname, '../index.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

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

const userDataPath = app.getPath('userData')
const pathToAppSettings = `${userDataPath}/${appSettingsFilename}`

ipcMain.on('checkIfAppSettingsFileExists', (event) => {
  const fileExists = fs.existsSync(pathToAppSettings)
  event.returnValue = fileExists
})

ipcMain.handle<AnyObject>('setAppSettingsToFileAsync', async (_, settings) => {
  return fs.promises.writeFile(pathToAppSettings, JSON.stringify(settings), {
    encoding: 'utf-8',
  })
})

ipcMain.on<AnyObject>('setAppSettingsToFileSync', (_, settings) => {
  fs.writeFileSync(pathToAppSettings, JSON.stringify(settings), {
    encoding: 'utf-8',
  })
})

ipcMain.on('getAppSettings', (event) => {
  const content = fs.readFileSync(pathToAppSettings, { encoding: 'utf-8' })
  event.returnValue = JSON.parse(content)
})
