import { ExpandedDirection, PointPair, Side, XY } from 'project-utility-types/plane'

import { PlayerCharacter } from 'stores/game/play/characters/list/player/character'

import { areEquivalent } from 'lib/are-equivalent'
import { remove } from 'lib/arrays'
import { checkIntersection, getDistanceBetweenPoints } from 'lib/plane'

import { Body } from './body'
import { AnyCharacter } from './characters/character'
import { getMovementDirection } from './lib/movement'
import { GameScreen } from './screen'

type ColliderBody = Body | AnyCharacter | PlayerCharacter

type Stucks = Record<string, Array<string>>

const isCharacter = (body: ColliderBody): body is AnyCharacter => {
  return (body as AnyCharacter).movement !== undefined
}

export type HitboxWithId = { hitbox: PointPair; id: string }

type IntersectionPoint = { obstacleId: string; side: Side; point: XY }
type IntersectionPointWithDeltaLineLength = IntersectionPoint & { deltaLineLength: number }

type SetBodyToObstacleFn = (body: ColliderBody, obstacle: PointPair) => void

type ColliderConfig = {
  screen: GameScreen
}

export class Collider {
  private screen: GameScreen

  constructor(config: ColliderConfig) {
    const { screen } = config
    this.screen = screen
  }

  private bodies: Array<ColliderBody> = []
  addBody = (body: Body): void => {
    this.bodies.push(body)
  }
  addBodies = (bodies: Array<Body>): void => {
    bodies.forEach(this.addBody)
  }
  removeBody = (bodyId: string): void => {
    this.bodies = remove(this.bodies, ({ id }) => id === bodyId)
  }
  clearBodies = (): void => {
    this.bodies = []
  }

  stucks: Stucks = {} as Stucks
  private addStuck = (bodyId: string, stuckPlace: string): void => {
    if (!this.stucks[bodyId]) {
      this.stucks[bodyId] = []
    }
    if (!this.stucks[bodyId].includes(stuckPlace)) {
      this.stucks[bodyId].push(stuckPlace)
    }
  }
  private removeStucks = (bodyId: string): void => {
    this.stucks[bodyId] = []
  }

  private staticObstacles: Array<HitboxWithId> = []
  addStaticObstacle = (obstacle: HitboxWithId): void => {
    this.staticObstacles.push(obstacle)
  }
  addStaticObstacles = (obstacleHitboxes: Array<HitboxWithId>): void => {
    obstacleHitboxes.forEach(this.addStaticObstacle)
  }
  removeStaticObstacle = (obstacleId: string): void => {
    this.staticObstacles = remove(this.staticObstacles, ({ id }) => id === obstacleId)
  }
  clearStaticObstacles = (): void => {
    this.staticObstacles = []
  }

  clear = (): void => {
    this.clearBodies()
    this.clearStaticObstacles()
  }

  //! вспомогательные функции
  private isXChanged = (prevHitbox: PointPair, currentHitbox: PointPair): boolean => {
    return prevHitbox.x1 !== currentHitbox.x1 || prevHitbox.x2 !== currentHitbox.x2
  }
  private isYChanged = (prevHitbox: PointPair, currentHitbox: PointPair): boolean => {
    return prevHitbox.y1 !== currentHitbox.y1 || prevHitbox.y2 !== currentHitbox.y2
  }

  private getStaticObstacleById = (obstacleId: string): HitboxWithId => {
    return this.staticObstacles.find(({ id }) => id === obstacleId)!
  }

  private bodiesPrevHitboxes: Record<string, PointPair> = {}
  private saveBodyHitboxToPrev = (body: ColliderBody): void => {
    this.bodiesPrevHitboxes[body.id] = body.hitbox
  }

  private isBodyStucked = (bodyId: string): boolean => {
    return this.stucks[bodyId].length > 0
  }

  private getMovementDirectionByHitbox = (
    prevHitbox: PointPair,
    currentHitbox: PointPair,
  ): ExpandedDirection => {
    const start: XY = { x: prevHitbox.x1, y: prevHitbox.y1 }
    const end: XY = { x: currentHitbox.x1, y: currentHitbox.y1 }

    return getMovementDirection(start, end)
  }

