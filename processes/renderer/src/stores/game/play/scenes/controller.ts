import { computed, makeObservable, observable } from 'mobx';
import { resolvedPromise } from 'shared/lib/async';
import { Characters } from '../characters/controller';
import { GameScreen } from '../screen';
import { marketMainSceneConfig } from './list/market-main';
import { GameScene, GameSceneConfig } from './scene';
import { GameSceneCreator, SceneCreatorConfig } from './scene-creator';

export type ControllerSceneConfig<T extends string> = Omit<
  GameSceneConfig<T>,
  keyof SceneCreatorConfig
>;

type SceneName = GameSceneController[ 'sceneConfigs' ][ number ][ 'name' ];
type Scene = GameScene<SceneName>;
type Scenes = Record<SceneName, Scene>;

export type SetSceneFn = ( sceneName: SceneName ) => Promise<void>;

type GameSceneControllerConfig = {
  screen: GameScreen;
  characterList: Characters;
};

export class GameSceneController {
  private sceneCreator: GameSceneCreator;

  // список сцен, использующихся в контроллере
  private sceneConfigs = [ marketMainSceneConfig ];
  // список созданных сцен
  scenes: Scenes = {} as Scenes;
  currentScene: Scene = {} as Scene;

  constructor( config: GameSceneControllerConfig ) {
    const { screen, characterList } = config;

    this.sceneCreator = new GameSceneCreator( { screen, characterList } );

    makeObservable( this, {
      scenes: observable,
      currentScene: observable,
      isAllCurrentSceneImagesLoaded: computed,
    } );
  }

  getSceneConfig = ( name: SceneName ): ControllerSceneConfig<any> => {
    return this.sceneConfigs.find( ( config ) => config.name === name )!;
  };

  createScene = ( name: SceneName ): void => {
    const mapConfig = this.getSceneConfig( name ).map;
    this.scenes[ name ] = this.sceneCreator.createScene( name, mapConfig );
  };

  setScene: SetSceneFn = ( sceneName ) => {
    this.createScene( sceneName );
    this.currentScene = this.scenes[ sceneName ];

    if ( !this.isAllCurrentSceneImagesLoaded ) {
      return this.loadAllCurrentSceneImages();
    }
    return resolvedPromise;
  };

  loadAllCurrentSceneImages = (): Promise<void> => {
    return this.currentScene.loadAllImages();
  };

  updateCurrentScene = (): void => {
    this.currentScene.update();
  };

  get isAllCurrentSceneImagesLoaded(): boolean {
    return this.currentScene.isAllImagesLoaded;
  }
}
