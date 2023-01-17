import { nanoid } from 'nanoid'
import { Size } from 'project-utility-types/abstract'
import { PointPair } from 'project-utility-types/plane'

import { Position } from './entities/position'

export type BodyConfig = {
  is: string
}

export class Body {
  // показывает, чем является тело
  is: string

  constructor(config: BodyConfig) {
    const { is } = config
    this.is = is
  }

  readonly id = nanoid(6)

  size: Size = { width: 0, height: 0 }
  protected setSize = (size: Size): void => {
    this.size = size
  }

  position = new Position()

  get hitbox(): PointPair {
    return {
      x1: this.position.x,
      y1: this.position.y,
      x2: this.position.x + this.size.width,
      y2: this.position.y + this.size.height,
    }
  }
}
