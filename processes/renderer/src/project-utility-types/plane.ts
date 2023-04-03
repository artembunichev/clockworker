export type XY = {
	x: number
	y: number
}

export type PointPair = {
	x1: number
	y1: number
	x2: number
	y2: number
}

export type PrimitiveDirection = 'down' | 'right' | 'up' | 'left'
export type ExpandedDirection = PrimitiveDirection | 'downright' | 'upright' | 'upleft' | 'downleft'
export type Side = 'bottom' | 'right' | 'top' | 'left'
