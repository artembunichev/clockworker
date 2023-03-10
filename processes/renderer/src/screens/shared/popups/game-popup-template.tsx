import { observer } from 'mobx-react-lite';
import React from 'react';

import { FC } from 'basic-utility-types';
import { Callback } from 'shared/types/basic-utility-types';

import { Popup as PopupStore } from 'stores/entities/popup';

import { Popup, PopupProps } from 'components/popup/popup-template';

export const closeGamePopup = (popup: PopupStore): void => {
  popup.close();
};

export type GamePopupProps = {
  popup: PopupStore;
} & Omit<PopupProps, 'isOpened' | 'fnForClosing'>;

export const GamePopup: FC<GamePopupProps> = observer(
  ({ popup, width, height, styles, title, titleStyles, withCloseButton, onClose, children }) => {
    const isOpened = popup.isOpened;
    const fnForClosing: Callback = (): void => {
      closeGamePopup(popup);
      onClose?.();
    };

    return (
      <Popup
        width={width}
        height={height}
        styles={styles}
        title={title}
        titleStyles={titleStyles}
        withCloseButton={withCloseButton}
        isOpened={isOpened}
        fnForClosing={fnForClosing}
      >
        {children}
      </Popup>
    );
  },
);
