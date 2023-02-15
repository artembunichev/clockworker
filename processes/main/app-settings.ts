import { app } from 'electron'
import * as fs from 'fs'

import { appSettingsFilename } from './filenames'
import { ipcMain } from './ipc-main'

const userDataPath = app.getPath('userData')
const pathToAppSettings = `${userDataPath}/${appSettingsFilename}`

export const handleAppSettings = (): void => {
  ipcMain.on('checkIfAppSettingsFileExists', (event) => {
    const fileExists = fs.existsSync(pathToAppSettings)
    event.returnValue = fileExists
  })

  ipcMain.handle<object>('setAppSettingsToFileAsync', async (_, settings) => {
    return fs.promises.writeFile(pathToAppSettings, JSON.stringify(settings), {
      encoding: 'utf-8',
    })
  })

  ipcMain.on<object>('setAppSettingsToFileSync', (_, settings) => {
    fs.writeFileSync(pathToAppSettings, JSON.stringify(settings), {
      encoding: 'utf-8',
    })
  })

  ipcMain.on('getAppSettings', (event) => {
    const content = fs.readFileSync(pathToAppSettings, { encoding: 'utf-8' })
    event.returnValue = JSON.parse(content)
  })
}
