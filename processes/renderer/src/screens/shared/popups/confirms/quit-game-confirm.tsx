import { FC } from 'basic-utility-types';
import { colors } from 'lib/theme';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Callback } from 'shared/types/basic-utility-types';
import { useStore } from 'stores/root-store/context';
import { GameConfirmPopup } from '../game-confirm-popup';

type Props = {
  onAccept?: Callback;
};

export const QuitGameConfirm: FC<Props> = observer( ( { onAccept } ) => {
  const { appStore } = useStore();

  const { quitGameConfirm } = appStore.popups;

  return (
    <GameConfirmPopup
      popup={ quitGameConfirm }
      width={ '550px' }
      height={ '300px' }
      styles={ {
        backgroundColor: colors.mainLight,
      } }
      question={ 'Выйти из игры?' }
      acceptText={ 'Да' }
      onAccept={ () => {
        onAccept?.();
        appStore.quitGame();
      } }
      rejectText={ 'Нет' }
      onReject={ null }
      buttonsStyles={ {
        width: '140px',
        padding: '10px',
        backgroundColor: colors.mainMedium,
      } }
    />
  );
} );
