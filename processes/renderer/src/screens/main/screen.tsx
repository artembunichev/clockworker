import { FC } from 'basic-utility-types';
import { PixelatedButton } from 'components/pixelated/pixelated-components';
import { colors } from 'lib/theme';
import { observer } from 'mobx-react-lite';
import { QuitGameConfirm } from 'screens/shared/popups/confirms/quit-game-confirm';
import { useStore } from 'stores/root-store/context';
import styled from 'styled-components';
import { version as gameVersion } from '../../../../../package.json';
import { MainMenu } from './main-menu';
import { UpdateChecker } from './update-notification/update-checker';
import { useMainScreenEsc } from './use-esc';

export const MainScreen: FC = observer( () => {
  const { quitGameConfirm } = useStore().appStore.popups;

  useMainScreenEsc();

  const openQuitGameConfirm = (): void => {
    quitGameConfirm.open();
  };

  return (
    <>
      <UpdateChecker />
      <QuitGameConfirm />

      <Container>
        <Title>clockworker</Title>
        <Body>
          <MainMenu />
        </Body>
        <QuitGameButton onClick={ openQuitGameConfirm }>Выйти из игры</QuitGameButton>
        <GameVersion>v{ gameVersion }</GameVersion>
      </Container>
    </>
  );
} );

const Container = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;
`;
const Title = styled.div`
  font-size: 72px;
  color: ${ colors.mainMedium };
`;
const Body = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const QuitGameButton = styled( PixelatedButton ).attrs( {
  pixelsSize: 'medium',
  backgroundColor: colors.mainLight,
} )`
  position: absolute;
  bottom: 15px;
  right: 25px;
  font-size: 24px;
  padding: 10px;
`;
const GameVersion = styled.span`
  position: absolute;
  bottom: 3px;
  left: 5px;
  font-size: 20px;
`;
