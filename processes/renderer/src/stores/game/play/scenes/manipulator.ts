import { XY } from 'project-utility-types/plane'
import { CharacterName, Characters } from '../characters/controller'
import { SceneMap } from './scene/map'

type PositionOnScene = { x: 'right' | 'left' | 'center'; y: 'down' | 'top' | 'center' }

type CharacterPositionOnMap = Partial<XY> | Partial<PositionOnScene>
const isPositionOnScene = ( position: CharacterPositionOnMap ): position is Partial<PositionOnScene> => {
	return typeof position.x === 'string' || typeof position.y === 'string'
}

type SceneCharactersManipulatorConfig = {
	map: SceneMap
	characterList: Characters
}

export class SceneCharactersManipulator {
	private characterList: Characters
	private map: SceneMap

	constructor( config: SceneCharactersManipulatorConfig ) {
		const { map, characterList } = config

		this.map = map
		this.characterList = characterList
	}

	positionCharacter = ( characterName: CharacterName, position: CharacterPositionOnMap ): void => {
		const character = this.characterList[ characterName ]

		var x = this.map.startDrawPoint.x + character.position.x
		var y = this.map.startDrawPoint.y + character.position.y

		if ( isPositionOnScene( position ) ) {
			const rightmostX = this.map.startDrawPoint.x + ( this.map.size.width - character.size.width )
			const leftmostX = this.map.startDrawPoint.x
			const downmostY = this.map.startDrawPoint.y + ( this.map.size.height - character.size.height )
			const topmostY = this.map.startDrawPoint.y
			const centerX = leftmostX + ( ( rightmostX - leftmostX ) / 2 )
			const centerY = topmostY + ( ( downmostY - topmostY ) / 2 )

			if ( position.x ) {
				if ( position.x === 'right' ) {
					x = rightmostX
				} else if ( position.x === 'center' ) {
					x = centerX
				} else if ( position.x === 'left' ) {
					x = leftmostX
				}
			}

			if ( position.y ) {
				if ( position.y === 'down' ) {
					y = downmostY
				} else if ( position.y === 'center' ) {
					y = centerY
				} else if ( position.y === 'top' ) {
					y = topmostY
				}
			}
		}

		character.position.setXY( x, y )
	};
}
