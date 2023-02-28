import { computed, makeObservable, observable } from 'mobx'

import { resolvedPromise } from 'process-shared/lib/async'

import { Characters } from '../characters/controller'
import { GameScreen } from '../screen'
import { marketMainSceneConfig } from './list/market'
import { GameScene, GameSceneConfig } from './scene'
import { GameSceneCreator, SceneCreatorConfig } from './scene-creator'

export type ControllerSceneConfig<T extends string> = Omit<
  GameSceneConfig<T>,
  keyof SceneCreatorConfig
>

export type SceneName = GameSceneController['sceneConfigs'][number]['name']
type Scene = GameScene<SceneName>
type Scenes = Record<SceneName, Scene>

type GameSceneControllerConfig = {
  screen: GameScreen
  characterList: Characters
}

export class GameSceneController {
  private sceneCreator: GameSceneCreator

  // список сцен, использующихся в контроллере
  private sceneConfigs = [marketMainSceneConfig]
  // список созданных сцен
  scenes: Scenes = {} as Scenes
  currentScene: Scene = {} as Scene

  constructor(config: GameSceneControllerConfig) {
    const { screen, characterList } = config

    this.sceneCreator = new GameSceneCreator({ screen, characterList })

    makeObservable(this, {
      scenes: observable,
      currentScene: observable,
      isAllCurrentSceneImagesLoaded: computed,
    })
  }

  getSceneConfig = (name: SceneName): ControllerSceneConfig<any> => {
    return this.sceneConfigs.find((config) => config.name === name)!
  }

  createScene = (name: SceneName): void => {
    const mapConfig = this.getSceneConfig(name).map
    this.scenes[name] = this.sceneCreator.createScene(name, mapConfig)
  }

  setScene = (sceneName: SceneName): Promise<void> => {
    if (!this.scenes[sceneName]) {
      this.createScene(sceneName)
    }

    this.currentScene = this.scenes[sceneName]

    const createAndDrawMap = (): void => {
      this.currentScene.createMap()
      this.currentScene.drawMap()
    }

    if (!this.isAllCurrentSceneImagesLoaded) {
      return this.loadAllCurrentSceneImages().then(() => createAndDrawMap())
    } else {
      createAndDrawMap()
      return resolvedPromise
    }
  }

  loadAllCurrentSceneImages = (): Promise<void> => {
    return this.currentScene.imageContainer.loadAll()
  }

  updateCurrentScene = (): void => {
    this.currentScene.drawMap()
  }

  get isAllCurrentSceneImagesLoaded(): boolean {
    return this.currentScene.imageContainer.isAllImagesLoaded
  }
}
