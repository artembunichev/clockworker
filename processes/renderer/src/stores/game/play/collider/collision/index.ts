import { PointPair } from 'project-utility-types/plane';

import { List } from 'stores/entities/list-controller';

import { Body } from '../../body';
import { AnyCharacter } from '../../characters/character';
import { PlayerCharacter } from '../../characters/list/player/character';
import { GameScreen } from '../../screen';
import { ColliderCollisionCore } from './core';
import { ColliderCollisionHelpers } from './helpers';
import { ColliderCollisionWork } from './work';

export type ColliderBody = Body | AnyCharacter | PlayerCharacter;
export type BodyList = List<ColliderBody, 'id'>;
export const isCharacter = (body: ColliderBody): body is AnyCharacter => {
  return (body as AnyCharacter).movement !== undefined;
};

export type HitboxWithId = { hitbox: PointPair; id: string };
export type ObstacleList = List<HitboxWithId, 'id'>;
export type Obstacles = Array<HitboxWithId>;

// bodies prev hitboxes
export type BodiesPrevHitboxesList = Record<string, PointPair>;
export class BodiesPrevHitboxes {
  list: BodiesPrevHitboxesList = {};

  saveBodyHitbox = (body: ColliderBody): void => {
    this.list[body.id] = body.hitbox;
  };
}

// stucks
type StuckList = Record<string, Array<string>>;
export class Stucks {
  list: StuckList = {} as StuckList;

  constructor(initialList?: StuckList) {
    if (initialList) {
      this.list = initialList;
    }
  }

  add = (bodyId: string, stuckPlace: string): void => {
    if (!this.list[bodyId]) {
      this.list[bodyId] = [];
    }
    if (!this.list[bodyId].includes(stuckPlace)) {
      this.list[bodyId].push(stuckPlace);
    }
  };
  remove = (bodyId: string): void => {
    this.list[bodyId] = [];
  };
}

// main
type Config = {
  screen: GameScreen;
};

export class ColliderCollision {
  private screen: GameScreen;
  core: ColliderCollisionCore;
  work: ColliderCollisionWork;
  helpers: ColliderCollisionHelpers;

  bodyList = new List<ColliderBody, 'id'>([], { identifier: 'id' });
  staticObstacleList = new List<HitboxWithId, 'id'>([], { identifier: 'id' });
  stucks: Stucks = new Stucks();
  bodiesPrevHitboxes = new BodiesPrevHitboxes();

  constructor(config: Config) {
    const { screen } = config;

    this.screen = screen;

    this.helpers = new ColliderCollisionHelpers({
      obstacleList: this.staticObstacleList,
      stucks: this.stucks,
      screen: this.screen,
    });

    this.core = new ColliderCollisionCore({
      obstacleList: this.staticObstacleList,
      bodiesPrevHitboxesList: this.bodiesPrevHitboxes.list,
      helpers: this.helpers,
    });

    this.work = new ColliderCollisionWork({
      core: this.core,
      obstacleList: this.staticObstacleList,
      bodyList: this.bodyList,
      bodiesPrevHitboxes: this.bodiesPrevHitboxes,
      stucks: this.stucks,
      helpers: this.helpers,
    });
  }

  clear = (): void => {
    this.bodyList.clear();
    this.staticObstacleList.clear();
  };

  update = (): void => {
    this.work.update();
  };
}
