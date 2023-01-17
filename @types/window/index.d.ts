import { TypedIpcRenderer } from '../../processes/shared/types/typed-electron-api'
import { IpcEventName } from '../../processes/shared/types/types'

declare global {
  interface Window {
    ipcRenderer: TypedIpcRenderer<IpcEventName>
  }
  interface Array<T> {
    findLast(predicate: (value: T, index: number, obj: Array<T>) => unknown, thisArg?: any): T
  }
}
