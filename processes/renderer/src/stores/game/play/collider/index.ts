import { GameScreen } from '../screen';
import { ColliderCollision } from './collision';

type Config = {
  screen: GameScreen;
};

export class Collider {
  private screen: GameScreen;
  collision: ColliderCollision;

  constructor( config: Config ) {
    const { screen } = config;

    this.screen = screen;

    this.collision = new ColliderCollision( { screen: this.screen } );
  }

  clear = (): void => {
    this.collision.clear();
  };

  update = (): void => {
    this.collision.update();
  };
}
