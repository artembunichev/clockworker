import { XY } from 'project-utility-types/plane'

export type DrawImageConfig = {
	width: number
	height: number
	sourceX: number
	sourceY: number
	scale?: number
	position: XY
}

export const drawImage = (
	ctx: CanvasRenderingContext2D,
	image: HTMLImageElement,
	config: DrawImageConfig,
): void => {
	const { width, height, sourceX, sourceY, scale = 1, position } = config
	ctx.drawImage(
		image,
		sourceX,
		sourceY,
		width,
		height,
		position.x,
		position.y,
		width * scale,
		height * scale,
	)
}
