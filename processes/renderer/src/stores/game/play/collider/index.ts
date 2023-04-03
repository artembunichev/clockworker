import { SceneMap } from '../scenes/scene/map'
import { ColliderCollision } from './collision'

type Config = {
	sceneMap: SceneMap
}

export class Collider {
	private sceneMap: SceneMap
	collision: ColliderCollision

	constructor( config: Config ) {
		const { sceneMap } = config

		this.sceneMap = sceneMap

		this.collision = new ColliderCollision( { sceneMap: this.sceneMap } )
	}

	setSceneMap = ( sceneMap: SceneMap ): void => {
		this.sceneMap = sceneMap
		this.collision.setSceneMap( this.sceneMap )
	};

	clear = (): void => {
		this.collision.clear()
	};

	update = (): void => {
		this.collision.update()
	};
}
