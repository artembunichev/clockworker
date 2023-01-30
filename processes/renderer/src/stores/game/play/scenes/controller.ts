import { computed, makeObservable, observable } from 'mobx'

import { Properties } from 'process-shared/types/basic-utility-types'

import { resolvedPromise } from 'lib/async'

import { Characters } from '../characters/controller'
import { GameScreen } from '../screen'
import { MarketMainScene } from './list/market'

type This = InstanceType<typeof GameSceneController>

type Scene = InstanceType<Properties<This['refList']>>
export type SceneName = keyof This['refList']
type Scenes = Record<SceneName, Scene>

type GameSceneControllerConfig = {
  screen: GameScreen
  characterList: Characters
}

export class GameSceneController {
  private screen: GameScreen
  private characterList: Characters

  // список сцен, использующихся в контроллере
  private refList = { marketMain: MarketMainScene }
  // список созданных сцен
  scenes: Scenes = {} as Scenes
  currentScene: Scene = {} as Scene

  constructor(config: GameSceneControllerConfig) {
    const { screen, characterList } = config

    this.screen = screen
    this.characterList = characterList

    makeObservable(this, {
      scenes: observable,
      currentScene: observable,
      isAllCurrentSceneImagesLoaded: computed,
    })
  }

  createScene = (sceneName: SceneName): void => {
    this.scenes[sceneName] = new this.refList[sceneName]({
      screen: this.screen,
      characterList: this.characterList,
    })
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
