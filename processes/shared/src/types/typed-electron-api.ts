import {
  BrowserWindow,
  IpcMain,
  IpcMainEvent,
  IpcMainInvokeEvent,
  IpcRenderer,
  IpcRendererEvent,
  WebContents,
} from 'electron';

export interface TypedIpcMain<EventName extends string> extends IpcMain {
  on<T>(channel: EventName, listener: (event: IpcMainEvent, arg: T) => void): this;
  handle<T>(
    channel: EventName,
    listener: (event: IpcMainInvokeEvent, arg: T) => Promise<void> | any,
  ): void;
}

export interface TypedIpcRenderer<EventName extends string> extends IpcRenderer {
  on<T>(channel: EventName, listener: (event: IpcRendererEvent, arg: T) => void): this;
  send<T>(channel: EventName, arg?: T): void;
  sendSync<T, R>(channel: EventName, arg?: T): R;
  invoke<T, R>(channel: EventName, arg?: T): Promise<R>;
}

interface TypedWebContents<EventName extends string> extends WebContents {
  send<T>(channel: EventName, arg?: T): void;
}

export interface TypedBrowserWindow<EventName extends string> extends BrowserWindow {
  readonly webContents: TypedWebContents<EventName>;
}