  private getBottomHitboxLine = (hitbox: PointPair): PointPair => {
    return {
      x1: hitbox.x1,
      y1: hitbox.y2,
      x2: hitbox.x2,
      y2: hitbox.y2,
    }
  }
  private getRightHitboxLine = (hitbox: PointPair): PointPair => {
    return {
      x1: hitbox.x2,
      y1: hitbox.y1,
      x2: hitbox.x2,
      y2: hitbox.y2,
    }
  }
  private getTopHitboxLine = (hitbox: PointPair): PointPair => {
    return {
      x1: hitbox.x1,
      y1: hitbox.y1,
      x2: hitbox.x2,
      y2: hitbox.y1,
    }
  }
  private getLeftHitboxLine = (hitbox: PointPair): PointPair => {
    return {
      x1: hitbox.x1,
      y1: hitbox.y1,
      x2: hitbox.x1,
      y2: hitbox.y2,
    }
  }
  private getDeltaXHitbox = (prevHitbox: PointPair, currentHitbox: PointPair): PointPair => {
    return {
      x1: currentHitbox.x1,
      y1: prevHitbox.y1,
      x2: currentHitbox.x2,
      y2: prevHitbox.y2,
    }
  }
  private getDeltaYHitbox = (prevHitbox: PointPair, currentHitbox: PointPair): PointPair => {
    return {
      x1: prevHitbox.x1,
      y1: currentHitbox.y1,
      x2: prevHitbox.x2,
      y2: currentHitbox.y2,
    }
  }

  private isObstacleCornerPoint = (obstacle: PointPair, point: XY): boolean => {
    const cornerPoints: Array<XY> = [
      { x: obstacle.x1, y: obstacle.y1 },
      { x: obstacle.x2, y: obstacle.y1 },
      { x: obstacle.x2, y: obstacle.y2 },
      { x: obstacle.x1, y: obstacle.y2 },
    ]
    return cornerPoints.some((cornerPoint) => areEquivalent(point, cornerPoint))
  }

  //! получение дельта-линий
  private getDeltaLines = (
    prevHitbox: PointPair,
    currentHitbox: PointPair,
    step: number,
  ): Array<PointPair> => {
    const width = prevHitbox.x2 - prevHitbox.x1
    const height = prevHitbox.y2 - prevHitbox.y1

    const linesForWidth = Math.floor(width / step)
    const linesForHeight = Math.floor(height / step)
    const linesCount = 2 * (linesForWidth + linesForHeight)

    var currentSide = 0
    const deltaLines: Array<PointPair> = Array.from({ length: linesCount }, (_, index) => {
      if (currentSide === 0) {
        if (index < linesForWidth) {
          return {
            x1: prevHitbox.x1 + index * step,
            y1: prevHitbox.y1,
            x2: currentHitbox.x1 + index * step,
            y2: currentHitbox.y1,
          }
        } else {
          currentSide += 1
        }
      }
      if (currentSide === 1) {
        if (index < linesForWidth + linesForHeight) {
          return {
            x1: prevHitbox.x2,
            y1: prevHitbox.y1 + (index - linesForWidth) * step,
            x2: currentHitbox.x2,
            y2: currentHitbox.y1 + (index - linesForWidth) * step,
          }
        } else {
          currentSide += 1
        }
      }
      if (currentSide === 2) {
        if (index < 2 * linesForWidth + linesForHeight) {
          return {
            x1: prevHitbox.x2 - (index - linesForWidth - linesForHeight) * step,
            y1: prevHitbox.y2,
            x2: currentHitbox.x2 - (index - linesForWidth - linesForHeight) * step,
            y2: currentHitbox.y2,
          }
        } else {
          currentSide += 1
        }
      }
      if (currentSide === 3) {
        if (index < 2 * (linesForWidth + linesForHeight)) {
          return {
            x1: prevHitbox.x1,
            y1: prevHitbox.y2 - (index - 2 * linesForWidth - linesForHeight) * step,
            x2: currentHitbox.x1,
            y2: currentHitbox.y2 - (index - 2 * linesForWidth - linesForHeight) * step,
          }
        }
      }
    }) as Array<PointPair>

    return deltaLines
  }

  //! определение точек пересечения
  private getIntersectionPointOfTwoLines = (line1: PointPair, line2: PointPair): XY | null => {
    const intersectionCheckResult = checkIntersection(line1, line2)
    if (intersectionCheckResult.type !== 'intersecting') {
      return null
    }
    return intersectionCheckResult.point
  }

