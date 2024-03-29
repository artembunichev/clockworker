import { GameScript, getParsedGameScript } from 'content/text/game-script'
import { makeAutoObservable } from 'mobx'
import { KeyboardStore } from 'stores/keyboard.store'
import { PopupHistory } from 'stores/popup-history'
import { PreGameForm } from '../pre-game-form'
import { CharacterController, CharacterName } from './characters/controller'
import { PlayerCharacterConfig } from './characters/list/player/character'
import { Collider } from './collider'
import { Market } from './market'
import { GamePauseController } from './pause-controller'
import { Player } from './player'
import { GamePopups } from './popups'
import { GameSceneController, SetSceneFn } from './scenes/controller'
import { GameScreen } from './screen'
import { GameSettings } from './settings'
import { SharedPlayMethods } from './shared-methods'
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

	isPlay = true;
	screen = new GameScreen( { width: screen.width, height: screen.height } );
	player: Player = new Player();
	sharedMethods = new SharedPlayMethods();
	characterController = new CharacterController();
	settings = new GameSettings();
	sceneController = new GameSceneController( {
		screen: this.screen,
		characterList: this.characterController.characters,
	} );
	pauseController = new GamePauseController( {
		characterController: this.characterController,
		sharedMethods: this.sharedMethods,
	} );
	collider = new Collider( { sceneMap: this.sceneController.currentScene.map } );
	isGameInitialized = false;
	opening = new TransitionScreen( {
		sharedPlayMethods: this.sharedMethods,
		appearanceMs: 1500,
		disappearanceMs: 1500,
		durationMs: 3500,
		background: '#000000',
	} );

	constructor( config: GamePlayStoreConfig ) {
		const { popupHistory, keyboard, dataFromPreGameForm } = config

		this.popupHistory = popupHistory
		this.keyboard = keyboard
		this.dataFromPreGameForm = dataFromPreGameForm

		this.script = getParsedGameScript( {
			playerCharacterName: this.dataFromPreGameForm.playerCharacterName,
			marketName: this.dataFromPreGameForm.marketName,
		} )

		this.market = new Market( { name: this.dataFromPreGameForm.marketName } )

		this.textboxController = new TextboxController( {
			gameScript: this.script,
			pauseController: this.pauseController,
		} )

		this.popups = new GamePopups( {
			popupHistory: this.popupHistory,
			pauseController: this.pauseController,
		} )

		makeAutoObservable( this )
	}

	setIsPlay = ( value: boolean ): void => {
		this.isPlay = value
	};

	createPlayerCharacter = (): Promise<void> => {
		const playerCharacterConfig: PlayerCharacterConfig = {
			name: this.dataFromPreGameForm.playerCharacterName,
			screen: this.screen,
			settings: this.settings,
			keyboard: this.keyboard,
		}

		return this.player.createCharacter( {
			characterController: this.characterController,
			characterConfig: playerCharacterConfig,
		} )
	};

	addActiveCharacter = ( characterName: CharacterName ): void => {
		this.characterController.addActiveCharacter( characterName )
		const character = this.characterController.characters[ characterName ]
		this.collider.collision.bodyList.addOne( character )
	};
	removeActiveCharacter = ( characterName: CharacterName ): void => {
		const character = this.characterController.characters[ characterName ]
		this.collider.collision.bodyList.removeOne( character.id )
		this.characterController.removeActiveCharacter( characterName )
	};

	setScene: SetSceneFn = async ( sceneName ): Promise<void> => {
		await this.sceneController.setScene( sceneName )

		this.collider.setSceneMap( this.sceneController.currentScene.map )
		this.characterController.clearActiveCharacters()
		this.collider.clear()
		this.collider.collision.staticObstacleList.addMany(
			this.sceneController.currentScene.map.obstacleHitboxes,
		)
	};

	setIsGameInitialized = ( value: boolean ): void => {
		this.isGameInitialized = value
	};
	initializeGame = async (): Promise<void> => {
		await this.setScene( 'marketMain' )

		await this.createPlayerCharacter()

		if ( this.player.character ) {
			this.sharedMethods.playerCharacter.setPlayerCharacter( this.player.character )
			this.addActiveCharacter( 'player' )
			this.sceneController.currentScene.charactersManipulator.positionCharacter( 'player', {
				x: 'center',
				y: 'center',
			} )
			this.setIsGameInitialized( true )
		}
	};

	// игровые циклы
	private updateActiveCharacters = (): void => {
		this.characterController.activeCharacters.forEach( ( character ) => {
			character.update()
		} )
	};

	update = (): void => {
		this.screen.update()
		this.collider.update()
		this.sceneController.updateCurrentScene()
		this.updateActiveCharacters()
	};

	private gameLoop = (): void => {
		this.update()
	};

	private mainLoop = (): void => {
		this.gameLoop()
		const id = window.requestAnimationFrame( this.mainLoop )
		if ( !this.isPlay ) {
			window.cancelAnimationFrame( id )
		}
	};

	run = async (): Promise<void> => {
		await this.initializeGame()

		this.mainLoop()

		await this.opening.run()

		this.textboxController.setCurrentTextbox( { name: 'welcome' } )
	};
}
