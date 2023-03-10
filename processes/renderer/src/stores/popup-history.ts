import { makeAutoObservable } from 'mobx';

import { countOf, last } from 'shared/lib/arrays';

import { Popup } from './entities/popup';

export type OpenHistoryNote = {
  popup: Popup;
  event: 'open';
  forwardedFrom: Popup | null;
};

export type CloseHistoryNote = {
  popup: Popup;
  event: 'close';
};

type HistoryNote = OpenHistoryNote | CloseHistoryNote;

type CreateOpenNoteConfig = Pick<OpenHistoryNote, 'popup' | 'forwardedFrom'>;
type CreateCloseNoteConfig = Pick<CloseHistoryNote, 'popup'>;

export class PopupHistory {
  notes: Array<HistoryNote> = [];
  private notesForClear = 100;

  constructor() {
    makeAutoObservable(this);
  }

  clearNotes = (): void => {
    this.notes = [];
  };

  checkForClear = (): void => {
    if (!this.unclosedPopups.length && this.notes.length >= this.notesForClear) {
      this.clearNotes();
    }
  };

  createOpenNote = ({ popup, forwardedFrom }: CreateOpenNoteConfig): void => {
    this.notes.push({
      popup,
      event: 'open',
      forwardedFrom,
    });
  };

  createCloseNote = ({ popup }: CreateCloseNoteConfig): void => {
    this.notes.push({
      popup,
      event: 'close',
    });
    this.checkForClear();
  };

  get unclosedPopups(): Array<Popup> {
    return this.notes.reduce((acc, note) => {
      const openedCount = countOf(
        this.notes,
        ({ event, popup }) => popup.name === note.popup.name && event === 'open',
      );
      const closedCount = countOf(
        this.notes,
        ({ event, popup }) => popup.name === note.popup.name && event === 'close',
      );
      if (acc.every((p) => p.name !== note.popup.name) && openedCount > closedCount) {
        acc.push(note.popup);
      }
      return acc;
    }, [] as Array<Popup>);
  }

  get lastUnclosedPopup(): Popup | null {
    return last(this.unclosedPopups) ?? null;
  }

  get isOpenedPopups(): boolean {
    const openNoteCount = countOf(this.notes, ({ event }) => event === 'open');
    const closeNoteCount = countOf(this.notes, ({ event }) => event === 'close');
    return openNoteCount !== closeNoteCount;
  }
}