  private getIntersectionPointsOfLineAndObstacle = (
    line: PointPair,
    obstacle: HitboxWithId,
  ): Array<IntersectionPoint> | null => {
    const obstacleHitbox = obstacle.hitbox
    const bottomObstacleLine = this.getBottomHitboxLine(obstacleHitbox)
    const rightObstacleLine = this.getRightHitboxLine(obstacleHitbox)
    const topObstacleLine = this.getTopHitboxLine(obstacleHitbox)
    const leftObstacleLine = this.getLeftHitboxLine(obstacleHitbox)

    const intersectionPoints: Array<IntersectionPoint> = []

    const bottomIntersectionPoint = this.getIntersectionPointOfTwoLines(line, bottomObstacleLine)
    if (bottomIntersectionPoint) {
      intersectionPoints.push({
        obstacleId: obstacle.id,
        side: 'bottom',
        point: bottomIntersectionPoint,
      })
    }

    const rightIntersectionPoint = this.getIntersectionPointOfTwoLines(line, rightObstacleLine)
    if (rightIntersectionPoint) {
      intersectionPoints.push({
        obstacleId: obstacle.id,
        side: 'right',
        point: rightIntersectionPoint,
      })
    }

    const topIntersectionPoint = this.getIntersectionPointOfTwoLines(line, topObstacleLine)
    if (topIntersectionPoint) {
      intersectionPoints.push({ obstacleId: obstacle.id, side: 'top', point: topIntersectionPoint })
    }

    const leftIntersectionPoint = this.getIntersectionPointOfTwoLines(line, leftObstacleLine)
    if (leftIntersectionPoint) {
      intersectionPoints.push({ obstacleId: obstacle.id, side: 'left', point: leftIntersectionPoint })
    }

    return intersectionPoints.length ? intersectionPoints : null
  }

  private getClosestIntersectionPoint = (
    deltaLine: PointPair,
    intersectionPoints: Array<IntersectionPoint>,
  ): IntersectionPointWithDeltaLineLength => {
    const deltaLineRoot: XY = { x: deltaLine.x1, y: deltaLine.y1 }
    const intersectionPointsWithDeltaLineLength: Array<IntersectionPointWithDeltaLineLength> =
      intersectionPoints.map((intersectionPoint) => ({
        ...intersectionPoint,
        deltaLineLength: getDistanceBetweenPoints(deltaLineRoot, intersectionPoint.point),
      }))

    intersectionPointsWithDeltaLineLength.sort((a, b) => a.deltaLineLength - b.deltaLineLength)
    return intersectionPointsWithDeltaLineLength[0]
  }

  private getDownmostIntersectionPoints = (points: Array<IntersectionPoint>): IntersectionPoint => {
    return points
      .filter(({ side }) => side === 'bottom' || side === 'top')
      .sort((a, b) => b.point.y - a.point.y)[0]
  }
  private getRightmostIntersectionPoint = (points: Array<IntersectionPoint>): IntersectionPoint => {
    return points.filter(({ side }) => side === 'right').sort((a, b) => b.point.x - a.point.x)[0]
  }
  private getTopmostIntersectionPoint = (points: Array<IntersectionPoint>): IntersectionPoint => {
    return points
      .filter(({ side }) => side === 'top' || side === 'bottom')
      .sort((a, b) => a.point.y - b.point.y)[0]
  }
  private getLeftmostIntersectionPoint = (points: Array<IntersectionPoint>): IntersectionPoint => {
    return points.filter(({ side }) => side === 'left').sort((a, b) => a.point.x - b.point.x)[0]
  }

  private getClosestPointsToBody = ({
    intersectionPoints,
    bodyMovementDirection,
  }: {
    intersectionPoints: Array<IntersectionPoint>
    bodyMovementDirection: ExpandedDirection
  }): Array<IntersectionPoint> | null => {
    const closestPoints: Array<IntersectionPoint> = []

    if (!intersectionPoints.length) {
      return null
    }

    if (intersectionPoints.length > 1) {
      if (bodyMovementDirection.includes('down')) {
        const topmostIntersectionPoint = this.getTopmostIntersectionPoint(intersectionPoints)
        if (topmostIntersectionPoint) {
          closestPoints.push(topmostIntersectionPoint)
        }
      }
      if (bodyMovementDirection.includes('right')) {
        const leftmostIntersectionPoint = this.getLeftmostIntersectionPoint(intersectionPoints)
        if (leftmostIntersectionPoint) {
          closestPoints.push(leftmostIntersectionPoint)
        }
      }
      if (bodyMovementDirection.includes('up')) {
        const downmostIntersectionPoint = this.getDownmostIntersectionPoints(intersectionPoints)
        if (downmostIntersectionPoint) {
          closestPoints.push(downmostIntersectionPoint)
        }
      }
      if (bodyMovementDirection.includes('left')) {
        const rightmostIntersectionPoint = this.getRightmostIntersectionPoint(intersectionPoints)
        if (rightmostIntersectionPoint) {
          closestPoints.push(rightmostIntersectionPoint)
        }
      }
    } else {
      closestPoints.push(intersectionPoints[0])
    }
    return closestPoints
  }

