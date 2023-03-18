import { GameScript } from 'content/text/game-script';
import { Textbox } from '..';

type Config = {
  gameScript: GameScript;
};

export class WelcomeTextbox extends Textbox<'welcome'> {
  constructor( config: Config ) {
    const { gameScript } = config;

    super( {
      name: 'welcome',
      text: gameScript.content.welcome,
    } );
  }
}
