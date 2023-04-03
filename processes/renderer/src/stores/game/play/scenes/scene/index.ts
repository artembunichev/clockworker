import { Characters } from '../../characters/controller'
import { GameScreen } from '../../screen'
import { SceneCharactersManipulator } from '../manipulator'
import { SceneMap, SceneMapConfig } from './map'

export type GameSceneConfig<Name extends string> = {
	name: Name
	map: Omit<SceneMapConfig, 'screen'>
	screen: GameScreen
	characterList: Characters
	background?: string
}

export class GameScene<SceneName extends string> {
	private screen: GameScreen
	private characterList: Characters
	name: SceneName
	map: SceneMap
	charactersManipulator: SceneCharactersManipulator

	background = '#000000';

	constructor( config: GameSceneConfig<SceneName> ) {
		const { screen, characterList, name, map, background } = config

		this.screen = screen
		this.characterList = characterList
		this.name = name

		this.map = new SceneMap( { ...map, screen } )

		this.charactersManipulator = new SceneCharactersManipulator( {
			map: this.map,
			characterList: this.characterList,
		} )

		if ( background ) {
			this.setBackground( background )
		} else {
			this.applyBackground()
		}
	}

	private applyBackground = (): void => {
		this.screen.setBackground( this.background )
	};

	setBackground = ( background: string ): void => {
		this.background = background
		this.applyBackground()
	};

	loadAllImages = (): Promise<void> => {
		return this.map.imageContainer.loadAll()
	};

	get isAllImagesLoaded(): boolean {
		return this.map.imageContainer.isAllImagesLoaded
	}

	update = (): void => {
		this.map.update()
	};
}
