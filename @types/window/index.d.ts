import { TypedIpcRenderer } from 'main-renderer-shared/typed-electron-api'
import { IpcEventName } from 'main-renderer-shared/types'

declare global {
  interface Window {
    ipcRenderer: TypedIpcRenderer<IpcEventName>
  }
  interface Array<T> {
    findLast(predicate: (value: T, index: number, obj: Array<T>) => unknown, thisArg?: any): T
  }
}