  private getIntersectionPointsOfBodyDeltaLinesAndObstacles = ({
    prevHitbox,
    currentHitbox,
    obstacles,
  }: {
    prevHitbox: PointPair
    currentHitbox: PointPair
    obstacles: Array<HitboxWithId>
  }): Array<IntersectionPoint> | null => {
    const bodyDeltaLines = this.getDeltaLines(prevHitbox, currentHitbox, 5)

    var closestIntersectionPoints: Array<IntersectionPoint> = []
    bodyDeltaLines.forEach((bodyDeltaLine) => {
      const intersectionPointsWithObstacles: Array<IntersectionPoint> = []
      obstacles.forEach((obstacle) => {
        const intersectionPointsWithObstacle = this.getIntersectionPointsOfLineAndObstacle(
          bodyDeltaLine,
          obstacle,
        )
        if (intersectionPointsWithObstacle) {
          intersectionPointsWithObstacles.push(...intersectionPointsWithObstacle)
        }
      })

      if (intersectionPointsWithObstacles.length) {
        var closestPoint: IntersectionPoint
        if (intersectionPointsWithObstacles.length > 1) {
          closestPoint = this.getClosestIntersectionPoint(
            bodyDeltaLine,
            intersectionPointsWithObstacles,
          )
        } else {
          closestPoint = intersectionPointsWithObstacles[0]
        }

        // угловые точки игнорируются, т.к они не относятся ни к одной из 4 сторон однозначно
        if (
          !this.isObstacleCornerPoint(
            this.getStaticObstacleById(closestPoint.obstacleId).hitbox,
            closestPoint.point,
          )
        ) {
          closestIntersectionPoints.push(closestPoint)
        }
      }
    })

    if (!closestIntersectionPoints.length) {
      return null
    }

    closestIntersectionPoints = closestIntersectionPoints.filter(({ obstacleId, side }) => {
      const obstacle: HitboxWithId = obstacles.find(({ id }) => id === obstacleId)!
      return (
        (side === 'bottom' &&
          prevHitbox.y1 >= obstacle.hitbox.y2 &&
          currentHitbox.y1 < obstacle.hitbox.y2) ||
        (side === 'right' &&
          prevHitbox.x1 >= obstacle.hitbox.x2 &&
          currentHitbox.x1 < obstacle.hitbox.x2) ||
        (side === 'top' &&
          prevHitbox.y2 <= obstacle.hitbox.y1 &&
          currentHitbox.y2 > obstacle.hitbox.y1) ||
        (side === 'left' &&
          prevHitbox.x2 <= obstacle.hitbox.x1 &&
          currentHitbox.x2 > obstacle.hitbox.x1)
      )
    })

    if (!closestIntersectionPoints.length) {
      return null
    }

    if (closestIntersectionPoints.length > 1) {
      const bodyMovementDirection = this.getMovementDirectionByHitbox(prevHitbox, currentHitbox)
      const intersectionPointsOfBodyDeltaLinesAndObstacles = this.getClosestPointsToBody({
        intersectionPoints: closestIntersectionPoints,
        bodyMovementDirection,
      })
      return intersectionPointsOfBodyDeltaLinesAndObstacles
    } else {
      return [closestIntersectionPoints[0]]
    }
  }

  private getIntersectionPointsOfBodyAndObstacles = ({
    from,
    to,
    obstacles,
  }: {
    from: PointPair
    to: PointPair
    obstacles: Array<HitboxWithId>
  }): Array<IntersectionPoint> | null => {
    const prevToCurrentBodyDeltaLinesIntersectionPoints =
      this.getIntersectionPointsOfBodyDeltaLinesAndObstacles({
        prevHitbox: from,
        currentHitbox: to,
        obstacles,
      })

    return prevToCurrentBodyDeltaLinesIntersectionPoints
  }

