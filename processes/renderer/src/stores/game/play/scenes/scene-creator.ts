import { GameScene, GameSceneConfig } from './scene';
import { SceneMapConfig } from './scene/map';

export type SceneCreatorConfig = Pick<GameSceneConfig<any>, 'screen' | 'characterList'>;

export class GameSceneCreator {
  private config: SceneCreatorConfig;

  constructor( config: SceneCreatorConfig ) {
    this.config = config;
  }

  createScene = <Name extends string>( name: Name, map: Omit<SceneMapConfig, 'screen'> ): GameScene<Name> => {
    return new GameScene( {
      name,
      map,
      screen: this.config.screen,
      characterList: this.config.characterList,
    } );
  };
}
