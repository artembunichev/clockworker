import { nanoid } from 'nanoid';
import { Size } from 'project-utility-types/abstract';
import { PointPair } from 'project-utility-types/plane';
import { Position } from './entities/position';

export type BodyConfig = {
  is: string;
};

export class Body {
  // показывает, чем является тело
  is: string;

  readonly id = nanoid( 6 );
  position = new Position();
  size: Size = { width: 0, height: 0 };

  constructor( config: BodyConfig ) {
    const { is } = config;
    this.is = is;
  }

  protected setSize = ( size: Size ): void => {
    this.size = size;
  };

  get hitbox(): PointPair {
    return {
      x1: this.position.x,
      y1: this.position.y,
      x2: this.position.x + this.size.width,
      y2: this.position.y + this.size.height,
    };
  }
}
