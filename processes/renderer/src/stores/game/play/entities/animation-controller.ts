import { objectEntries, objectValues } from 'shared/lib/objects'
import { Animation, AnimationConfig, RunAnimationOptions } from './animation'
import { AnimationRegulatorList } from './animation/regulators'
import { Sprite } from './sprite'
import { SpriteSheet } from './sprite-sheet'

export enum ViewDirections {
	DOWN = 0,
	RIGHT = 1,
	UP = 2,
	LEFT = 3,
}

export type AnimationConfigForController = Omit<
	AnimationConfig,
	'name' | 'spriteSheet' | 'regulators'
>

export type AnimationConfigsForController<AnimationName extends string> = Record<
	AnimationName,
	AnimationConfigForController
>

type AnimationList<AnimationName extends string, RegulatorName extends string> = Record<
	AnimationName,
	Animation<RegulatorName>
>

export type AnimationControllerConfig<
	AnimationName extends string,
	RegulatorName extends string = never,
> = {
	spriteSheet: SpriteSheet
	configs: AnimationConfigsForController<AnimationName>
	initialValue: AnimationName
	regulators?: AnimationRegulatorList<RegulatorName>
}

export class AnimationController<AnimationName extends string, RegulatorName extends string> {
	private spriteSheet: SpriteSheet
	private configs: AnimationConfigsForController<AnimationName>
	currentAnimation: Animation<RegulatorName>

	private regulators: AnimationRegulatorList<RegulatorName> | null = null;
	private list: AnimationList<AnimationName, RegulatorName> = {} as AnimationList<
		AnimationName,
		RegulatorName
	>;
	viewDirection: ViewDirections = ViewDirections.DOWN;

	constructor( config: AnimationControllerConfig<AnimationName, RegulatorName> ) {
		const { spriteSheet, configs, initialValue, regulators } = config

		this.spriteSheet = spriteSheet
		this.configs = configs
		if ( regulators ) {
			this.regulators = regulators
		}

		this.createAnimations()

		this.currentAnimation = this.list[ initialValue ]
	}

	private createAnimations = (): void => {
		objectEntries( this.configs ).forEach( ( [ animationName, animationConfig ] ) => {
			this.list[ animationName ] = new Animation<RegulatorName>( {
				name: animationName,
				spriteSheet: this.spriteSheet,
				regulators: this.regulators ?? undefined,
				...animationConfig,
			} )
		} )
	};

	setScale = ( scale: number ): void => {
		objectValues( this.list ).forEach( ( animation ) => {
			animation.setScale( scale )
		} )
	};

	setAnimation = ( animationName: AnimationName ): void => {
		this.currentAnimation = this.list[ animationName ]
	};

	start = ( options?: RunAnimationOptions ): void => {
		this.currentAnimation.run( options )
	};
	stop = (): void => {
		this.currentAnimation.stop()
	};

	run = ( animationName: AnimationName, options?: RunAnimationOptions ): void => {
		if ( this.currentAnimation.name !== animationName ) {
			this.setAnimation( animationName )
		}
		if ( !this.currentAnimation.isPlaying ) {
			this.start( options )
		}
	};

	pause = (): void => {
		this.currentAnimation.pause()
	};
	resume = (): void => {
		this.currentAnimation.resume()
	};

	setViewDirection = ( direction: ViewDirections ): void => {
		this.viewDirection = direction
	};

	get currentSprite(): Sprite {
		return this.currentAnimation.currentSprite
	}
}
