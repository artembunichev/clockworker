import { ExpandedDirection, PointPair, Side, XY } from 'project-utility-types/plane';

import { checkIntersection, getDistanceBetweenPoints } from 'lib/plane';

import { BodiesPrevHitboxesList, ColliderBody, HitboxWithId, ObstacleList, Obstacles } from '.';
import { ColliderCollisionHelpers } from './helpers';

export type IntersectionPoint = { obstacleId: string; side: Side; point: XY };
export type IntersectionPointWithDeltaLineLength = IntersectionPoint & { deltaLineLength: number };

type SetBodyToObstacleFn = (body: ColliderBody, obstacle: PointPair) => void;

type Config = {
  obstacleList: ObstacleList;
  bodiesPrevHitboxesList: BodiesPrevHitboxesList;
  helpers: ColliderCollisionHelpers;
};

export class ColliderCollisionCore {
  private obstacleList: ObstacleList;
  private bodiesPrevHitboxesList: BodiesPrevHitboxesList;
  private helpers: ColliderCollisionHelpers;

  constructor(config: Config) {
    const { obstacleList, bodiesPrevHitboxesList, helpers } = config;

    this.obstacleList = obstacleList;
    this.bodiesPrevHitboxesList = bodiesPrevHitboxesList;
    this.helpers = helpers;
  }

  private getDeltaLines = (
    prevHitbox: PointPair,
    currentHitbox: PointPair,
    step: number,
  ): Array<PointPair> => {
    const width = prevHitbox.x2 - prevHitbox.x1;
    const height = prevHitbox.y2 - prevHitbox.y1;

    const linesForWidth = Math.floor(width / step);
    const linesForHeight = Math.floor(height / step);
    const linesCount = 2 * (linesForWidth + linesForHeight);

    var currentSide = 0;
    const deltaLines: Array<PointPair> = Array.from({ length: linesCount }, (_, index) => {
      if (currentSide === 0) {
        if (index < linesForWidth) {
          return {
            x1: prevHitbox.x1 + index * step,
            y1: prevHitbox.y1,
            x2: currentHitbox.x1 + index * step,
            y2: currentHitbox.y1,
          };
        } else {
          currentSide += 1;
        }
      }
      if (currentSide === 1) {
        if (index < linesForWidth + linesForHeight) {
          return {
            x1: prevHitbox.x2,
            y1: prevHitbox.y1 + (index - linesForWidth) * step,
            x2: currentHitbox.x2,
            y2: currentHitbox.y1 + (index - linesForWidth) * step,
          };
        } else {
          currentSide += 1;
        }
      }
      if (currentSide === 2) {
        if (index < 2 * linesForWidth + linesForHeight) {
          return {
            x1: prevHitbox.x2 - (index - linesForWidth - linesForHeight) * step,
            y1: prevHitbox.y2,
            x2: currentHitbox.x2 - (index - linesForWidth - linesForHeight) * step,
            y2: currentHitbox.y2,
          };
        } else {
          currentSide += 1;
        }
      }
      if (currentSide === 3) {
        if (index < 2 * (linesForWidth + linesForHeight)) {
          return {
            x1: prevHitbox.x1,
            y1: prevHitbox.y2 - (index - 2 * linesForWidth - linesForHeight) * step,
            x2: currentHitbox.x1,
            y2: currentHitbox.y2 - (index - 2 * linesForWidth - linesForHeight) * step,
          };
        }
      }
    }) as Array<PointPair>;

    return deltaLines;
  };

  private getIntersectionPointOfTwoLines = (line1: PointPair, line2: PointPair): XY | null => {
    const intersectionCheckResult = checkIntersection(line1, line2);
    if (intersectionCheckResult.type !== 'intersecting') {
      return null;
    }
    return intersectionCheckResult.point;
  };

