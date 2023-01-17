import { BrowserWindow } from 'electron'
import * as path from 'path'

import { TypedBrowserWindow } from '../shared/types/typed-electron-api'
import { IpcEventName } from '../shared/types/types'

export var mainWindow: TypedBrowserWindow<IpcEventName> | null
export const createWindow = (): void => {
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
