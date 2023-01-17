import { GameScript } from 'content/text/get-parsed-game-script'

import { Textbox } from '../textbox'

type Config = {
  gameScript: GameScript
}

export class WelcomeTextbox extends Textbox<'welcome'> {
  constructor(config: Config) {
    const { gameScript } = config

    super({
      name: 'welcome',
      text: gameScript.content.welcome,
    })
  }
}
