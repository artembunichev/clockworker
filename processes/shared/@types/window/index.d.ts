import { IpcEventName } from '../../src/types'
import { TypedIpcRenderer } from '../../src/types/typed-electron-api'

declare global {
  interface Window {
    ipcRenderer: TypedIpcRenderer<IpcEventName>
  }
  interface Array<T> {
    findLast( predicate: ( value: T, index: number, obj: Array<T> ) => unknown, thisArg?: any ): T
  }
}
