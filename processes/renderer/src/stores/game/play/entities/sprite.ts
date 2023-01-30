import { XY } from 'project-utility-types/plane'
import { Ctx } from 'project-utility-types/screen'

import { drawImage } from '../lib/draw-image'

type SpriteConfig = {
  image: HTMLImageElement
  width: number
  height: number
  sourceX?: number
  sourceY?: number
  scale: number
}

export class Sprite {
  image: HTMLImageElement
  width: number
  height: number
  private sourceX: number
  private sourceY: number
  scale: number

  constructor(config: SpriteConfig) {
    const { image, width, height, sourceX, sourceY, scale } = config

    this.image = image
    this.width = width
    this.height = height
    this.sourceX = sourceX ?? 0
    this.sourceY = sourceY ?? 0
    this.scale = scale
  }

  draw = (ctx: Ctx, position: XY): void => {
    drawImage(ctx, this.image, {
      width: this.width,
      height: this.height,
      sourceX: this.sourceX,
      sourceY: this.sourceY,
      scale: this.scale,
      position,
    })
  }

  get scaledWidth(): number {
    return this.width * this.scale
  }
  get scaledHeight(): number {
    return this.height * this.scale
  }
}
