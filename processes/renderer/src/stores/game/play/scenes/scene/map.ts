import { nanoid } from "nanoid"
import { Size } from "project-utility-types/abstract"
import { PointPair, XY } from "project-utility-types/plane"
import { SheetPosition } from "project-utility-types/sheet"
import { ImageContainer } from "stores/entities/image-container"
import TiledMap from "tiled-types/types"
import { HitboxWithId } from "../../collider/collision"
import { Sprite } from "../../entities/sprite"
import { SpriteSheet } from "../../entities/sprite-sheet"
import { GameScreen } from "../../screen"

export type SceneMapConfig = {
  screen: GameScreen
  tilesetSrc: string
  scheme: TiledMap
}

export class SceneMap {
  private screen: GameScreen
  size: Size
  tileset: SpriteSheet
  private scheme: TiledMap
  obstacleHitboxes: Array<HitboxWithId>
  hitbox: PointPair
  startDrawPoint: XY
  imageContainer: ImageContainer<Record<'tileset', string>>

  constructor( config: SceneMapConfig ) {
    this.screen = config.screen

    this.createMap( config )
  }

  private createMap = ( config: SceneMapConfig ): void => {
    const { scheme } = config

    this.imageContainer = new ImageContainer( { tileset: config.tilesetSrc } )

    const size: Size = {
      width: scheme.width * scheme.tilewidth,
      height: scheme.height * scheme.tileheight,
    }

    const tileset: SpriteSheet = new SpriteSheet( {
      image: this.imageContainer.list.tileset.imageElement,
      firstSkipX: 0,
      firstSkipY: 0,
      skipX: 0,
      skipY: 0,
      spriteWidth: scheme.tilewidth,
      spriteHeight: scheme.tileheight,
      defaultScale: 1,
    } )

    this.size = size
    this.tileset = tileset
    this.scheme = scheme
    this.hitbox = this.getHitbox()
    this.startDrawPoint = this.getStartDrawPoint()
    this.obstacleHitboxes = this.getObstacleHitboxes()
  };

  private getHitbox = (): PointPair => {
    const w = this.size.width
    const h = this.size.height
    const screenW = this.screen.size.width
    const screenH = this.screen.size.height

    var offsetX = 0
    var offsetY = 0

    if ( w < screenW ) {
      offsetX = w < screenW ? ( screenW - w ) / 2 : 0
    }
    if ( h < screenH ) {
      offsetY = h < screenH ? ( screenH - h ) / 2 : 0
    }

    const x2 = offsetX + this.size.width
    const y2 = offsetY + this.size.height

    return {
      x1: offsetX,
      y1: offsetY,
      // временное решение, пока не добавим камеру
      x2: x2 > screenW ? screenW : x2,
      y2: y2 > screenH ? screenH : y2,
    }
  };

  private getStartDrawPoint = (): XY => {
    return {
      x: this.hitbox.x1,
      y: this.hitbox.y1
    }
  };

  draw = (): void => {
    // возвращает позицию тайла в тайлсете (строка и столбец)
    const getSourceSpritePositionByIndex = ( index: number ): SheetPosition => {
      const tilesCountInTilesetRow = this.tileset.image.width / this.scheme.tilewidth

      const row = Math.floor( ( index - 1 ) / tilesCountInTilesetRow )
      var column
      if ( index % tilesCountInTilesetRow !== 0 ) {
        column = ( index % tilesCountInTilesetRow ) - 1
      } else {
        column = tilesCountInTilesetRow - 1
      }

      return { row, column }
    }

    var spritePosition: XY = this.startDrawPoint

    // обновляет позицию, в которой будет находиться следующий тайл
    const updatePositionForNextTile = (): void => {
      const tileWidth = this.scheme.tileheight
      const tileHeight = this.scheme.tileheight

      const tileXEndpoint = this.startDrawPoint.x + ( ( this.scheme.width - 1 ) * tileWidth )
      const tileYEndpoint = this.startDrawPoint.y + ( ( this.scheme.height - 1 ) * tileHeight )

      if ( spritePosition.x === tileXEndpoint && spritePosition.y === tileYEndpoint ) {
        return
      }

      const isNextRow = spritePosition.x === tileXEndpoint

      const { x, y } = spritePosition

      if ( isNextRow ) {
        spritePosition = { x: this.startDrawPoint.x, y: y + tileHeight }
      } else {
        spritePosition = { x: x + tileWidth, y }
      }
    }

    this.scheme.layers.forEach( ( layer ) => {
      if ( layer.type === 'tilelayer' ) {
        if ( typeof layer.data !== 'string' ) {
          layer.data.forEach( ( spriteIndex ) => {
            const sourceSpritePosition = getSourceSpritePositionByIndex( spriteIndex )
            const currentSprite: Sprite = this.tileset.getSprite(
              sourceSpritePosition.row,
              sourceSpritePosition.column,
            )
            this.screen.drawSprite( currentSprite, spritePosition )
            updatePositionForNextTile()
          } )
        }
      }
    } )
  };

  getObstacleHitboxes = (): Array<HitboxWithId> => {
    const offsetX = this.startDrawPoint.x
    const offsetY = this.startDrawPoint.y

    return this.scheme.layers.reduce( ( acc, layer ) => {
      if ( layer.type === 'objectgroup' ) {
        layer.objects.forEach( ( object ) => {
          const hitbox: PointPair = {
            x1: offsetX + object.x,
            y1: offsetY + object.y,
            x2: offsetX + object.x + object.width,
            y2: offsetY + object.y + object.height,
          }
          const id = nanoid( 6 )
          acc.push( { hitbox, id } )
        } )
      }
      return acc
    }, [] as Array<HitboxWithId> )
  };

  update = (): void => {
    this.draw()
  };
}
