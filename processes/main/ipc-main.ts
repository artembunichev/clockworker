import { ipcMain as _ipcMain } from 'electron'

import { TypedIpcMain } from '../shared/types/typed-electron-api'
import { IpcEventName } from '../shared/types/types'

export const ipcMain = _ipcMain as TypedIpcMain<IpcEventName>