  private handleIntersectionPoint = (
    body: ColliderBody,
    intersectionPoint: IntersectionPoint,
  ): void => {
    const obstacle = this.staticObstacles.find(({ id }) => id === intersectionPoint.obstacleId)!
    const obstacleHitbox = obstacle.hitbox
    if (intersectionPoint.side === 'bottom') {
      this.handleYIntersectionOfBodyAndObstacle(body, obstacleHitbox, this.setBodyToObstacleBottom)
    }
    if (intersectionPoint.side === 'right') {
      this.handleXIntersectionPointOfBodyAndObstacle(body, obstacleHitbox, this.setBodyToObstacleRight)
    }
    if (intersectionPoint.side === 'top') {
      this.handleYIntersectionOfBodyAndObstacle(body, obstacleHitbox, this.setBodyToObstacleTop)
    }
    if (intersectionPoint.side === 'left') {
      this.handleXIntersectionPointOfBodyAndObstacle(body, obstacleHitbox, this.setBodyToObstacleLeft)
    }
  }

  //! обработка точек пересечения
  private setBodyToObstacleBottom = (body: ColliderBody, obstacle: PointPair): void => {
    body.position.setY(obstacle.y2)
  }
  private setBodyToObstacleRight = (body: ColliderBody, obstacle: PointPair): void => {
    body.position.setX(obstacle.x2)
  }
  private setBodyToObstacleTop = (body: ColliderBody, obstacle: PointPair): void => {
    body.position.setY(obstacle.y1 - body.size.height)
  }
  private setBodyToObstacleLeft = (body: ColliderBody, obstacle: PointPair): void => {
    body.position.setX(obstacle.x1 - body.size.width)
  }

  private handleYIntersectionOfBodyAndObstacle = (
    body: ColliderBody,
    obstacle: PointPair,
    actionToChangeBodyPosition: SetBodyToObstacleFn,
  ): void => {
    const prevBodyHitbox = this.bodiesPrevHitboxes[body.id]
    const currentBodyHitbox = body.hitbox

    const deltaXHitbox = this.getDeltaXHitbox(prevBodyHitbox, currentBodyHitbox)

    const intersectionPointsOfXObstacles = this.getIntersectionPointsOfBodyAndObstacles({
      from: prevBodyHitbox,
      to: deltaXHitbox,
      obstacles: this.staticObstacles,
    })

    if (intersectionPointsOfXObstacles) {
      const intersectionPoint = intersectionPointsOfXObstacles[0]
      const intersectedObstacleHitbox = this.getStaticObstacleById(intersectionPoint.obstacleId).hitbox
      if (intersectionPoint.side === 'right') {
        this.setBodyToObstacleRight(body, intersectedObstacleHitbox)
      } else if (intersectionPoint.side === 'left') {
        this.setBodyToObstacleLeft(body, intersectedObstacleHitbox)
      }
    }

    actionToChangeBodyPosition(body, obstacle)
  }
  private handleXIntersectionPointOfBodyAndObstacle = (
    body: ColliderBody,
    obstacle: PointPair,
    actionToChangeBodyPosition: SetBodyToObstacleFn,
  ): void => {
    const prevBodyHitbox = this.bodiesPrevHitboxes[body.id]
    const currentBodyHitbox = body.hitbox

    const deltaYHitbox = this.getDeltaYHitbox(prevBodyHitbox, currentBodyHitbox)

    const intersectionPointsOfYObstacles = this.getIntersectionPointsOfBodyAndObstacles({
      from: prevBodyHitbox,
      to: deltaYHitbox,
      obstacles: this.staticObstacles,
    })

    if (intersectionPointsOfYObstacles) {
      const intersectionPoint = intersectionPointsOfYObstacles[0]
      const intersectedObstacleHitbox = this.getStaticObstacleById(intersectionPoint.obstacleId).hitbox
      if (intersectionPoint.side === 'bottom') {
        this.setBodyToObstacleBottom(body, intersectedObstacleHitbox)
      } else if (intersectionPoint.side === 'top') {
        this.setBodyToObstacleTop(body, intersectedObstacleHitbox)
      }
    }

    actionToChangeBodyPosition(body, obstacle)
  }

  //! работа коллайдера
  private handleBodyAndStaticObstaclesCollision = (
    body: ColliderBody,
  ): Array<IntersectionPoint> | null => {
    const bodyPrevToCurrentIntersectionPointsWithObstacles =
      this.getIntersectionPointsOfBodyAndObstacles({
        from: this.bodiesPrevHitboxes[body.id],
        to: body.hitbox,
        obstacles: this.staticObstacles,
      })

    if (bodyPrevToCurrentIntersectionPointsWithObstacles) {
      bodyPrevToCurrentIntersectionPointsWithObstacles.forEach((intersectionPoint) => {
        this.handleIntersectionPoint(body, intersectionPoint)
      })
    }

    return bodyPrevToCurrentIntersectionPointsWithObstacles
  }

