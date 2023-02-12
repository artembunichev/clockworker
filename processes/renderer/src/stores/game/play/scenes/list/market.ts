import TiledMap from 'tiled-types/types'

import mapScheme from 'content/scenes/market/maps/main/market-main-map.json'
import tilesetSrc from 'content/scenes/market/maps/main/tileset.png'

import { ControllerSceneConfig } from '../controller'

export const marketMainSceneConfig: ControllerSceneConfig<'marketMain'> = {
  name: 'marketMain',
  map: {
    scheme: mapScheme as TiledMap,
    tilesetSrc,
  },
}
