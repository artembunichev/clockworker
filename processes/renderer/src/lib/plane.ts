import { PointPair, XY } from 'project-utility-types/plane'
import { isBetween } from 'shared/lib/numbers'

export const getDistanceBetweenPoints = (point1: XY, point2: XY): number => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
}

// http://www.paulbourke.net/geometry/pointlineplane/
type IntersectionCheckResult =
  | { type: 'none' | 'parallel' | 'collinear' }
  | { type: 'intersecting'; point: XY }
export const checkIntersection = (line1: PointPair, line2: PointPair): IntersectionCheckResult => {
  const x1 = line1.x1
  const x2 = line1.x2
  const x3 = line2.x1
  const x4 = line2.x2

  const y1 = line1.y1
  const y2 = line1.y2
  const y3 = line2.y1
  const y4 = line2.y2

  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)

  const numerA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)
  const numerB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)

  if (denom === 0) {
    if (numerA === 0 && numerB === 0) {
      return { type: 'collinear' }
    }
    return { type: 'parallel' }
  }

  const uA = numerA / denom
  const uB = numerB / denom

  const x = x1 + uA * (x2 - x1)
  const y = y1 + uA * (y2 - y1)

  if (!isBetween(uA, 0, 1) || !isBetween(uB, 0, 1)) {
    return { type: 'none' }
  }

  return { type: 'intersecting', point: { x, y } }
}
