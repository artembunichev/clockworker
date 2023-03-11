import { GameScene, GameSceneConfig, GameSceneMapConfig } from './scene';

export type SceneCreatorConfig = Pick<GameSceneConfig<any>, 'screen' | 'characterList'>;

export class GameSceneCreator {
  private config: SceneCreatorConfig;

  constructor( config: SceneCreatorConfig ) {
    this.config = config;
  }

  createScene = <Name extends string>( name: Name, map: GameSceneMapConfig ): GameScene<Name> => {
    return new GameScene( {
      name,
      map,
      screen: this.config.screen,
      characterList: this.config.characterList,
    } );
  };
}
