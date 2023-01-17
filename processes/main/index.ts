import { BrowserWindow, app, ipcMain as electronIpcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as fs from 'fs'
import * as path from 'path'
import { TypedBrowserWindow, TypedIpcMain } from 'process-shared/types/typed-electron-api'
import { DownloadProgressInfo, IpcEventName, UpdateInfo } from 'process-shared/types/types'

const ipcMain = electronIpcMain as TypedIpcMain<IpcEventName>

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

const userData = app.getPath('userData')

ipcMain.on('checkIfAppSettingsFileExists', (event) => {
  const fileExists = fs.existsSync(`${userData}/app-settings.json`)
  event.returnValue = fileExists
})

ipcMain.handle<Record<any, string>>('setAppSettingsToFileAsync', async (_, settings) => {
  return fs.promises.writeFile(`${userData}/app-settings.json`, JSON.stringify(settings), {
    encoding: 'utf-8',
  })
})

ipcMain.on<Record<any, string>>('setAppSettingsToFileSync', (_, settings: Record<any, string>) => {
  fs.writeFileSync(`${userData}/app-settings.json`, JSON.stringify(settings), {
    encoding: 'utf-8',
  })
})

ipcMain.on('getAppSettings', (event) => {
  const content = fs.readFileSync(`${userData}/app-settings.json`, { encoding: 'utf-8' })
  event.returnValue = JSON.parse(content)
})
