import { IpcEventName } from '../../processes/shared/types'
import { TypedIpcRenderer } from '../../processes/shared/types/typed-electron-api'

declare global {
  interface Window {
    ipcRenderer: TypedIpcRenderer<IpcEventName>
  }
  interface Array<T> {
    findLast(predicate: (value: T, index: number, obj: Array<T>) => unknown, thisArg?: any): T
  }
}