  private getIntersectionPointsOfLineAndObstacle = (
    line: PointPair,
    obstacle: HitboxWithId,
  ): Array<IntersectionPoint> | null => {
    const obstacleHitbox = obstacle.hitbox;
    const bottomObstacleLine = this.helpers.getBottomHitboxLine(obstacleHitbox);
    const rightObstacleLine = this.helpers.getRightHitboxLine(obstacleHitbox);
    const topObstacleLine = this.helpers.getTopHitboxLine(obstacleHitbox);
    const leftObstacleLine = this.helpers.getLeftHitboxLine(obstacleHitbox);

    const intersectionPoints: Array<IntersectionPoint> = [];

    const bottomIntersectionPoint = this.getIntersectionPointOfTwoLines(line, bottomObstacleLine);
    if (bottomIntersectionPoint) {
      intersectionPoints.push({
        obstacleId: obstacle.id,
        side: 'bottom',
        point: bottomIntersectionPoint,
      });
    }

    const rightIntersectionPoint = this.getIntersectionPointOfTwoLines(line, rightObstacleLine);
    if (rightIntersectionPoint) {
      intersectionPoints.push({
        obstacleId: obstacle.id,
        side: 'right',
        point: rightIntersectionPoint,
      });
    }

    const topIntersectionPoint = this.getIntersectionPointOfTwoLines(line, topObstacleLine);
    if (topIntersectionPoint) {
      intersectionPoints.push({ obstacleId: obstacle.id, side: 'top', point: topIntersectionPoint });
    }

    const leftIntersectionPoint = this.getIntersectionPointOfTwoLines(line, leftObstacleLine);
    if (leftIntersectionPoint) {
      intersectionPoints.push({ obstacleId: obstacle.id, side: 'left', point: leftIntersectionPoint });
    }

    return intersectionPoints.length ? intersectionPoints : null;
  };

  private getClosestIntersectionPoint = (
    deltaLine: PointPair,
    intersectionPoints: Array<IntersectionPoint>,
  ): IntersectionPointWithDeltaLineLength => {
    const deltaLineRoot: XY = { x: deltaLine.x1, y: deltaLine.y1 };
    const intersectionPointsWithDeltaLineLength: Array<IntersectionPointWithDeltaLineLength> =
      intersectionPoints.map((intersectionPoint) => ({
        ...intersectionPoint,
        deltaLineLength: getDistanceBetweenPoints(deltaLineRoot, intersectionPoint.point),
      }));

    intersectionPointsWithDeltaLineLength.sort((a, b) => a.deltaLineLength - b.deltaLineLength);
    return intersectionPointsWithDeltaLineLength[0];
  };

  private getDownmostIntersectionPoints = (points: Array<IntersectionPoint>): IntersectionPoint => {
    return points
      .filter(({ side }) => side === 'bottom' || side === 'top')
      .sort((a, b) => b.point.y - a.point.y)[0];
  };
  private getRightmostIntersectionPoint = (points: Array<IntersectionPoint>): IntersectionPoint => {
    return points.filter(({ side }) => side === 'right').sort((a, b) => b.point.x - a.point.x)[0];
  };
  private getTopmostIntersectionPoint = (points: Array<IntersectionPoint>): IntersectionPoint => {
    return points
      .filter(({ side }) => side === 'top' || side === 'bottom')
      .sort((a, b) => a.point.y - b.point.y)[0];
  };
  private getLeftmostIntersectionPoint = (points: Array<IntersectionPoint>): IntersectionPoint => {
    return points.filter(({ side }) => side === 'left').sort((a, b) => a.point.x - b.point.x)[0];
  };

  private getClosestPointsToBody = ({
    intersectionPoints,
    bodyMovementDirection,
  }: {
    intersectionPoints: Array<IntersectionPoint>;
    bodyMovementDirection: ExpandedDirection | null;
  }): Array<IntersectionPoint> | null => {
    if (!bodyMovementDirection) {
      return null;
    }

    const closestPoints: Array<IntersectionPoint> = [];

    if (!intersectionPoints.length) {
      return null;
    }

    if (intersectionPoints.length > 1) {
      if (bodyMovementDirection.includes('down')) {
        const topmostIntersectionPoint = this.getTopmostIntersectionPoint(intersectionPoints);
        if (topmostIntersectionPoint) {
          closestPoints.push(topmostIntersectionPoint);
        }
      }
      if (bodyMovementDirection.includes('right')) {
        const leftmostIntersectionPoint = this.getLeftmostIntersectionPoint(intersectionPoints);
        if (leftmostIntersectionPoint) {
          closestPoints.push(leftmostIntersectionPoint);
        }
      }
      if (bodyMovementDirection.includes('up')) {
        const downmostIntersectionPoint = this.getDownmostIntersectionPoints(intersectionPoints);
        if (downmostIntersectionPoint) {
          closestPoints.push(downmostIntersectionPoint);
        }
      }
      if (bodyMovementDirection.includes('left')) {
        const rightmostIntersectionPoint = this.getRightmostIntersectionPoint(intersectionPoints);
        if (rightmostIntersectionPoint) {
          closestPoints.push(rightmostIntersectionPoint);
        }
      }
    } else {
      closestPoints.push(intersectionPoints[0]);
    }
    return closestPoints;
  };