  // возвращает список препятствий, в которые упёрлось тело
  private handleBodyCollision = (body: ColliderBody): Array<string> => {
    const prevBodyHitbox = this.bodiesPrevHitboxes[body.id]

    var bodyStuckPlaces: Array<string> = []
    if (prevBodyHitbox) {
      const bodyStuckPoints: Array<IntersectionPoint> | null =
        this.handleBodyAndStaticObstaclesCollision(body)

      if (bodyStuckPoints) {
        bodyStuckPlaces = bodyStuckPoints.map(({ obstacleId }) => obstacleId)
      }
    }

    return bodyStuckPlaces
  }

  //? пока что не разрешаем выходить персонажам за ЭКРАН
  // возвращает список препятствий, в которые упёрлось тело
  private keepBodyInMap = (body: ColliderBody): Array<string> => {
    const bodyMinX = 0
    const bodyMinY = 0
    const bodyMaxX = this.screen.width - body.size.width
    const bodyMaxY = this.screen.height - body.size.height

    const isOutOfDownMapBorder = body.position.y > bodyMaxY
    const isOutOfRightMapBorder = body.position.x > bodyMaxX
    const isOutOfTopMapBorder = body.position.y < bodyMinY
    const isOutOfLeftMapBorder = body.position.x < bodyMinX

    const isOutOfMap =
      isOutOfDownMapBorder || isOutOfRightMapBorder || isOutOfTopMapBorder || isOutOfLeftMapBorder

    const bodyStuckPlaces: Array<string> = []

    if (isOutOfMap) {
      if (isOutOfDownMapBorder) {
        body.position.setY(bodyMaxY)
        bodyStuckPlaces.push('downMapBorder')
      }
      if (isOutOfRightMapBorder) {
        body.position.setX(bodyMaxX)
        bodyStuckPlaces.push('rightMapBorder')
      }
      if (isOutOfTopMapBorder) {
        body.position.setY(bodyMinY)
        bodyStuckPlaces.push('topMapBorder')
      }
      if (isOutOfLeftMapBorder) {
        body.position.setX(bodyMinX)
        bodyStuckPlaces.push('leftMapBorder')
      }
    }

    return bodyStuckPlaces
  }

  private checkBodyForSliding = (body: ColliderBody): void => {
    if (isCharacter(body)) {
      const prevBodyHitbox = this.bodiesPrevHitboxes[body.id]

      const isXChanged = this.isXChanged(prevBodyHitbox, body.hitbox)
      const isYChanged = this.isYChanged(prevBodyHitbox, body.hitbox)

      const bodyIsStucked = this.isBodyStucked(body.id)
      const onlyOneCoordinateChanged = (isXChanged && !isYChanged) || (!isXChanged && isYChanged)

      const bodyIsSliding = bodyIsStucked && onlyOneCoordinateChanged

      body.movement.setIsSliding(bodyIsSliding)
    }
  }

  private checkBodiesForSliding = (): void => {
    this.bodies.forEach(this.checkBodyForSliding)
  }

  private handleBodiesCollision = (): void => {
    this.bodies.forEach((body) => {
      const bodyCollisionStuckPlaces = this.handleBodyCollision(body)
      const bodyMapStuckPlaces = this.keepBodyInMap(body)

      const bodyStuckPlaces = [...bodyCollisionStuckPlaces, ...bodyMapStuckPlaces]

      if (bodyStuckPlaces.length > 0) {
        bodyStuckPlaces.forEach((stuckPlace) => {
          this.addStuck(body.id, stuckPlace)
        })
      } else {
        this.removeStucks(body.id)
      }

      if (isCharacter(body)) {
        const isBodyStucked = this.isBodyStucked(body.id)
        body.movement.setIsStuck(isBodyStucked)
      }
    })
  }

  private savePrevBodiesHitboxesIfNoPrevHitboxes = (): void => {
    this.bodies.forEach((body) => {
      if (this.bodiesPrevHitboxes[body.id] === undefined) {
        this.saveBodyHitboxToPrev(body)
      }
    })
  }

  private savePrevBodiesHitboxes = (): void => {
    this.bodies.forEach(this.saveBodyHitboxToPrev)
  }

  update = (): void => {
    this.savePrevBodiesHitboxesIfNoPrevHitboxes()
    this.handleBodiesCollision()
    this.checkBodiesForSliding()
    this.savePrevBodiesHitboxes()
  }
}
