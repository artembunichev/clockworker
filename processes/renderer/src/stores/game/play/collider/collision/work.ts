import { BodiesPrevHitboxes, BodyList, ColliderBody, ObstacleList, Stucks, isCharacter } from '.';
import { ColliderCollisionCore, IntersectionPoint } from './core';
import { ColliderCollisionHelpers } from './helpers';

type Config = {
  core: ColliderCollisionCore;
  obstacleList: ObstacleList;
  bodyList: BodyList;
  bodiesPrevHitboxes: BodiesPrevHitboxes;
  stucks: Stucks;
  helpers: ColliderCollisionHelpers;
};

export class ColliderCollisionWork {
  private core: ColliderCollisionCore;
  private obstacleList: ObstacleList;
  private bodyList: BodyList;
  private bodiesPrevHitboxes: BodiesPrevHitboxes;
  private stucks: Stucks;
  private helpers: ColliderCollisionHelpers;

  constructor(config: Config) {
    const { core, obstacleList, bodyList, bodiesPrevHitboxes, stucks, helpers } = config;

    this.core = core;
    this.obstacleList = obstacleList;
    this.bodyList = bodyList;
    this.bodiesPrevHitboxes = bodiesPrevHitboxes;
    this.stucks = stucks;
    this.helpers = helpers;
  }

  private handleBodyCollisionWithStaticObstacles = (
    body: ColliderBody,
  ): Array<IntersectionPoint> | null => {
    const bodyPrevToCurrentIntersectionPointsWithObstacles =
      this.core.getIntersectionPointsOfBodyAndObstacles({
        from: this.bodiesPrevHitboxes.list[body.id],
        to: body.hitbox,
        obstacles: this.obstacleList.elements,
      });

    if (bodyPrevToCurrentIntersectionPointsWithObstacles) {
      bodyPrevToCurrentIntersectionPointsWithObstacles.forEach((intersectionPoint) => {
        this.core.handleIntersectionPoint(body, intersectionPoint);
      });
    }

    return bodyPrevToCurrentIntersectionPointsWithObstacles;
  };

  private handleBodyStuckPlacesWithStaticObstacles = (body: ColliderBody): Array<string> => {
    const prevBodyHitbox = this.bodiesPrevHitboxes.list[body.id];

    var bodyStuckPlaces: Array<string> = [];
    if (prevBodyHitbox) {
      const bodyStuckPoints: Array<IntersectionPoint> | null =
        this.handleBodyCollisionWithStaticObstacles(body);

      if (bodyStuckPoints) {
        bodyStuckPlaces = bodyStuckPoints.map(({ obstacleId }) => obstacleId);
      }
    }

    return bodyStuckPlaces;
  };

  // пока что не разрешаем персонажам выходить за ЭКРАН
  private handleBodyStuckPlacesWithMapBorders = (body: ColliderBody): Array<string> => {
    const { bottomY, rightX, topY, leftX } = this.helpers.getBodyExtremeCoords(body);
    const { outOfBottomMapBorder, outOfRightMapBorder, outOfTopMapBorder, outOfLeftMapBorder } =
      this.helpers.getBodyOutOfMapState(body);

    const bodyStuckPlaces: Array<string> = [];

    if (outOfBottomMapBorder) {
      body.position.setY(bottomY);
      bodyStuckPlaces.push('downMapBorder');
    }
    if (outOfRightMapBorder) {
      body.position.setX(rightX);
      bodyStuckPlaces.push('rightMapBorder');
    }
    if (outOfTopMapBorder) {
      body.position.setY(topY);
      bodyStuckPlaces.push('topMapBorder');
    }
    if (outOfLeftMapBorder) {
      body.position.setX(leftX);
      bodyStuckPlaces.push('leftMapBorder');
    }

    return bodyStuckPlaces;
  };

  private handleBodyStuckPlaces = (body: ColliderBody): void => {
    const bodyStuckPlacesWithStaticObstacles = this.handleBodyStuckPlacesWithStaticObstacles(body);
    const bodyStuckPlacesWithMapBorders = this.handleBodyStuckPlacesWithMapBorders(body);

    const bodyStuckPlaces = [...bodyStuckPlacesWithStaticObstacles, ...bodyStuckPlacesWithMapBorders];

    if (bodyStuckPlaces.length > 0) {
      bodyStuckPlaces.forEach((stuckPlace) => {
        this.stucks.add(body.id, stuckPlace);
      });
    } else {
      this.stucks.remove(body.id);
    }
  };

  private handleBodyCollision = (body: ColliderBody): void => {
    const prevBodyHitbox = this.bodiesPrevHitboxes.list[body.id];
    const bodyMovementDirection = this.helpers.getMovementDirectionByHitbox(
      prevBodyHitbox,
      body.hitbox,
    );

    if (bodyMovementDirection !== null) {
      this.handleBodyStuckPlaces(body);
    }
  };

  private checkBodyForStucking = (body: ColliderBody): void => {
    if (isCharacter(body)) {
      const isBodyStucked = this.helpers.isBodyStucked(body.id);
      body.movement.setIsStuck(isBodyStucked);
    }
  };

  private checkBodyForSliding = (body: ColliderBody): void => {
    if (isCharacter(body)) {
      const prevBodyHitbox = this.bodiesPrevHitboxes.list[body.id];

      const isXChanged = this.helpers.isXChanged(prevBodyHitbox, body.hitbox);
      const isYChanged = this.helpers.isYChanged(prevBodyHitbox, body.hitbox);

      const bodyIsStucked = this.helpers.isBodyStucked(body.id);
      const onlyOneCoordinateChanged = (isXChanged && !isYChanged) || (!isXChanged && isYChanged);

      const bodyIsSliding = bodyIsStucked && onlyOneCoordinateChanged;

      body.movement.setIsSliding(bodyIsSliding);
    }
  };

  private savePrevBodiesHitboxesIfNoPrevHitboxes = (body: ColliderBody): void => {
    if (this.bodiesPrevHitboxes.list[body.id] === undefined) {
      this.bodiesPrevHitboxes.saveBodyHitbox(body);
    }
  };

  private handleColliderBody = (body: ColliderBody): void => {
    this.savePrevBodiesHitboxesIfNoPrevHitboxes(body);
    this.handleBodyCollision(body);
    this.checkBodyForStucking(body);
    this.checkBodyForSliding(body);
    this.bodiesPrevHitboxes.saveBodyHitbox(body);
  };
  private handleColliderBodies = (): void => {
    this.bodyList.elements.forEach(this.handleColliderBody);
  };

  update = (): void => {
    this.handleColliderBodies();
  };
}
