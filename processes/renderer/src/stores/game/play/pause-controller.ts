import { makeAutoObservable } from 'mobx'
import { CharacterController } from './characters/controller'
import { SharedPlayMethods } from './shared-methods'

type PauseControlsConfig = { prohibitorName: string }

type Config = {
	characterController: CharacterController
	sharedMethods: SharedPlayMethods
}

export class GamePauseController {
	private characterController: CharacterController
	private sharedMethods: SharedPlayMethods

	isGamePaused = false;

	constructor( config: Config ) {
		const { characterController, sharedMethods } = config

		this.characterController = characterController
		this.sharedMethods = sharedMethods

		makeAutoObservable( this )
	}

	// пауза
	pauseCharactersMovement = ( prohibitorName: string ): void => {
		this.characterController.activeCharacters.forEach( ( character ) => {
			character.movement.movementProhibitorsController.add( prohibitorName )
		} )
	};
	pauseHandlingPlayerCharacterMovementKeys = ( prohibitorName: string ): void => {
		this.sharedMethods.playerCharacter.addMovementKeysProhibitor( prohibitorName )
	};

	onPause = ( { prohibitorName }: PauseControlsConfig ): void => {
		this.pauseCharactersMovement( prohibitorName )
		this.pauseHandlingPlayerCharacterMovementKeys( prohibitorName )
	};

	// возобновление
	resumeCharactersMovement = ( prohibitorName: string ): void => {
		this.characterController.activeCharacters.forEach( ( character ) => {
			character.movement.movementProhibitorsController.remove( prohibitorName )
		} )
	};
	resumeHandlingPlayerCharacterMovementKeys = ( prohibitorName: string ): void => {
		this.sharedMethods.playerCharacter.removeMovementKeysProhibitor( prohibitorName )
	};

	onResume = ( { prohibitorName }: PauseControlsConfig ): void => {
		this.resumeCharactersMovement( prohibitorName )
		this.resumeHandlingPlayerCharacterMovementKeys( prohibitorName )
	};

	pauseGame = (): void => {
		this.isGamePaused = true
		this.onPause( { prohibitorName: 'pause' } )
	};
	resumeGame = (): void => {
		this.isGamePaused = false
		this.onResume( { prohibitorName: 'pause' } )
	};
	toggleGamePause = (): void => {
		if ( this.isGamePaused ) {
			this.resumeGame()
		} else {
			this.pauseGame()
		}
	};
}
