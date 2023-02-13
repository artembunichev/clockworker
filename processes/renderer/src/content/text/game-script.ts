import { deepClone } from 'lib/deep-clone'

import script from './game-script.json'

type ContentKey = keyof typeof script['content']

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
  Object.keys(parsedScript.content).forEach((contentKey) => {
    replacers.forEach((replacer) => {
      parsedScript.content[contentKey as ContentKey] = parsedScript.content[contentKey as ContentKey]
        .split(replacer.key)
        .join(replacer.value)
    })
  })

  return parsedScript
}
