import { deepClone } from 'lib/deep-clone'
import { objectKeys } from 'lib/objects'

import script from './game-script.json'

type Replacers = Array<{ key: string; value: string }>

export type GameScript = typeof script

type GetParsedScriptConfig = {
  playerCharacterName: string
  marketName: string
}

export const getParsedGameScript = (config: GetParsedScriptConfig): GameScript => {
  const { playerCharacterName, marketName } = config

  const replacers: Replacers = [
    // @ - имя игрока
    { key: '@', value: playerCharacterName },
    // # - название магазина
    { key: '#', value: marketName },
  ]

  const parsedScript = deepClone(script)
  objectKeys(parsedScript.content).forEach((contentKey) => {
    replacers.forEach((replacer) => {
      parsedScript.content[contentKey] = parsedScript.content[contentKey]
        .split(replacer.key)
        .join(replacer.value)
    })
  })

  return parsedScript
}
