import TiledMap from 'tiled-types/types'

import { GameScreen } from 'stores/game/play/screen'

import mapSchemeJSON from 'content/scenes/market/maps/main/market-main-map.json'
import tilesetSrc from 'content/scenes/market/maps/main/tileset.png'

import { Characters } from '../../characters/controller'
import { GameScene } from '../scene'

type Config = {
  screen: GameScreen
  characterList: Characters
}

export class MarketMainScene extends GameScene<'marketMain'> {
  constructor(config: Config) {
    const { screen, characterList } = config

    const mapScheme = JSON.parse(JSON.stringify(mapSchemeJSON)) as TiledMap

    super({
      name: 'marketMain',
      screen,
      map: { tilesetSrc, scheme: mapScheme },
      characterList,
    })
  }
}
