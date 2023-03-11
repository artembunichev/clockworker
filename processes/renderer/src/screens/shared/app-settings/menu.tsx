import { observer } from 'mobx-react-lite';
import React from 'react';

import { FC } from 'basic-utility-types';

import { useStore } from 'stores/root-store/context';

import { SettingsMenuTemplate } from 'components/settings/settings-menu-template';

import { GeneralAppSettings } from './general';

export const AppSettingsMenu: FC = observer( () => {
  const { appStore } = useStore();

  const { settingsMenu } = appStore.popups;

  return (
    <SettingsMenuTemplate popup={settingsMenu}>
      <GeneralAppSettings />
    </SettingsMenuTemplate>
  );
} );
