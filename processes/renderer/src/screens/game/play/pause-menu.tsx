import { FC } from 'basic-utility-types';
import { PixelatedButton } from 'components/pixelated/pixelated-components';
import { colors } from 'lib/theme';
import { observer } from 'mobx-react-lite';
import { GamePopup } from 'screens/shared/popups/game-popup-template';
import { useStore } from 'stores/root-store/context';
import styled from 'styled-components';
import { useGamePlayStore } from '../screen';

export const GamePauseMenu: FC = observer( () => {
  const { appStore } = useStore();
  const gamePlayStore = useGamePlayStore();

  const { pauseMenu, settingsMenu } = gamePlayStore.popups;
  const { quitInMainMenuConfirm, quitGameConfirm } = appStore.popups;

  const resumeGame = (): void => {
    pauseMenu.close();
  };

  const openSettings = (): void => {
    settingsMenu.open( { config: { forwardedFrom: { popup: pauseMenu, onClose: { fn: null } } } } );
  };

  const openQuitInMainMenuConfirm = (): void => {
    quitInMainMenuConfirm.open();
  };

  const openQuitGameConfirm = (): void => {
    quitGameConfirm.open();
  };

  return (
    <GamePopup
      popup={ pauseMenu }
      width={ '600px' }
      height={ '550px' }
      styles={ {
        backgroundColor: colors.mainLight,
      } }
      withCloseButton={ false }
      title={ 'Пауза' }
    >
      <List>
        <Sections>
          <Section>
            <Item onClick={ resumeGame }>Продолжить игру</Item>
            <Item onClick={ openSettings }>Настройки</Item>
          </Section>
          <Section>
            <Item onClick={ openQuitInMainMenuConfirm }>Выйти в главное меню</Item>
            <Item onClick={ openQuitGameConfirm }>Выйти из игры</Item>
          </Section>
        </Sections>
      </List>
    </GamePopup>
  );
} );

const List = styled.menu`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
`;
const Sections = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Item = styled( PixelatedButton ).attrs( {
  pixelsSize: 'medium',
  backgroundColor: colors.mainMedium,
} )`
  display: block;
  margin-bottom: 16px;
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  &:last-child {
    margin-bottom: 0;
  }
`;