  private getIntersectionPointsOfBodyDeltaLinesAndObstacles = ({
    prevHitbox,
    currentHitbox,
    obstacles,
  }: {
    prevHitbox: PointPair;
    currentHitbox: PointPair;
    obstacles: Obstacles;
  }): Array<IntersectionPoint> | null => {
    const bodyDeltaLines = this.getDeltaLines(prevHitbox, currentHitbox, 5);

    var closestIntersectionPoints: Array<IntersectionPoint> = [];
    bodyDeltaLines.forEach((bodyDeltaLine) => {
      const intersectionPointsWithObstacles: Array<IntersectionPoint> = [];
      obstacles.forEach((obstacle) => {
        const intersectionPointsWithObstacle = this.getIntersectionPointsOfLineAndObstacle(
          bodyDeltaLine,
          obstacle,
        );
        if (intersectionPointsWithObstacle) {
          intersectionPointsWithObstacles.push(...intersectionPointsWithObstacle);
        }
      });

      if (intersectionPointsWithObstacles.length) {
        var closestPoint: IntersectionPoint;
        if (intersectionPointsWithObstacles.length > 1) {
          closestPoint = this.getClosestIntersectionPoint(
            bodyDeltaLine,
            intersectionPointsWithObstacles,
          );
        } else {
          closestPoint = intersectionPointsWithObstacles[0];
        }

        // угловые точки игнорируются, т.к они не относятся ни к одной из 4 сторон однозначно
        if (
          !this.helpers.isHitboxCornerPoint(
            this.helpers.getObstacleById(closestPoint.obstacleId).hitbox,
            closestPoint.point,
          )
        ) {
          closestIntersectionPoints.push(closestPoint);
        }
      }
    });

    if (!closestIntersectionPoints.length) {
      return null;
    }

    closestIntersectionPoints = closestIntersectionPoints.filter(({ obstacleId, side }) => {
      const obstacle: HitboxWithId = obstacles.find(({ id }) => id === obstacleId)!;
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
      );
    });

    if (!closestIntersectionPoints.length) {
      return null;
    }

