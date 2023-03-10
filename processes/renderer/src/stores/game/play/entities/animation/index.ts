import { Indexes } from 'project-utility-types/abstract';
import { Callback } from 'shared/types/basic-utility-types';

import { Regulators } from '../regulators';
import { Sprite } from '../sprite';
import { SpriteSheet } from '../sprite-sheet';
import {
  AnimationRegulatorList,
  AnimationRegulatorTarget,
  regulatorTargetsInitialValues,
} from './regulators';

export type AnimationSequence = Array<Indexes>;

export type AnimationControls = {
  run: Callback;
  stop: Callback;
};

export type AnimationRegulatorsType<RegulatorName extends string> = Regulators<
  Animation<RegulatorName>,
  RegulatorName,
  AnimationRegulatorTarget
>;

export type RunAnimationOptions<RegulatorName extends string = never> = Partial<
  Pick<AnimationConfig<RegulatorName>, 'framesPerSprite'>
>;

export type AnimationConfig<RegulatorName extends string = never> = {
  name: string;
  spriteSheet: SpriteSheet;
  sequence: AnimationSequence;
  framesPerSprite: number;
  initialScale: number;
  startFrom?: number;
  regulators?: AnimationRegulatorList<RegulatorName>;
};

export class Animation<RegulatorName extends string = never> {
  name: string;
  private spriteSheet: SpriteSheet;
  sequence: AnimationSequence;
  baseFramesPerSprite: number;
  framesPerSprite: number;
  scale: number;
  private startFrom: number;
  currentSpriteIndex: number;
  regulators: AnimationRegulatorsType<RegulatorName> | null;

  frameCount = 0;
  isPlaying = false;
  isPaused = false;

  constructor(config: AnimationConfig<RegulatorName>) {
    const { name, spriteSheet, sequence, framesPerSprite, initialScale, startFrom, regulators } =
      config;

    this.name = name;
    this.spriteSheet = spriteSheet;
    this.sequence = sequence;
    this.setBaseFramesPerSprite(framesPerSprite);
    this.setScale(initialScale);

    this.startFrom = startFrom ?? 0;

    if (regulators) {
      this.regulators = new Regulators(this as Animation, regulators, {
        targetsInitialValues: regulatorTargetsInitialValues,
      }) as AnimationRegulatorsType<RegulatorName> | null;
    } else {
      this.regulators = null;
    }

    this.currentSpriteIndex = this.startFrom;
  }

  setScale = (scale: number): void => {
    this.scale = scale;
  };

  setCurrentSpriteIndex = (value: number): void => {
    this.currentSpriteIndex = value;
  };
  updateCurrentSpriteIndex = (): void => {
    if (this.currentSpriteIndex === this.sequence.length - 1) {
      this.setCurrentSpriteIndex(0);
    } else {
      this.currentSpriteIndex += 1;
    }
  };

  private setFrameCount = (value: number): void => {
    this.frameCount = value;
  };
  private updateFrameCount = (): void => {
    this.frameCount += 1;
  };
  private toFirstSprite = (): void => {
    this.setFrameCount(0);
    this.setCurrentSpriteIndex(0);
  };

  setBaseFramesPerSprite = (value: number): void => {
    this.baseFramesPerSprite = value;
    if (!this.framesPerSprite) {
      this.framesPerSprite = this.baseFramesPerSprite;
    }
    this.regulators?.modifyAllRegulatorTargets();
  };

  update = (): void => {
    if (!this.isPlaying) {
      return;
    }
    if (!this.isPaused) {
      if (this.frameCount === 0) {
        this.setCurrentSpriteIndex(this.startFrom);
      }
      if (this.frameCount > this.framesPerSprite) {
        this.updateCurrentSpriteIndex();
        this.setFrameCount(0);
      }
      this.updateFrameCount();
    }
  };

  run = (options?: RunAnimationOptions<RegulatorName>): void => {
    const { framesPerSprite } = options ?? {};

    if (framesPerSprite) {
      this.setBaseFramesPerSprite(framesPerSprite);
    }

    this.isPlaying = true;
  };
  stop = (): void => {
    this.isPlaying = false;
    this.toFirstSprite();
  };

  pause = (): void => {
    this.isPaused = true;
  };
  resume = (): void => {
    this.isPaused = false;
  };

  get currentSprite(): Sprite {
    const [row, column] = this.sequence[this.currentSpriteIndex];
    return this.spriteSheet.getSprite(row, column, { scale: this.scale });
  }
}
