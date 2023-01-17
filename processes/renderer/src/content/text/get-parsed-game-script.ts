import script from './game-script.json'

type KeyOfScriptContent = keyof typeof script['content']

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

  const parsedGameScript: GameScript = JSON.parse(JSON.stringify(script))
  Object.keys(parsedGameScript.content).forEach((parsedScriptKey) => {
    replacers.forEach((replacer) => {
      parsedGameScript.content[parsedScriptKey as KeyOfScriptContent] = parsedGameScript.content[
        parsedScriptKey as KeyOfScriptContent
      ]
        .split(replacer.key)
        .join(replacer.value)
    })
  })

  return parsedGameScript
}
