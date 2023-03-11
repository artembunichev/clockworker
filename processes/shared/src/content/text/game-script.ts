import { deepClone } from 'shared/lib/deep-clone';
import { objectKeys } from 'shared/lib/objects';

import script from './game-script.json';

type Replacer = { key: string; value: string };

export type GameScript = typeof script;

type GetParsedScriptConfig = {
  playerCharacterName: string;
  marketName: string;
};

export const getParsedGameScript = ( config: GetParsedScriptConfig ): GameScript => {
  const { playerCharacterName, marketName } = config;

  const replacers: Array<Replacer> = [
    // @ - имя игрока
    { key: '@', value: playerCharacterName },
    // # - название магазина
    { key: '#', value: marketName },
  ];

  const parsedScript = deepClone( script );
  objectKeys( parsedScript.content ).forEach( ( contentKey ) => {
    replacers.forEach( ( replacer ) => {
      parsedScript.content[contentKey] = parsedScript.content[contentKey]
        .split( replacer.key )
        .join( replacer.value );
    } );
  } );

  return parsedScript;
};
