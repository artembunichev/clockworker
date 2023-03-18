import { FC } from 'basic-utility-types';
import { SettingsMenuTemplate } from 'components/settings/settings-menu-template';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from 'stores/root-store/context';
import { GeneralAppSettings } from './general';

export const AppSettingsMenu: FC = observer( () => {
  const { appStore } = useStore();

  const { settingsMenu } = appStore.popups;

  return (
    <SettingsMenuTemplate popup={ settingsMenu }>
      <GeneralAppSettings />
    </SettingsMenuTemplate>
  );
} );