    if (closestIntersectionPoints.length > 1) {
      const bodyMovementDirection = this.helpers.getMovementDirectionByHitbox(
        prevHitbox,
        currentHitbox,
      );
      const intersectionPointsOfBodyDeltaLinesAndObstacles = this.getClosestPointsToBody({
        intersectionPoints: closestIntersectionPoints,
        bodyMovementDirection,
      });
      return intersectionPointsOfBodyDeltaLinesAndObstacles;
    } else {
      return [closestIntersectionPoints[0]];
    }
  };

  private setBodyToObstacleBottom = (body: ColliderBody, obstacle: PointPair): void => {
    body.position.setY(obstacle.y2);
  };
  private setBodyToObstacleRight = (body: ColliderBody, obstacle: PointPair): void => {
    body.position.setX(obstacle.x2);
  };
  private setBodyToObstacleTop = (body: ColliderBody, obstacle: PointPair): void => {
    body.position.setY(obstacle.y1 - body.size.height);
  };
  private setBodyToObstacleLeft = (body: ColliderBody, obstacle: PointPair): void => {
    body.position.setX(obstacle.x1 - body.size.width);
  };

  private handleYIntersectionOfBodyAndObstacle = (
    body: ColliderBody,
    obstacle: PointPair,
    actionToChangeBodyPosition: SetBodyToObstacleFn,
  ): void => {
    const prevBodyHitbox = this.bodiesPrevHitboxesList[body.id];
    const currentBodyHitbox = body.hitbox;

    const deltaXHitbox = this.helpers.getDeltaXHitbox(prevBodyHitbox, currentBodyHitbox);

    const intersectionPointsOfXObstacles = this.getIntersectionPointsOfBodyAndObstacles({
      from: prevBodyHitbox,
      to: deltaXHitbox,
      obstacles: this.obstacleList.elements,
    });

    if (intersectionPointsOfXObstacles) {
      const intersectionPoint = intersectionPointsOfXObstacles[0];
      const intersectedObstacleHitbox = this.helpers.getObstacleById(
        intersectionPoint.obstacleId,
      ).hitbox;
      if (intersectionPoint.side === 'right') {
        this.setBodyToObstacleRight(body, intersectedObstacleHitbox);
      } else if (intersectionPoint.side === 'left') {
        this.setBodyToObstacleLeft(body, intersectedObstacleHitbox);
      }
    }

    actionToChangeBodyPosition(body, obstacle);
  };
  private handleXIntersectionPointOfBodyAndObstacle = (
    body: ColliderBody,
    obstacle: PointPair,
    actionToChangeBodyPosition: SetBodyToObstacleFn,
  ): void => {
    const prevBodyHitbox = this.bodiesPrevHitboxesList[body.id];
    const currentBodyHitbox = body.hitbox;

    const deltaYHitbox = this.helpers.getDeltaYHitbox(prevBodyHitbox, currentBodyHitbox);

    const intersectionPointsOfYObstacles = this.getIntersectionPointsOfBodyAndObstacles({
      from: prevBodyHitbox,
      to: deltaYHitbox,
      obstacles: this.obstacleList.elements,
    });

    if (intersectionPointsOfYObstacles) {
      const intersectionPoint = intersectionPointsOfYObstacles[0];
      const intersectedObstacleHitbox = this.helpers.getObstacleById(
        intersectionPoint.obstacleId,
      ).hitbox;
      if (intersectionPoint.side === 'bottom') {
        this.setBodyToObstacleBottom(body, intersectedObstacleHitbox);
      } else if (intersectionPoint.side === 'top') {
        this.setBodyToObstacleTop(body, intersectedObstacleHitbox);
      }
    }

    actionToChangeBodyPosition(body, obstacle);
  };

  getIntersectionPointsOfBodyAndObstacles = ({
    from,
    to,
    obstacles,
  }: {
    from: PointPair;
    to: PointPair;
    obstacles: Obstacles;
  }): Array<IntersectionPoint> | null => {
    const prevToCurrentBodyDeltaLinesIntersectionPoints =
      this.getIntersectionPointsOfBodyDeltaLinesAndObstacles({
        prevHitbox: from,
        currentHitbox: to,
        obstacles,
      });

    return prevToCurrentBodyDeltaLinesIntersectionPoints;
  };

  handleIntersectionPoint = (body: ColliderBody, intersectionPoint: IntersectionPoint): void => {
    const obstacle = this.obstacleList.elements.find(({ id }) => id === intersectionPoint.obstacleId)!;
    const obstacleHitbox = obstacle.hitbox;
    if (intersectionPoint.side === 'bottom') {
      this.handleYIntersectionOfBodyAndObstacle(body, obstacleHitbox, this.setBodyToObstacleBottom);
    }
    if (intersectionPoint.side === 'right') {
      this.handleXIntersectionPointOfBodyAndObstacle(
        body,
        obstacleHitbox,
        this.setBodyToObstacleRight,
      );
    }
    if (intersectionPoint.side === 'top') {
      this.handleYIntersectionOfBodyAndObstacle(body, obstacleHitbox, this.setBodyToObstacleTop);
    }
    if (intersectionPoint.side === 'left') {
      this.handleXIntersectionPointOfBodyAndObstacle(body, obstacleHitbox, this.setBodyToObstacleLeft);
    }
  };
}
