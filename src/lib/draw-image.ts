import { Position } from 'game-utility-types'

export type DrawImageConfig = {
  width: number
  height: number
  sourceX: number
  sourceY: number
  scale?: number
  position: Position
}

export const drawImage = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  config: DrawImageConfig,
): void => {
  const { width, height, sourceX, sourceY, scale = 1, position } = config
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    width,
    height,
    position.x,
    position.y,
    width * scale,
    height * scale,
  )
}