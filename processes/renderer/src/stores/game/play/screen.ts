import { XY } from 'project-utility-types/plane';
import { Canvas, Ctx } from 'project-utility-types/screen';
import { Sprite } from './entities/sprite';

type GameScreenConfig = {
  width: number;
  height: number;
};

export class GameScreen {
  width: number;
  height: number;
  canvas: Canvas;
  ctx: Ctx;

  background = '#ffffff';

  constructor( config: GameScreenConfig ) {
    const { width, height } = config;

    this.width = width;
    this.height = height;

    this.initializeCanvasAndCtx();
  }

  initializeCanvasAndCtx = (): void => {
    const canvas = document.createElement( 'canvas' );
    canvas.width = this.width;
    canvas.height = this.height;

    this.canvas = canvas;
    this.ctx = this.canvas.getContext( '2d' )!;
  };

  setBackground = ( background: string ): void => {
    this.background = background;
  };

  fill = (): void => {
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect( 0, 0, this.width, this.height );
  };

  clear = (): void => {
    this.ctx.clearRect( 0, 0, this.width, this.height );
  };

  drawSprite = ( sprite: Sprite, position: XY ): void => {
    sprite.draw( this.ctx, position );
  };

  update = (): void => {
    this.clear();
    this.fill();
  };

}
