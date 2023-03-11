import { PopupHistory } from 'stores/popup-history';

export const closeLastUnclosedPopup = ( history: PopupHistory ): void => {
  const lastUnclosedPopup = history.lastUnclosedPopup;
  if ( lastUnclosedPopup ) {
    lastUnclosedPopup.close();
  }
};

export const closeAllUnclosedPopups = ( history: PopupHistory ): void => {
  history.unclosedPopups.forEach( ( popup ) => popup.close() );
};
