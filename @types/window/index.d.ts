import { IpcRenderer } from 'electron'

declare global {
  interface Window {
    ipcRenderer: IpcRenderer
  }
  interface Array<T> {
    findLast(predicate: (value: T, index: number, obj: Array<T>) => unknown, thisArg?: any): T
  }
}
