import { FC } from 'basic-utility-types';
import { colors } from 'lib/theme';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Callback } from 'shared/types/basic-utility-types';
import { useStore } from 'stores/root-store/context';
import { GameConfirmPopup } from '../game-confirm-popup';

type Props = {
  question?: string;
  onAccept?: Callback;
};

export const QuitInMainMenuConfirm: FC<Props> = observer( ( { question, onAccept } ) => {
  const { appStore } = useStore();
  const { quitInMainMenuConfirm } = appStore.popups;

  return (
    <GameConfirmPopup
      popup={ quitInMainMenuConfirm }
      width={ '550px' }
      height={ '300px' }
      styles={ {
        backgroundColor: colors.mainLight,
      } }
      question={ question ?? 'Выйти в главное меню?' }
      questionStyles={ {
        fontSize: '30px',
      } }
      acceptText={ 'Да' }
      onAccept={ () => {
        onAccept?.();
        appStore.setScreen( 'main' );
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
