import { Textbox } from 'components/textbox';
import { observer } from 'mobx-react-lite';
import { useGamePlayStore } from 'screens/game/screen';

export const GameTextbox = observer( () => {
  const gamePlayStore = useGamePlayStore();
  const { textboxController } = gamePlayStore;

  const text = textboxController.currentTextbox?.text;

  return <Textbox isOpened={ textboxController.isTextboxOpened } text={ text } />;
} );
