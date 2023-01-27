import { ExpandedDirection, PointPair, XY } from 'project-utility-types/plane'

import { areEquivalent } from 'lib/are-equivalent'

import { ColliderBody, HitboxWithId, ObstacleList, Stucks } from '.'
import { getMovementDirection } from '../../lib/movement'
import { GameScreen } from '../../screen'

type BodyExtremeCoords = {
  bottomY: number
  rightX: number
  topY: number
  leftX: number
}

type BodyOutOfMapState = {
  outOfBottomMapBorder: boolean
  outOfRightMapBorder: boolean
  outOfTopMapBorder: boolean
  outOfLeftMapBorder: boolean
}

type Config = {
  obstacleList: ObstacleList
  stucks: Stucks
  screen: GameScreen
}

export class ColliderCollisionHelpers {
  private obstacleList: ObstacleList
  private stucks: Stucks
  private screen: GameScreen

  constructor(config: Config) {
    const { obstacleList, stucks, screen } = config

    this.obstacleList = obstacleList
    this.stucks = stucks
    this.screen = screen
  }

  getBodyExtremeCoords = (body: ColliderBody): BodyExtremeCoords => {
    return {
      bottomY: this.screen.height - body.size.height,
      rightX: this.screen.width - body.size.width,
      topY: 0,
      leftX: 0,
    }
  }

  getBodyOutOfMapState = (body: ColliderBody): BodyOutOfMapState => {
    const { bottomY, rightX, topY, leftX } = this.getBodyExtremeCoords(body)

    const outOfBottomMapBorder = body.position.y > bottomY
    const outOfRightMapBorder = body.position.x > rightX
    const outOfTopMapBorder = body.position.y < topY
    const outOfLeftMapBorder = body.position.x < leftX

    return { outOfBottomMapBorder, outOfRightMapBorder, outOfTopMapBorder, outOfLeftMapBorder }
  }

  isXChanged = (prevHitbox: PointPair, currentHitbox: PointPair): boolean => {
    return prevHitbox.x1 !== currentHitbox.x1 || prevHitbox.x2 !== currentHitbox.x2
  }
  isYChanged = (prevHitbox: PointPair, currentHitbox: PointPair): boolean => {
    return prevHitbox.y1 !== currentHitbox.y1 || prevHitbox.y2 !== currentHitbox.y2
  }

  getObstacleById = (obstacleId: string): HitboxWithId => {
    return this.obstacleList.elements.find(({ id }) => id === obstacleId)!
  }

  isBodyStucked = (bodyId: string): boolean => {
    return this.stucks.list[bodyId]?.length > 0
  }

  getMovementDirectionByHitbox = (
    prevHitbox: PointPair,
    currentHitbox: PointPair,
  ): ExpandedDirection | null => {
    const start: XY = { x: prevHitbox.x1, y: prevHitbox.y1 }
    const end: XY = { x: currentHitbox.x1, y: currentHitbox.y1 }

    return getMovementDirection(start, end)
  }

  getBottomHitboxLine = (hitbox: PointPair): PointPair => {
    return {
      x1: hitbox.x1,
      y1: hitbox.y2,
      x2: hitbox.x2,
      y2: hitbox.y2,
    }
  }
  getRightHitboxLine = (hitbox: PointPair): PointPair => {
    return {
      x1: hitbox.x2,
      y1: hitbox.y1,
      x2: hitbox.x2,
      y2: hitbox.y2,
    }
  }
  getTopHitboxLine = (hitbox: PointPair): PointPair => {
    return {
      x1: hitbox.x1,
      y1: hitbox.y1,
      x2: hitbox.x2,
      y2: hitbox.y1,
    }
  }
  getLeftHitboxLine = (hitbox: PointPair): PointPair => {
    return {
      x1: hitbox.x1,
      y1: hitbox.y1,
      x2: hitbox.x1,
      y2: hitbox.y2,
    }
  }
  getDeltaXHitbox = (prevHitbox: PointPair, currentHitbox: PointPair): PointPair => {
    return {
      x1: currentHitbox.x1,
      y1: prevHitbox.y1,
      x2: currentHitbox.x2,
      y2: prevHitbox.y2,
    }
  }
  getDeltaYHitbox = (prevHitbox: PointPair, currentHitbox: PointPair): PointPair => {
    return {
      x1: prevHitbox.x1,
      y1: currentHitbox.y1,
      x2: prevHitbox.x2,
      y2: currentHitbox.y2,
    }
  }

  isHitboxCornerPoint = (hitbox: PointPair, point: XY): boolean => {
    const cornerPoints: Array<XY> = [
      { x: hitbox.x1, y: hitbox.y1 },
      { x: hitbox.x2, y: hitbox.y1 },
      { x: hitbox.x2, y: hitbox.y2 },
      { x: hitbox.x1, y: hitbox.y2 },
    ]
    return cornerPoints.some((cornerPoint) => areEquivalent(point, cornerPoint))
  }
}
