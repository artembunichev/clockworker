import { makeAutoObservable } from 'mobx'

import { PlayerCharacterConfig } from 'stores/game/play/characters/list/player/character'
import { KeyboardStore } from 'stores/keyboard.store'
import { PopupHistory } from 'stores/popup-history'

import { GameScript, getParsedGameScript } from 'content/text/get-parsed-game-script'

import { PreGameForm } from '../pre-game-form'
import { CharacterController, CharacterName } from './characters/controller'
import { Collider } from './collider'
import { Market } from './market'
import { GamePauseController } from './pause-controller'
import { Player } from './player'
import { GamePopups } from './popups'
import { GameSceneController, SceneName } from './scenes/controller'
import { GameScreen } from './screen'
import { GameSettings } from './settings/settings'
import { SharedPlayMethods } from './shared-methods/shared-methods'
import { TextboxController } from './textbox/controller'
import { TransitionScreen } from './transition-screen'

export type DataFromPreGameForm = Pick<PreGameForm, 'playerCharacterName' | 'marketName'>

export type GamePlayStoreConfig = {
  popupHistory: PopupHistory
  keyboard: KeyboardStore
  dataFromPreGameForm: DataFromPreGameForm
}

export class GamePlayStore {
  private popupHistory: PopupHistory
  private keyboard: KeyboardStore
  dataFromPreGameForm: DataFromPreGameForm

  script: GameScript
  market: Market
  textboxController: TextboxController
  popups: GamePopups

  constructor(config: GamePlayStoreConfig) {
    const { popupHistory, keyboard, dataFromPreGameForm } = config

    this.popupHistory = popupHistory
    this.keyboard = keyboard
    this.dataFromPreGameForm = dataFromPreGameForm

    //! сценарий
    this.script = getParsedGameScript({
      playerCharacterName: this.dataFromPreGameForm.playerCharacterName,
      marketName: this.dataFromPreGameForm.marketName,
    })

    //! магазин
    this.market = new Market({ name: this.dataFromPreGameForm.marketName })

    //! контроллер текстбоксов
    this.textboxController = new TextboxController({
      gameScript: this.script,
      pauseController: this.pauseController,
    })

    //! попапы
    this.popups = new GamePopups({
      popupHistory: this.popupHistory,
      pauseController: this.pauseController,
    })

    makeAutoObservable(this)
  }

  isPlay = true
  setIsPlay = (value: boolean): void => {
    this.isPlay = value
  }

  //! игрок
  player: Player = new Player()
  createPlayerCharacter = (): Promise<void> => {
    const playerCharacterConfig: PlayerCharacterConfig = {
      name: this.dataFromPreGameForm.playerCharacterName,
      settings: this.settings,
      screen: this.screen,
    }

    return this.player.createCharacter({
      characterController: this.characterController,
      characterConfig: playerCharacterConfig,
    })
  }

  //! общие методы
  sharedMethods = new SharedPlayMethods()

  //! контроллер персонажей
  characterController = new CharacterController()
  addActiveCharacter = (characterName: CharacterName): void => {
    this.characterController.addActiveCharacter(characterName)
    const character = this.characterController.characters[characterName]
    this.collider.addBody(character)
  }
  removeActiveCharacter = (characterName: CharacterName): void => {
    const character = this.characterController.characters[characterName]
    this.collider.removeBody(character.id)
    this.characterController.removeActiveCharacter(characterName)
  }

  //! настройки
  settings = new GameSettings()

  //! экран
  screen = new GameScreen({ width: screen.width, height: screen.height })

  //! контроллер сцен
  sceneController = new GameSceneController({
    screen: this.screen,
    characterList: this.characterController.characters,
  })
  setScene = (sceneName: SceneName): Promise<void> => {
    return this.sceneController.setScene(sceneName).then(() => {
      this.characterController.clearActiveCharacters()
      this.collider.clear()
      this.collider.addStaticObstacles(this.sceneController.currentScene.map.hitboxes)
    })
  }

  //! контроллер паузы
  pauseController = new GamePauseController({
    characterController: this.characterController,
    sharedMethods: this.sharedMethods,
  })

  //! коллайдер
  collider = new Collider({ screen: this.screen })

  //! подготовка игры
  isGamePrepared = false
  setIsGamePrepared = (value: boolean): void => {
    this.isGamePrepared = value
  }
  initializeGame = (): Promise<void> => {
    return this.setScene('marketMain').then(() => {
      return this.createPlayerCharacter().then(() => {
        if (this.player.character) {
          this.sharedMethods.playerCharacter.setPlayerCharacter(this.player.character)
          this.addActiveCharacter('player')
          this.sceneController.currentScene.charactersManipulator.positionCharacter('player', {
            x: 'center',
            y: 'center',
          })
          this.setIsGamePrepared(true)
        }
      })
    })
  }

  //! опенинг
  opening = new TransitionScreen({
    sharedPlayMethods: this.sharedMethods,
    appearanceMs: 1500,
    disappearanceMs: 1500,
    durationMs: 3500,
    background: '#000000',
  })

  //! игровые циклы
  private handlePlayerCharacterMovementKeys = (): void => {
    this.player.character?.movement.handleMovementKeys(this.keyboard)
  }

  updateActiveCharacters = (): void => {
    this.characterController.activeCharacters.forEach((character) => {
      character.update()
    })
  }

  update = (): void => {
    this.screen.clear()
    this.collider.update()
    this.sceneController.updateCurrentScene()
    this.updateActiveCharacters()
  }

  private gameLoop = (): void => {
    this.handlePlayerCharacterMovementKeys()
    this.update()
  }

  mainLoop = (): void => {
    this.gameLoop()
    const id = window.requestAnimationFrame(this.mainLoop)
    if (!this.isPlay) {
      window.cancelAnimationFrame(id)
    }
  }

  //! запуск игры
  run = (): void => {
    this.initializeGame().then(() => {
      this.mainLoop()
      this.opening.run().then(() => {
        this.textboxController.setCurrentTextbox({ name: 'welcome' })
      })
    })
  }
}
