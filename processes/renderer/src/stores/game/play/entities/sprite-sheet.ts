import { Sprite } from './sprite'

type GetSpriteOptions = {
  scale?: number
}

export type SpriteSheetConfig = {
  image: HTMLImageElement
  spriteWidth: number
  spriteHeight: number
  firstSkipX: number
  firstSkipY: number
  skipX: number
  skipY: number
  defaultScale?: number
}

export class SpriteSheet {
  image: HTMLImageElement
  spriteWidth: number
  spriteHeight: number
  private firstSkipX: number
  private firstSkipY: number
  private skipX: number
  private skipY: number
  defaultScale?: number

  constructor(config: SpriteSheetConfig) {
    const { image, spriteWidth, spriteHeight, firstSkipX, firstSkipY, skipX, skipY, defaultScale } =
      config

    this.image = image
    this.spriteWidth = spriteWidth
    this.spriteHeight = spriteHeight
    this.firstSkipX = firstSkipX
    this.firstSkipY = firstSkipY
    this.skipX = skipX
    this.skipY = skipY
    this.defaultScale = defaultScale
  }

  getSprite = (row: number, column: number, options?: GetSpriteOptions): Sprite => {
    const spriteSourceX = this.firstSkipX + (this.spriteWidth + this.skipX) * column
    const spriteSourceY = this.firstSkipY + (this.spriteHeight + this.skipY) * row
    const spriteScale = options?.scale ?? this.defaultScale ?? 1

    return new Sprite({
      image: this.image,
      width: this.spriteWidth,
      height: this.spriteHeight,
      sourceX: spriteSourceX,
      sourceY: spriteSourceY,
      scale: spriteScale,
    })
  }
}
