import { FlagSetting } from 'components/settings/flag-setting';
import { observer } from 'mobx-react-lite';
import { useStore } from 'stores/root-store/context';
import styled from 'styled-components';

export const GeneralAppSettings = observer( () => {
  const { appSettingsStore } = useStore();

  const { isGetUpdateNotifications } = appSettingsStore.editable;

  return (
    <Container>
      <Setting>
        <SettingTitle>Уведомления о новых версиях игры</SettingTitle>
        <FlagSetting setting={ isGetUpdateNotifications } checkboxSize={ 31 } />
      </Setting>
    </Container>
  );
} );

const Container = styled.div``;
const Setting = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SettingTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 23px;
`;
