import TiledMap from 'tiled-types/types'

import mapScheme from 'content/maps/market/main/map.json'
import tilesetSrc from 'content/maps/market/main/tileset.png'

import { ControllerSceneConfig } from '../controller'

export const marketMainSceneConfig: ControllerSceneConfig<'marketMain'> = {
  name: 'marketMain',
  map: {
    scheme: mapScheme as TiledMap,
    tilesetSrc,
  },
}
