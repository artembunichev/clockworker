import { nanoid } from 'nanoid'
import { PointPair, Size, XY } from 'project-utility-types'
import { TiledMap } from 'tiled-types'

import { ImageContainer } from 'stores/entities/image-container'
import { Sprite } from 'stores/entities/sprite'
import { SpriteSheet } from 'stores/entities/sprite-sheet'

import { CharacterList } from '../characters/controller'
import { HitboxWithId } from '../collider'
import { GameScreen } from '../screen'
import { SceneCharactersManipulator } from './manipulator'

type GameMapConfig = {
  tilesetSrc: string
  scheme: TiledMap
}

export type GameMap = {
  size: Size
  tileset: SpriteSheet
  scheme: TiledMap
  hitboxes: Array<HitboxWithId>
}

type GameSceneConfig<Name extends string> = {
  name: Name
  map: GameMapConfig
  screen: GameScreen
  characterList: CharacterList
}

export class GameScene<SceneName extends string> {
  private screen: GameScreen
  private characterList: CharacterList

  name: SceneName
  private mapConfig: GameMapConfig
  map: GameMap
  mapSize: Size

  imageContainer: ImageContainer<Record<'tileset', string>>

  charactersManipulator: SceneCharactersManipulator

  constructor(config: GameSceneConfig<SceneName>) {
    const { screen, characterList, name, map } = config

    this.screen = screen
    this.characterList = characterList
    this.name = name
    this.mapConfig = map
    this.mapSize = {
      width: this.mapConfig.scheme.width * this.mapConfig.scheme.tilewidth,
      height: this.mapConfig.scheme.height * this.mapConfig.scheme.tileheight,
    }
    this.imageContainer = new ImageContainer({ tileset: this.mapConfig.tilesetSrc })

    this.charactersManipulator = new SceneCharactersManipulator({
      mapSize: this.mapSize,
      characterList: this.characterList,
    })
  }

  getMapHitboxes = (): Array<HitboxWithId> => {
    return this.mapConfig.scheme.layers.reduce((acc, layer) => {
      if (layer.type === 'objectgroup') {
        layer.objects.forEach((object) => {
          const hitbox: PointPair = {
            x1: object.x,
            y1: object.y,
            x2: object.x + object.width,
            y2: object.y + object.height,
          }
          const id = nanoid(6)
          acc.push({ hitbox, id })
        })
      }
      return acc
    }, [] as Array<HitboxWithId>)
  }

  createMap = (): void => {
    this.map = {
      size: this.mapSize,
      tileset: new SpriteSheet({
        image: this.imageContainer.list.tileset.imageElement,
        firstSkipX: 0,
        firstSkipY: 0,
        skipX: 0,
        skipY: 0,
        spriteWidth: this.mapConfig.scheme.tilewidth,
        spriteHeight: this.mapConfig.scheme.tileheight,
        defaultScale: 1,
      }),
      scheme: this.mapConfig.scheme,
      hitboxes: this.getMapHitboxes(),
    }
  }

  drawMap = (): void => {
    const getSourceSpritePositionByIndex = (index: number): { row: number; column: number } => {
      const tilesCountInTilesetRow = this.map.tileset.image.width / this.map.scheme.tilewidth

      const row = Math.floor((index - 1) / tilesCountInTilesetRow)
      var column
      if (index % tilesCountInTilesetRow !== 0) {
        column = (index % tilesCountInTilesetRow) - 1
      } else {
        column = tilesCountInTilesetRow - 1
      }

      return { row, column }
    }

    var spritePosition: XY = { x: 0, y: 0 }
    const updatePositionForNextSprite = (): void => {
      const tileWidth = this.map.scheme.tileheight
      const tileHeight = this.map.scheme.tileheight

      const mapWidth = this.map.scheme.width * tileWidth
      const mapHeight = this.map.scheme.height * tileHeight

      if (spritePosition.x === mapWidth && spritePosition.y === mapHeight) {
        return
      }

      const isNextRow = spritePosition.x === mapWidth - tileWidth

      const { x, y } = spritePosition

      if (isNextRow) {
        spritePosition = { x: 0, y: y + tileHeight }
      } else {
        spritePosition = { x: x + tileWidth, y }
      }
    }

    this.map.scheme.layers.forEach((layer) => {
      if (layer.type === 'tilelayer') {
        if (typeof layer.data !== 'string') {
          layer.data.forEach((spriteIndex) => {
            const sourceSpritePosition = getSourceSpritePositionByIndex(spriteIndex)
            const currentSprite: Sprite = this.map.tileset.getSprite(
              sourceSpritePosition.row,
              sourceSpritePosition.column,
            )
            this.screen.drawSprite(currentSprite, spritePosition)
            updatePositionForNextSprite()
          })
        }
      }
    })
  }
}
