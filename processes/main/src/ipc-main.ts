import { ipcMain as _ipcMain } from 'electron'
import { IpcEventName } from 'shared/types'
import { TypedIpcMain } from 'shared/types/typed-electron-api'

export const ipcMain = _ipcMain as TypedIpcMain<IpcEventName>
