import { makeAutoObservable } from 'mobx';

import { Callback } from 'shared/types/basic-utility-types';

import { OpenHistoryNote, PopupHistory } from '../popup-history';

type PopupCallback = Callback | null;

export type PopupCallbackOptions = {
  overwrite?: boolean;
};

type PopupCallbackInfo = {
  fn: PopupCallback;
  options?: PopupCallbackOptions;
};

type PopupOnOpenConfig = {
  // попап, который закрылся и сразу открыл этот попап
  // к нему нужно будет вернуться после закрытия этого попапа
  forwardedFrom: {
    popup: Popup;
    onClose: PopupCallbackInfo;
  };
};

type PopupOpenParams = {
  onOpen?: PopupCallbackInfo;
  config?: PopupOnOpenConfig;
};

export type PopupToggleConfig = {
  onOpen?: PopupCallbackInfo;
  onClose?: PopupCallbackInfo;
};

type Config = {
  name: string;
  onOpen?: Callback;
  onClose?: Callback;
  history: PopupHistory;
};

export class Popup {
  name: string;
  onOpen: PopupCallback;
  onClose: PopupCallback;
  private history: PopupHistory;

  isOpened = false;

  constructor( config: Config ) {
    const { name, onOpen, onClose, history } = config ?? {};

    this.name = name;
    this.setOnOpen( onOpen ?? null );
    this.setOnClose( onClose ?? null );
    this.history = history;

    makeAutoObservable( this );
  }

  setOnOpen = ( onOpen: PopupCallback ): void => {
    this.onOpen = onOpen;
  };
  setOnClose = ( onClose: PopupCallback ): void => {
    this.onClose = onClose;
  };

  private handleCallback = (
    callbackType: 'open' | 'close',
    callback?: PopupCallback,
    options?: PopupCallbackOptions,
  ): void => {
    const { overwrite = true } = options ?? {};

    const internalCallback = callbackType === 'open' ? this.onOpen : this.onClose;

    if ( callback !== undefined ) {
      if ( overwrite ) {
        callback?.();
      } else {
        const mergedCallback = (): void => {
          internalCallback?.();
          callback?.();
        };
        mergedCallback();
      }
    } else {
      internalCallback?.();
    }
  };

  private openDirectly = ( onOpen?: PopupCallback, options?: PopupCallbackOptions ): void => {
    this.isOpened = true;
    this.handleCallback( 'open', onOpen, options );
  };

  // если onOpen / onClose === null - значит пустая функция,
  // а если undefined - значит будет использоваться функция по умолчанию
  open = ( params?: PopupOpenParams ): void => {
    const { onOpen, config } = params ?? {};

    const { forwardedFrom } = config ?? {};

    if ( forwardedFrom ) {
      const { fn, options } = forwardedFrom.onClose;
      forwardedFrom.popup.close( fn, options );
    }

    const { fn, options } = onOpen ?? {};
    this.openDirectly( fn, options );

    this.history.createOpenNote( { popup: this, forwardedFrom: forwardedFrom?.popup ?? null } );
  };

  private closeDirectly = ( onClose?: PopupCallback, options?: PopupCallbackOptions ): void => {
    this.isOpened = false;
    this.handleCallback( 'close', onClose, options );
  };

  close = ( onClose?: PopupCallback, options?: PopupCallbackOptions ): void => {
    this.closeDirectly( onClose, options );

    const lastNoteAboutPopupOpen: OpenHistoryNote = this.history.notes.findLast( ( note ) => {
      return note.event === 'open' && note.popup.name === this.name;
    } ) as OpenHistoryNote;

    const { event, forwardedFrom = null } = lastNoteAboutPopupOpen;

    if ( event === 'open' && forwardedFrom !== null ) {
      forwardedFrom.open();
    }

    this.history.createCloseNote( { popup: this } );
  };

  toggle = ( config?: PopupToggleConfig ): void => {
    const { onOpen, onClose } = config ?? {};

    if ( !this.isOpened ) {
      this.open( { onOpen } );
    } else {
      this.close( onClose?.fn, onClose?.options );
    }
  };
}
