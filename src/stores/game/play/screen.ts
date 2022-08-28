import { Canvas, Ctx } from 'game-utility-types'

type GameScreenConfig = {
  width: number
  height: number
}

export class GameScreen {
  width: number
  height: number

  canvas: Canvas
  ctx: Ctx

  constructor(config: GameScreenConfig) {
    Object.assign(this, config)

    this.initializeCanvasAndCtx()
  }

  initializeCanvasAndCtx(): void {
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height

    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')!
  }

  setBackground(backgroundSrc: string): void {
    this.canvas.style.backgroundImage = `url(${backgroundSrc})`
    this.canvas.style.backgroundRepeat = 'no-repeat'
    this.canvas.style.backgroundPosition = 'center'
    this.canvas.style.backgroundSize = 'cover'
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}
