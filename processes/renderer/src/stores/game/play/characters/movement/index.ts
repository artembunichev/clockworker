import { ExpandedDirection, XY } from 'project-utility-types/plane'
import { objectEntries } from 'shared/lib/objects'
import { capitalizeFirstSymbol } from 'shared/lib/strings'
import { Position } from '../../entities/position'
import { ProhibitorsController } from '../../entities/prohibitors-controller'
import { convertExpandedDirectionToPrimitiveDirection } from '../../lib/movement'
import {
	CharacterMovementAnimationName,
	DefaultCharacterAnimationController,
	DefaultCharacterAnimationRegulatorName
} from '../animation'
import { CharacterAutomove } from './automove'
import { CharacterMovementRegulatorName } from './regulators'
import { CharacterMovementState, CharacterMovementStateConfig } from './state'

export type MoveConfig = {
	direction: ExpandedDirection
	stateConfig?: CharacterMovementStateConfig
}

export type MoveFn = ( moveConfig: MoveConfig ) => void

type AnimationBinds = Partial<
	Record<CharacterMovementRegulatorName, DefaultCharacterAnimationRegulatorName>
>

export type ConfigForCharacterMovement = {
	position: Position
	animationController: DefaultCharacterAnimationController
	initialMovementStateConfig: CharacterMovementStateConfig
}

export class CharacterMovement {
	private position: Position
	protected animationController: DefaultCharacterAnimationController
	movementState: CharacterMovementState
	automove: CharacterAutomove

	// существует только в момент движения персонажа
	direction: ExpandedDirection | null = null;
	// препятствия не запрещают движение, т.к. за ними следит коллайдер
	movementProhibitorsController = new ProhibitorsController();
	isMoving = false;
	isStuck = false;
	isSliding = false;
	animationBinds: AnimationBinds = {
		sprint: 'speedup',
	};

	constructor( config: ConfigForCharacterMovement ) {
		const { position, animationController, initialMovementStateConfig } = config

		this.position = position
		this.animationController = animationController

		this.movementState = new CharacterMovementState( initialMovementStateConfig )

		this.automove = new CharacterAutomove( {
			position: this.position,
			movementState: this.movementState,
			movementProhibitorsController: this.movementProhibitorsController,
			getPositionOnNextStep: this.getPositionOnNextStep,
			move: this.moveWithAnimation,
			stopMove: this.stopMove,
			animationController: this.animationController,
			clearRegulators: this.clearRegulators,
		} )
	}

	getPositionOnNextStep = (): XY => {
		const { stepSize } = this.movementState.currentValue

		// длина шага по диагонали должна быть равна длине шага по прямой
		const diagonalStepSize = Math.sqrt( Math.pow( stepSize, 2 ) / 2 )

		const { x, y } = this.position

		if ( this.direction === 'down' ) {
			return { x, y: y + stepSize }
		} else if ( this.direction === 'downright' ) {
			return { x: x + diagonalStepSize, y: y + diagonalStepSize }
		} else if ( this.direction === 'right' ) {
			return { x: x + stepSize, y }
		} else if ( this.direction === 'upright' ) {
			return { x: x + diagonalStepSize, y: y - diagonalStepSize }
		} else if ( this.direction === 'up' ) {
			return { x, y: y - stepSize }
		} else if ( this.direction === 'upleft' ) {
			return { x: x - diagonalStepSize, y: y - diagonalStepSize }
		} else if ( this.direction === 'left' ) {
			return { x: x - stepSize, y }
		} else {
			// downleft
			return { x: x - diagonalStepSize, y: y + diagonalStepSize }
		}
	};

	setDirection = ( direction: ExpandedDirection | null ): void => {
		this.direction = direction
	};

	setIsMoving = ( value: boolean ): void => {
		this.isMoving = value
	};

	setIsStuck = ( value: boolean ): void => {
		this.isStuck = value
		this.automove.setIsStuck( value )
	};

	setIsSliding = ( value: boolean ): void => {
		this.isSliding = value
	};

	move: MoveFn = ( { direction, stateConfig } ): void => {
		this.setDirection( direction )

		if ( stateConfig ) {
			this.movementState.setConfig( stateConfig )
		}

		if ( this.movementState.currentValue ) {
			const positionOnNextStep = this.getPositionOnNextStep()
			this.position.setXY( positionOnNextStep.x, positionOnNextStep.y )
		}
	};

	moveWithAnimation: MoveFn = ( moveConfig ): void => {
		this.move( moveConfig )

		if ( this.isSliding ) {
			this.applyAnimationRegulator( 'slowdown' )
		} else {
			this.removeAnimationRegulator( 'slowdown' )
		}

		if ( this.direction ) {
			const animationName: CharacterMovementAnimationName = ( 'walk' +
				capitalizeFirstSymbol(
					convertExpandedDirectionToPrimitiveDirection( this.direction ),
				) ) as CharacterMovementAnimationName

			this.animationController.run( animationName )
		}
	};

	stopMove = (): void => {
		this.setIsMoving( false )
		this.setDirection( null )
		this.animationController.stop()
	};

	// действия с регуляторами
	private makeActionWithRegulator = (
		movementRegulatorName: CharacterMovementRegulatorName,
		action: 'apply' | 'remove',
	): void => {
		const movementFn =
			action === 'apply'
				? this.movementState.regulators.applyRegulator
				: this.movementState.regulators.removeRegulator
		const animationFn =
			action === 'apply'
				? this.animationController.currentAnimation.regulators?.applyRegulator
				: this.animationController.currentAnimation.regulators?.removeRegulator

		objectEntries( this.animationBinds ).forEach( ( [ mrName, arName ] ) => {
			if ( mrName === movementRegulatorName ) {
				movementFn( mrName )
				if ( arName ) {
					animationFn?.( arName )
				}
			}
		} )
	};

	applyAnimationRegulator = ( regulatorName: DefaultCharacterAnimationRegulatorName ): void => {
		this.animationController.currentAnimation.regulators?.applyRegulator( regulatorName )
	};
	removeAnimationRegulator = ( regulatorName: DefaultCharacterAnimationRegulatorName ): void => {
		this.animationController.currentAnimation.regulators?.removeRegulator( regulatorName )
	};

	applyRegulator = ( regulatorName: CharacterMovementRegulatorName ): void => {
		this.makeActionWithRegulator( regulatorName, 'apply' )
	};
	removeRegulator = ( regulatorName: CharacterMovementRegulatorName ): void => {
		this.makeActionWithRegulator( regulatorName, 'remove' )
	};
	clearRegulators = (): void => {
		this.movementState.regulators.clearRegulators()
		this.animationController.currentAnimation.regulators?.clearRegulators()
	};

	startSprint = (): void => {
		this.applyRegulator( 'sprint' )
	};
	endSprint = (): void => {
		this.removeRegulator( 'sprint' )
	};

	get isMovementProhibited(): boolean {
		return this.movementProhibitorsController.isProhibited
	}
}
